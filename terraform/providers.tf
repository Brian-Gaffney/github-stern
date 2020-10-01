provider "google" {
  project = "github-stern"
  region  = "us-central1"
}

provider "github" {
  token        = var.github_auth_token
  organization = "ONEOKI"
}

# To enable visibility in Bridgecrew, create a limited permission role
# https://registry.terraform.io/modules/bridgecrewio/bridgecrew-gcp-read-only/google/latest
# module "bridgecrew-read" {
#   source                     = "bridgecrewio/bridgecrew-gcp-read-only/google"
#   org_name               = "deb"
#   bridgecrew_token = "872947f9-e3ba-55db-9bd7-5cfc0a13fa69"
#   project_id = "github-stern"
# }