# Homeserver Wake Up Server

Simple flask server that wakes up the homeserver on request. This is deployed on low-power device (should've be Raspberry Pi, but i only got old android phone with termux installed) that always on and connected to the same network as the homeserver.

Setup on termux:
1. `pkg install python && pip install flask`
2. `git clone` this repo
3. `python app.py` to test
4. `nohup python app.py &` to run in background