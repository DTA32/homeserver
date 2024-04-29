#!/bin/bash

# Location: {Project Location}/daily-cleanup.sh
# Description: Script to daily cleanup Laravel application
# Notes: 

echo "${date} - daily-cleanup-PROJECT_NAME.sh - start"

cd /var/www/PROJECT_NAME

# Run Laravel database cleanup command
php artisan migrate --force
php artisan db:seed --force

# Clear cache and re-cache
php artisan cache:clear
php artisan optimize
php artisan view:cache

echo "${date} - daily-cleanup-PROJECT_NAME.sh - end"