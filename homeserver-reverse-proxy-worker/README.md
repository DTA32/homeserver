this cloudflare worker used to proxy and call wake-up server

- if homeserver currently on sleep, this worker will trigger android-as-a-server (AAAS) on my local network to wake homeserver
- if homeserver is already on, this worker will just forward the request to homeserver
