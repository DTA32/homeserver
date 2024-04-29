# Location: /usr/local/bin/scripts/update_dns.py
# Description: Update Cloudflare DNS record with current public IP address
# Notes: used because my isp changes my public ip address randomly although i didn't restart the router, f u i------e

import requests
import json
import os
from datetime import datetime

print(datetime.now().strftime('%Y-%m-%d %H:%M:%S') + ' - update_dns.py start')
# Cloudflare API key
cf_api_key = os.environ.get('CF_API_KEY')
# Cloudflare email
cf_email = os.environ.get('CF_EMAIL')
# Zone ID
zone_id = os.environ.get('ZONE_ID')
# DNS record ID
dns_record_id_raw = os.environ.get('DNS_RECORD_ID')
dns_record_id = dns_record_id_raw.split(',')
# DNS record name
dns_record_name_raw = os.environ.get('DNS_RECORD_NAME')
dns_record_name = dns_record_name_raw.split(',')

if(cf_api_key == None or cf_email == None or zone_id == None or dns_record_id_raw == None or dns_record_name_raw == None):
    print('Environment variables are not set')
    exit()

# Get current public IP address
public_ip_response = requests.get('https://api.ipify.org')
if(public_ip_response.status_code != 200):
    print('Failed to get public IP address, check internet connection!')
    exit()
public_ip = public_ip_response.text

# Update DNS record with current public IP address
for i in range(len(dns_record_id)):
    url_get = 'https://api.cloudflare.com/client/v4/zones/' + zone_id + '/dns_records/' + dns_record_id[i]
    headers_get = {
        'X-Auth-Email': cf_email,
        'X-Auth-Key': cf_api_key,
        'Content-Type': 'application/json'
    }
    response_get = requests.get(url_get, headers=headers_get)
    response_json = response_get.json()
    if response_json['result']['content'] == public_ip:
        print(i + '. IP address is up to date')
        continue

    url = 'https://api.cloudflare.com/client/v4/zones/' + zone_id + '/dns_records/' + dns_record_id[i]
    headers = {
        'X-Auth-Email': cf_email,
        'X-Auth-Key': cf_api_key,
        'Content-Type': 'application/json'
    }
    data = {
        'type': 'A',
        'name': dns_record_name[i],
        'content': public_ip,
        'ttl': 1,
        'proxied': False
    }
    response = requests.put(url, headers=headers, data=json.dumps(data))

    if response.status_code == 200:
        print(i + '. DNS record updated successfully')
    else:
        print(i + '. Failed to update DNS record')
        print(response.text)

print(datetime.now().strftime('%Y-%m-%d %H:%M:%S') + ' - update_dns.py finish')