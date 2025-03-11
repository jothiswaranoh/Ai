class CreateEducations < ActiveRecord::Migration[7.1]
  def change
    create_table :educations do |t|
      t.references :resume, null: false, foreign_key: true
      t.string :degree
      t.string :university
      t.string :year

      t.timestamps
    end
  end
end
