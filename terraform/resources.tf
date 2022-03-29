# GCP Cloud Bucket to hold the code
# https://console.cloud.google.com/storage/browser?referrer=search&authuser=1&project=github-stern&prefix=
resource "google_storage_bucket" "bucket" {
  name                        = "github-stern"
  uniform_bucket_level_access = false
}

# GCP Cloud Function
# https://console.cloud.google.com/functions/list?referrer=search&authuser=1&project=github-stern
resource "google_cloudfunctions_function" "function" {
  name        = "github-stern-cloud-function"
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

# Github webhook
# https://github.com/ONEOKI/http-server/settings/hooks
resource "github_repository_webhook" "github_stern" {
  repository = "http-server"

  configuration {
    url          = google_cloudfunctions_function.function.https_trigger_url
    content_type = "json"
    insecure_ssl = false
  }

  events = ["pull_request"]
  # events = ["pull_request", "issue_comment"]
}
