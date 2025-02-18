class CreateResumes < ActiveRecord::Migration[7.1]
  def change
    create_table :resumes do |t|
      t.string :full_name
      t.string :email
      t.string :phone
      t.string :linkedin
      t.string :github
      t.string :portfolio
      t.string :address
      t.string :category
      t.integer :total_experience
      t.string :status

      t.timestamps
    end
  end
end
