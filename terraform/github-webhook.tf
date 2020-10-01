resource "github_repository_webhook" "github_stern" {
  repository = "http-server"

  configuration {
    url          = google_cloudfunctions_function.function.https_trigger_url
    content_type = "json"
    insecure_ssl = false
  }

  events = ["pull_request"]
}
