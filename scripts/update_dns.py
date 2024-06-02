# Location: /usr/local/bin/scripts/update_dns.py
# Description: Update Cloudflare DNS record with current public IP address
# Notes: used because my isp changes my public ip address randomly although i didn't restart the router, f u i------e

import requests
import json
import env
from datetime import datetime

settings = {
    'ip_info': env.IP_INFO,
    'webhook_url': env.WEBHOOK_URL,
    'cf_api_key': env.CF_API_KEY,
    'cf_email': env.CF_EMAIL,
    'zone_id': env.ZONE_ID,
    'dns_record': env.DNS_RECORD
}

def logger(message):
    # specifically created to post to discord webhook
    username = 'update-dns.py'
    webhook_url = settings['webhook_url']
    # reminder to myself: to export this, turn username and webhook into function params
    data = {
        'content': message,
        'username': username,
    }
    response = requests.post(webhook_url, data=json.dumps(data), headers={'Content-Type': 'application/json'})
    # log to local if failed to log to webhook
    if response.status_code != 204:
        print(username + ' - failed to log to webhook - ' + response.text)
        print(message)

def main():
    for key, value in settings.items():
        if value == None:
            logger(message=f'ERR: {key} is not set')
            exit()
    start = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    logger(message=f'{start} - start')

    # Get current public IP address
    public_ip_response = requests.get(settings['ip_info'])
    if(public_ip_response.status_code != 200):
        logger(message=f'ERR: Failed to get public IP address, check internet connection!')
        exit()
    public_ip = public_ip_response.text

    # Update DNS record with current public IP address
    i = 1
    for record in settings['dns_record']:
        url_get = 'https://api.cloudflare.com/client/v4/zones/' + settings['zone_id'] + '/dns_records/' + record['id']
        headers = {
            'X-Auth-Email': settings['cf_email'],
            'X-Auth-Key': settings['cf_api_key'],
            'Content-Type': 'application/json'
        }
        response_get = requests.get(url_get, headers=headers)
        response_json = response_get.json()
        # skip if still up to date, and update if not
        if response_json['result']['content'] == public_ip:
            logger(message=f'{i}. {record["name"]} - DNS record is up to date')
        else:
            url = 'https://api.cloudflare.com/client/v4/zones/' + settings['zone_id'] + '/dns_records/' + record['id']
            data = {
                'type': 'A',
                'name': record['name'],
                'content': public_ip,
                'proxied': record['proxied'],
            }
            response = requests.put(url, headers=headers, data=json.dumps(data))

            if response.status_code == 200:
                logger(f'{i}. {record["name"]} - DNS record updated successfully')
            else:
                logger(f'{i}. {record["name"]} - Failed to update DNS record')
                logger(f'Reason: {response.text}')
        i += 1

    end = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    logger(f'{end} - finish')

if __name__ == '__main__':
    main()