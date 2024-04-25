import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
import os


def email_alert(subject, body, to):
    msg = EmailMessage()
    msg.set_content(body)
    msg['Subject'] = subject
    msg['to'] = to
    msg['from'] = 'Man Njoro'
    user = os.getenv("EMAIL")
    password = os.getenv("PASSWORD")

    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(user, password)
    server.send_message(msg)

    server.quit()

if __name__ == '__main__':
    load_dotenv()
    receiver = os.getenv("RECEIVER_EMAIL")
    email_alert('Finally', 'It works!', receiver)