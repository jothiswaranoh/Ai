class UpdateResume < ActiveRecord::Migration[8.0]
    def change
      # Update resumes table
      change_table :resumes do |t|
        t.rename :full_name, :first_name
        t.string :last_name
        t.string :headline
        t.text :summary
        t.string :country
        t.string :city
        t.string :postal_code
      end
  
      # Update skills table
      change_table :skills do |t|
        t.integer :proficiency
        t.integer :years_of_experience
      end
  
      # Update educations table
      change_table :educations do |t|
        t.string :field_of_study
        t.integer :start_year
        t.integer :end_year
      end
  
      # Update projects table
      change_table :projects do |t|
        t.date :start_date
        t.date :end_date
        t.text :technologies
        t.string :title
        t.string :project_url
      end
  
      # Update work_experiences table
      change_table :work_experiences do |t|
        t.rename :title, :role
        t.date :start_date
        t.date :end_date
        t.string :location
        t.text :achievements
      end
  
      # Create references table
      create_table :references do |t|
        t.string :reference_name
        t.string :languages
        t.string :email
        t.string :phone
        t.string :linkedin
        t.string :github
        t.string :portfolio
        t.string :address
        t.timestamps
      end
    end  
end
