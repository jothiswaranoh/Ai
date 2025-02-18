class Api::V1::ResumesController < ApplicationController
  def create
    resume = Resume.new(resume_params)

    if resume.save
      render json: { id: resume.id, message: 'Resume uploaded successfully' }, status: :created
    else
      render json: { errors: resume.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    resume = Resume.find_by(id: params[:id])

    if resume.present? && resume.file.attached?
      data = process_resume(resume.file)
      save_resume_data(resume, data) # Save data to tables``
      render json: data
    else
      render json: { error: 'Resume not found or file missing' }, status: :not_found
    end
  end

  private

  def resume_params
    params.permit(:full_name, :email, :phone, :linkedin, :github, :portfolio, :address, :category, :total_experience,
                  :file)
  end

  def process_resume(file)
    resume_text = extract_text_from_file(file)
    parsed_data = analyze_resume_with_gemini(resume_text)
    store_resume(parsed_data)
  end

  def save_resume_data(resume, data)
    # Update Resume with basic details
    resume.update(
      full_name: data[:full_name],
      email: data[:email],
      phone: data[:phone],
      linkedin: data[:linkedin],
      github: data[:github],
      portfolio: data[:portfolio],
      address: data[:address],
      category: data[:category],
      total_experience: parse_total_experience(data[:total_experience]),
      status: data[:status] || 'active'
    )

    # Insert Skills
    skills = data[:skills]&.split(',')&.map(&:strip)
    skills&.each do |skill_name|
      Skill.find_or_create_by!(resume_id: resume.id, name: skill_name)
    end

    # Insert Education
    data[:education]&.each do |edu|
      Education.create!(
        resume_id: resume.id,
        degree: edu[:degree], # Use symbol keys
        university: edu[:institution],
        year: edu[:year]
      )
    end

    # Insert Projects
    data[:projects]&.each do |proj|
      Project.create!(
        resume_id: resume.id,
        name: proj[:title], # Use symbol keys
        description: proj[:description]
      )
    end

    # Insert Work Experience
    data[:experience]&.each do |exp|
      WorkExperience.create!(
        resume_id: resume.id,
        title: exp[:title], # Use symbol keys
        company: exp[:company],
        duration: exp[:years]
      )
    end

    # Insert Languages (if provided)
    languages = data[:languages]&.split(',')&.map(&:strip)
    languages&.each do |lang|
      Language.find_or_create_by!(resume_id: resume.id, name: lang)
    end
  end

  def parse_total_experience(experience)
    # Here you can parse the "1 year 1 month" format and convert to a usable value (e.g., months or years)
    experience # Adjust as necessary
  end

  # Extract text from PDF
  def extract_text_from_pdf(file)
    reader = PDF::Reader.new(file.download)
    reader.pages.map(&:text).join("\n")
  rescue StandardError => e
    Rails.logger.error("PDF parsing error: #{e.message}")
    ''
  end

  def extract_text_from_file(file)
    case File.extname(file.blob.filename.to_s)
    when '.pdf'
      extract_text_from_pdf(file)
    when '.docx'
      extract_text_from_docx(file)
    else
      Rails.logger.error("Unsupported file format: #{file.original_filename}")
      ''
    end
  end

  def extract_text_from_docx(file)
    doc = Docx::Document.open(file.download)
    doc.paragraphs.map(&:text).join("\n")
  rescue StandardError => e
    Rails.logger.error("DOCX parsing error: #{e.message}")
    ''
  end

  # Send extracted text to Gemini API
  def analyze_resume_with_gemini(resume_text)
    return {} if resume_text.blank?

    response = HTTParty.post(
      api_url,
      headers: { 'Content-Type' => 'application/json' },
      body: {
        contents: [
          {
            parts: [
              {
                text: "Extract structured data from this resume in JSON format with the following fields:
              - `full_name`
              - `email`
              - `phone`
              - `linkedin`
              - `github`
              - `portfolio`
              - `address`
              - `category`
              - `total_experience`
              - `skills` (as an array)
              - `experience` (as an array of objects with `title`, `company`, `years`)
              - `education` (as an array of objects with `degree`, `institution`, `year`)
              - `projects` (as an array of objects with `title`, `technologies`, `description`)
              - `certifications`
              - `workshops`
              - `achievements`
              Extract only relevant structured information.

              Resume text:
              #{resume_text}"
              }
            ]
          }
        ]
      }.to_json
    )
    binding.pry
    parsed_response = JSON.parse(response.body)

    # Extract the AI-generated text
    extracted_text = parsed_response.dig('candidates', 0, 'content', 'parts', 0, 'text')
    return {} if extracted_text.blank?

    if response.success?
      cleaned_text = extracted_text.strip.sub(/\A```json/, '').sub(/```\z/, '')
      JSON.parse(cleaned_text)
    else
      Rails.logger.error("Gemini API error: #{response.code} - #{response.body}")
      {}
    end
  rescue StandardError => e
    Rails.logger.error("Exception: #{e.message}")
    {}
  end

  # Store parsed data in the Resume model
  def store_resume(parsed_data)
    return {} unless parsed_data.present?

    {
      full_name: parsed_data['full_name'],
      email: parsed_data['email'],
      phone: parsed_data['phone'],
      linkedin: parsed_data['linkedin'],
      github: parsed_data['github'],
      portfolio: parsed_data['portfolio'],
      address: parsed_data['address'],
      category: parsed_data['category'],
      total_experience: parsed_data['total_experience'],
      skills: parsed_data['skills']&.join(', '),
      experience: parsed_data['experience']&.map do |exp|
        {
          title: exp['title'],
          company: exp['company'],
          years: exp['years']
        }
      end,
      education: parsed_data['education']&.map do |edu|
        {
          degree: edu['degree'],
          institution: edu['institution'],
          year: edu['year']
        }
      end,
      projects: parsed_data['projects']&.map do |proj|
        {
          title: proj['title'],
          technologies: proj['technologies'],
          description: proj['description']
        }
      end
    }
  end

  def api_url
    api_key = 'AIzaSyBkvHx8PsQ6ST_W8W8c8J9sK_jwH_JUELo'
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=#{api_key}"
  end
end
