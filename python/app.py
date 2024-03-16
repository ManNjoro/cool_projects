import os
from flask import Flask, request, jsonify
from send_sms import send_sms

app = Flask(__name__)

#TODO: create incoming messages route
@app.route('/incoming-messages', methods=['POST'])
def incoming_messages():
    data = request.get_json(force=True)
    print(f'Incoming message...\n ${data}')
    return jsonify({"message": "incoming"}), 200

#TODO: create delivery reports route.

if __name__ == "__main__":
    #TODO: Call send message function
    send_sms().sending()
    
    app.run(debug=True, port = os.environ.get("PORT"))
