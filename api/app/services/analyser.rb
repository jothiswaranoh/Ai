require 'net/http'
require 'json'
require 'pdf-reader'

class Analyser
  API_KEY = AIzaSyBkvHx8PsQ6ST_W8W8c8J9sK_jwH_JUELo # Store API key in ENV for security
  API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key=#{API_KEY}"

  def initialize(file)
    @file = file
  end

  def process
    resume_text = extract_text_from_pdf(@file)
    parsed_data = analyze_resume_with_gemini(resume_text)
    store_resume(parsed_data)
  end

  private

  # Extract text from PDF
  def extract_text_from_pdf(file)
    reader = PDF::Reader.new(file.path)
    reader.pages.map(&:text).join("\n")
  rescue StandardError => e
    Rails.logger.error("PDF parsing error: #{e.message}")
    ''
  end

  # Send extracted text to Gemini API
  def analyze_resume_with_gemini(resume_text)
    uri = URI(API_URL)
    request = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')

    request.body = {
      'prompt' => { 'text' => "Extract key details from this resume: #{resume_text}" },
      'temperature' => 0.5
    }.to_json

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(request) }
    JSON.parse(response.body)
  rescue StandardError => e
    Rails.logger.error("Gemini API error: #{e.message}")
    {}
  end

  # Store parsed data in the Resume model
  def store_resume(parsed_data)
    return unless parsed_data.present?

    Resume.create!(
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
    )
  end
end
