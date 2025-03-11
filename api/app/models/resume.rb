class Resume < ApplicationRecord
  has_many :work_experiences, dependent: :destroy
  has_many :educations, dependent: :destroy
  has_many :skills, dependent: :destroy
  has_many :projects, dependent: :destroy
  has_many :certifications, dependent: :destroy
  has_many :languages, dependent: :destroy
  has_many :resume_files, dependent: :destroy
  has_one_attached :file
end
