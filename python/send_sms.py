import africastalking

# TODO: Initialize Africa's Talking
username='sandbox'
api_key='102ed82ef0e89c66a0c33366ef975ce40ecb164b5ce4c3e02c1c8dcc5368217d'
africastalking.initialize(username, api_key)


class send_sms():

    sms = africastalking.SMS
    def sending(self):
        
        #TODO: Send message
        recipients = ["+254745662574", "+254781257695"]
        message = "Hey Njoro"
        sender = "20025"
        try:
            response = self.sms.send(message, recipients, sender)
            print (response)
        except Exception as e:
            print (f'Houston, we have a problem: {e}')