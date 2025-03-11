# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_03_10_075425) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "certifications", force: :cascade do |t|
    t.bigint "resume_id", null: false
    t.string "name"
    t.string "year"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["resume_id"], name: "index_certifications_on_resume_id"
  end

  create_table "educations", force: :cascade do |t|
    t.bigint "resume_id", null: false
    t.string "degree"
    t.string "university"
    t.string "year"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "field_of_study"
    t.integer "start_year"
    t.integer "end_year"
    t.index ["resume_id"], name: "index_educations_on_resume_id"
  end

  create_table "languages", force: :cascade do |t|
    t.bigint "resume_id", null: false
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["resume_id"], name: "index_languages_on_resume_id"
  end

  create_table "projects", force: :cascade do |t|
    t.bigint "resume_id", null: false
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "start_date"
    t.date "end_date"
    t.text "technologies"
    t.string "title"
    t.string "project_url"
    t.index ["resume_id"], name: "index_projects_on_resume_id"
  end

  create_table "references", force: :cascade do |t|
    t.string "reference_name"
    t.string "languages"
    t.string "email"
    t.string "phone"
    t.string "linkedin"
    t.string "github"
    t.string "portfolio"
    t.string "address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "resume_files", force: :cascade do |t|
    t.bigint "resume_id", null: false
    t.string "file_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["resume_id"], name: "index_resume_files_on_resume_id"
  end

  create_table "resumes", force: :cascade do |t|
    t.string "first_name"
    t.string "email"
    t.string "phone"
    t.string "linkedin"
    t.string "github"
    t.string "portfolio"
    t.string "address"
    t.string "category"
    t.integer "total_experience"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "last_name"
    t.string "headline"
    t.text "summary"
    t.string "country"
    t.string "city"
    t.string "postal_code"
  end

  create_table "sessions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "ip_address"
    t.string "user_agent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "skills", force: :cascade do |t|
    t.bigint "resume_id", null: false
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "proficiency"
    t.integer "years_of_experience"
    t.index ["resume_id"], name: "index_skills_on_resume_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email_address", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email_address"], name: "index_users_on_email_address", unique: true
  end

  create_table "work_experiences", force: :cascade do |t|
    t.bigint "resume_id", null: false
    t.string "role"
    t.string "company"
    t.string "duration"
    t.text "responsibilities"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "start_date"
    t.date "end_date"
    t.string "location"
    t.text "achievements"
    t.index ["resume_id"], name: "index_work_experiences_on_resume_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "certifications", "resumes"
  add_foreign_key "educations", "resumes"
  add_foreign_key "languages", "resumes"
  add_foreign_key "projects", "resumes"
  add_foreign_key "resume_files", "resumes"
  add_foreign_key "sessions", "users"
  add_foreign_key "skills", "resumes"
  add_foreign_key "work_experiences", "resumes"
end
