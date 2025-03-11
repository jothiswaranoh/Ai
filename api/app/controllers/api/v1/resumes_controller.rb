class Api::V1::ResumesController < ApplicationController
  allow_unauthenticated_access only: %i[create show]

  def create
    resume = Resume.new(resume_params)

    if resume.save
      resume.file.attach(params[:file]) if params[:file].present?

      if resume.file.attached?
        data = process_resume(params[:file])
        save_resume_data(resume, data)
        render json: { id: resume.id, message: 'Resume uploaded successfully', data: resume_data(resume) }, status: :created
      else
        render json: { error: 'File attachment failed' }, status: :unprocessable_entity
      end
    else
      render json: { errors: resume.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    resume = Resume.find_by(id: params[:id])

    if resume.present? && resume.file.attached?
      data = process_resume(params[:file])
      render json: data
    else
      render json: { error: 'Resume not found or file missing' }, status: :not_found
    end
  end

  private

  def resume_params
    params.permit(:full_name, :email, :phone, :linkedin, :github, :portfolio, :address, :category, :total_experience)
  end

  def process_resume(file)
    resume_text = extract_text_from_file(file)

    return {} if resume_text.blank?

    parsed_data = analyze_resume_with_gemini(resume_text)
    store_resume(parsed_data)
  end

  def extract_text_from_file(file)
    case File.extname(file.original_filename.to_s).downcase
    when '.pdf'
      extract_text_from_pdf(file)
    when '.docx'
      extract_text_from_docx(file)
    else
      Rails.logger.error("Unsupported file format: #{file.filename}")
      ''
    end
  end

  def extract_text_from_pdf(file)
    reader = PDF::Reader.new(file.tempfile.path)
    reader.pages.map(&:text).join("\n")
  rescue StandardError => e
    Rails.logger.error("PDF parsing error: #{e.message}")
    ''
  end

  def extract_text_from_docx(file)
    doc = Docx::Document.open(file.download)
    doc.paragraphs.map(&:text).join("\n")
  rescue StandardError => e
    Rails.logger.error("DOCX parsing error: #{e.message}")
    ''
  end

  def analyze_resume_with_gemini(resume_text)
    response = HTTParty.post(
      api_url,
      headers: { 'Content-Type' => 'application/json' },
      body: {
        contents: [
          {
            parts: [
              {
                text: "Extract structured data from this resume in JSON format with the following fields:
                - `firstName`, `lastName`, `email`, `phone`, `linkedin`, `github`, `portfolio`, `address`, `headline`, `summary`, `country`, `city`, `postalCode`
                - `skills` (as an array of objects with `id`, `name`, `proficiency`, `yearsOfExperience`, `certifications`)
                - `workExperience` (as an array of objects with `id`, `company`, `role`, `startDate`, `endDate`, `duration`, `description`, `location`, `achievements`)
                - `education` (as an array of objects with `id`, `school`, `degree`, `fieldOfStudy`, `startYear`, `endYear`)
                - `projects` (as an array of objects with `id`, `name`, `description`, `startDate`, `endDate`, `technologies`, `projectUrl`)
                - `referenceName`, `languages` (as an array), `contact` (as an object with `email`, `phone`, `linkedin`, `github`, `portfolio`, `address`)
  
                Resume text:
                #{resume_text}"
              }
            ]
          }
        ]
      }.to_json
    )
  
    return {} unless response.success?
  
    parsed_response = JSON.parse(response.body)
    extracted_text = parsed_response.dig('candidates', 0, 'content', 'parts', 0, 'text')
    return {} if extracted_text.blank?
  
    cleaned_text = extracted_text.strip.sub(/\A```json/, '').sub(/```\z/, '')
    JSON.parse(cleaned_text)
  rescue StandardError => e
    Rails.logger.error("Gemini API error: #{e.message}")
    {}
  end
  

  def store_resume(parsed_data)
     return {} unless parsed_data.present?
  
    {
      first_name: parsed_data['firstName'],
      last_name: parsed_data['lastName'],
      email: parsed_data.dig('contact', 'email'),
      phone: parsed_data.dig('contact', 'phone'),
      linkedin: parsed_data.dig('contact', 'linkedin'),
      github: parsed_data.dig('contact', 'github'),
      portfolio: parsed_data.dig('contact', 'portfolio'),
      address: parsed_data.dig('contact', 'address'),
      headline: parsed_data['headline'],
      summary: parsed_data['summary'],
      country: parsed_data['country'],
      city: parsed_data['city'],
      postal_code: parsed_data['postalCode'],
      category: parsed_data['category'],
      total_experience: parsed_data['total_experience'],
      skills: parsed_data['skills']&.map { |s| 
      {
        name: s['name'], 
        proficiency: s['proficiency'], 
        years_of_experience: s['yearsOfExperience']
      } 
    },    
      experience: parsed_data['workExperience']&.map do |exp|
        {
          title: exp['role'],
          company: exp['company'],
          start_date: exp['startDate'],
          end_date: exp['endDate'],
          duration: exp['duration'],
          description: exp['description'],
          achievements: exp['achievements']
        }
      end,
      education: parsed_data['education']&.map do |edu|
        {
          degree: edu['degree'],
          institution: edu['school'],
          field_of_study: edu['fieldOfStudy'],
          start_year: edu['startYear'],
          end_year: edu['endYear']
        }
      end,
      projects: parsed_data['projects']&.map do |proj|
        {
          title: proj['name'],
          technologies: proj['technologies']&.join(', '),
          description: proj['description'],
          start_date: proj['startDate'],
          end_date: proj['endDate'],
          project_url: proj['projectUrl']
        }
      end,
      languages: parsed_data['languages']&.map do |lang|
        {
          name: lang
        }
      end
    }
  end
  

  def save_resume_data(resume, data)
    resume.update!(data.slice(:first_name, :last_name, :email, :phone, :linkedin, :github, :portfolio, 
    :address, :category, :total_experience, :headline, :summary, 
    :country, :city, :postal_code))
    save_associated_records(resume, data)
  end

  def save_associated_records(resume, data)
    save_skills(resume, data[:skills])
    save_education(resume, data[:education])
    save_projects(resume, data[:projects])
    save_experience(resume, data[:experience])
    save_languages(resume, data[:languages])
  end

  def save_skills(resume, skills)
    skills&.each do |skill|
      resume.skills.create!(
        name: skill[:name],
        proficiency: skill[:proficiency]&.downcase || 0, # Now matches enum keys
        years_of_experience: skill[:years_of_experience].to_i
      )
    end
  end

  def save_education(resume, education)
    education&.each do |edu|
      resume.educations.create!(
        degree: edu[:degree],
        university: edu[:institution], # Assuming `institution` maps to `university`
        field_of_study: edu[:field_of_study],
        start_year: edu[:start_year].to_i,
        end_year: edu[:end_year].to_i
      )
    end
  end

  def save_projects(resume, projects)
    projects&.each do |project|
      resume.projects.create!(
        title: project[:title],
        technologies: project[:technologies],
        description: project[:description],
        start_date: project[:start_date],
        end_date: project[:end_date],
        project_url: project[:project_url]
      )
    end
  end

  def save_experience(resume, experiences)
    experiences&.each do |experience|
      resume.work_experiences.create!(
        role: experience[:title],  # Assuming 'role' maps to 'title'
        company: experience[:company],
        start_date: experience[:start_date],
        end_date: experience[:end_date] == "Present" ? nil : experience[:end_date], # Handle 'Present' case
        duration: experience[:duration],
        responsibilities: experience[:description],
        achievements: experience[:achievements]&.join(", ") # Convert array to string
      )
    end
  end

  def save_languages(resume, languages)
    languages&.each { |lang| resume.languages.create!(name: lang[:name]) }
  end

  def resume_data(resume)
    {
      first_name: resume.first_name,
      last_name: resume.last_name,
      email: resume.email,
      phone: resume.phone,
      linkedin: resume.linkedin,
      github: resume.github,
      portfolio: resume.portfolio,
      address: resume.address,
      category: resume.category,
      total_experience: resume.total_experience,
      headline: resume.headline,
      summary: resume.summary,
      country: resume.country,
      city: resume.city,
      postal_code: resume.postal_code,
      
      skills: resume.skills.map do |skill|
        {
          name: skill.name,
          proficiency: skill.proficiency,
          years_of_experience: skill.years_of_experience
        }
      end,
  
      education: resume.educations.map do |edu|
        {
          degree: edu.degree,
          institution: edu.university,  # Assuming `institution` maps to `university`
          field_of_study: edu.field_of_study,
          start_year: edu.start_year,
          end_year: edu.end_year
        }
      end,
  
      projects: resume.projects.map do |project|
        {
          title: project.title,
          technologies: project.technologies,
          description: project.description,
          start_date: project.start_date,
          end_date: project.end_date,
          project_url: project.project_url
        }
      end,
  
      work_experience: resume.work_experiences.map do |experience|
        {
          title: experience.role,  # Assuming 'title' maps to 'role'
          company: experience.company,
          start_date: experience.start_date,
          end_date: experience.end_date || "Present",
          duration: experience.duration,
          description: experience.responsibilities,
          achievements: experience.achievements&.split(", ") || []
        }
      end,
  
      languages: resume.languages.map { |lang| { name: lang.name } }
    }
  end
  

  def api_url
    api_key = 'AIzaSyBkvHx8PsQ6ST_W8W8c8J9sK_jwH_JUELo'

    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=#{api_key}"
  end
end
