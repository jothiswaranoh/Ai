class CreateCertifications < ActiveRecord::Migration[7.1]
  def change
    create_table :certifications do |t|
      t.references :resume, null: false, foreign_key: true
      t.string :name
      t.string :year

      t.timestamps
    end
  end
end
