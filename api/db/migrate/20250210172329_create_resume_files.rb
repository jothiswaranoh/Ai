class CreateResumeFiles < ActiveRecord::Migration[7.1]
  def change
    create_table :resume_files do |t|
      t.references :resume, null: false, foreign_key: true
      t.string :file_type

      t.timestamps
    end
  end
end
