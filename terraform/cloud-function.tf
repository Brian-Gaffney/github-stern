locals {
  path_to_build = "../build/app.zip"
}

resource "google_storage_bucket" "bucket" {
  name = "github-stern"
  encryption {
    default_kms_key_name = true
  }
}

data "archive_file" "function_archive" {
  type        = "zip"
  source_dir  = "../build/"
  output_path = local.path_to_build
}

resource "google_storage_bucket_object" "archive" {
  name   = "app-${data.archive_file.function_archive.output_sha}.zip"
  bucket = google_storage_bucket.bucket.name
  source = local.path_to_build
}

resource "google_cloudfunctions_function" "function" {
  name        = "function-test"
  description = "My function"
  runtime     = "nodejs10"

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.bucket.name
  source_archive_object = google_storage_bucket_object.archive.name
  trigger_http          = true
  entry_point           = "app"

  environment_variables = {
    GITHUB_AUTH_TOKEN = var.github_auth_token
  }

  labels = {
    "managed_by" = "terraform"
  }
}

# IAM entry for all users to invoke the function
resource "google_cloudfunctions_function_iam_member" "invoker" {
  project        = google_cloudfunctions_function.function.project
  region         = google_cloudfunctions_function.function.region
  cloud_function = google_cloudfunctions_function.function.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}
