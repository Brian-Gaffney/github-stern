terraform {
  backend "gcs" {
    bucket  = "terraform-state-bucket-eda5152d-52b6-4f50-82f5-05aad96fdbf4"
    prefix  = "github-stern"
  }
}