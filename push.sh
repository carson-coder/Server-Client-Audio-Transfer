#! /bin/bash

git add .
git commit -m "$1"
git push origin main
git checkout gh-pages
git checkout main -- Web/*