#! /bin/bash

git add .
git commit -m "$1"
git push origin main
git checkout gh-pages
git pull
git checkout main -- Web/*
mv Web/* .
rmdir Web
git add .
git commit -m "Pages: $1"
git push origin gh-pages
git checkout main
git pull
