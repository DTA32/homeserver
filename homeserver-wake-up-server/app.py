from flask import Flask, jsonify, request
import os

app = Flask(__name__)

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "success", "message": "Server is up and running"}), 200

@app.route('/wake', methods=['GET'])
def wake_server():
    api_key = request.headers.get("X-API-KEY")
    if api_key != "REPLACE-WITH-PROPER-KEY":
        return jsonify({"status": "error", "message": "Invalid API key"}), 401
    broadcast_address = "SUBNET-BROADCAST-ADDRESS"
    server_mac = "REPLACE-WITH-CORRECT-MAC"
    os.system(f"wol -p 9 -h {broadcast_address} {server_mac}")
    return jsonify({"status": "success", "message": "WOL packet sent"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
