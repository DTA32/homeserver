#!/bin/bash
# not done yet!!!

# Location: /usr/local/bin/scripts/init.sh
# Description: Initialize the server with scripts, cron jobs, and nginx config
# Notes: not necesarily to be run as one file, just use as reference to apply changes

# Scripts
cp ./update_dns.py /usr/local/bin/scripts/update_dns.py
chmod +x /usr/local/bin/scripts/update_dns.py

# Cron jobs

# Nginx
cp ../nginx/vern /etc/nginx/sites-available/vern
ln -s /etc/nginx/sites-available/vern /etc/nginx/sites-enabled/vern

# Restart services
systemctl restart nginx
systemctl restart cron