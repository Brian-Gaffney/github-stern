locals {
  path_to_build = "../build/app.zip"
}

# IAM entry for all users to invoke the function
resource "google_cloudfunctions_function_iam_member" "invoker" {
  project        = google_cloudfunctions_function.function.project
  region         = google_cloudfunctions_function.function.region
  cloud_function = google_cloudfunctions_function.function.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
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
