class CreateWorkExperiences < ActiveRecord::Migration[7.1]
  def change
    create_table :work_experiences do |t|
      t.references :resume, null: false, foreign_key: true
      t.string :title
      t.string :company
      t.string :duration
      t.text :responsibilities

      t.timestamps
    end
  end
end
