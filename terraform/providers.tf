provider "google" {
  project = "github-stern"
  region  = "us-central1"
}

provider "github" {
  token        = var.github_auth_token
  organization = "ONEOKI"
}
