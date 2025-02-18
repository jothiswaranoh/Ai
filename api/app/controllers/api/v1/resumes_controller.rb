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
      binding.pry
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
    binding.pry
    return {} if resume_text.blank?

    binding.pry
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

    parsed_response = JSON.parse(response.body)

    # Extract the AI-generated text
    extracted_text = parsed_response.dig('candidates', 0, 'content', 'parts', 0, 'text')
    binding.pry
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
      full_name: parsed_data['name'],
      email: parsed_data['email'],
      phone: parsed_data['phone'],
      linkedin: parsed_data['linkedin'],
      github: parsed_data['github'],
      portfolio: parsed_data['portfolio'],
      address: parsed_data['address'],
      category: parsed_data['category'],
      total_experience: parsed_data['experience']&.dig(0, 'years'),
      skills: parsed_data['skills']&.join(', ')
    }
  end

  def api_url
    api_key = 'AIzaSyBkvHx8PsQ6ST_W8W8c8J9sK_jwH_JUELo'
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=#{api_key}"
  end
end
