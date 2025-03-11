class Skill < ApplicationRecord
  belongs_to :resume
  
  enum :proficiency, {     beginner: 0,
  intermediate: 1,
  advanced: 2,
  expert: 3 }

end
