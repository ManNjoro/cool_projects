import smtplib
from email.message import EmailMessage

def email_alert(subject, body, to):
    msg = EmailMessage()
    msg.set_content(body)
    msg['Subject'] = subject
    msg['to'] = to
    msg['from'] = 'Man Njoro'
    user = "elijohnmwoho@gmail.com"
    password = "pxnh nyno eufi uiac"

    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(user, password)
    server.send_message(msg)

    server.quit()

if __name__ == '__main__':
    email_alert('Finally', 'It works!', 'eligachago@gmail.com')