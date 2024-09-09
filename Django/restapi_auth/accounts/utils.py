import random
from django.core.mail import EmailMessage
from .models import User, OneTimePassword
from django.conf import settings
import pyotp


# Function to generate a unique secret key per user
def get_user_secret_key(user):
    otp_obj, created = OneTimePassword.objects.get_or_create(user=user)
    if created or not otp_obj.secret_key:
        otp_obj.secret_key = pyotp.random_base32()  # Generate a new unique secret
        otp_obj.save()
    return otp_obj.secret_key

def generate_otp(user):
    secret_key = get_user_secret_key(user)
    totp = pyotp.TOTP(secret_key, interval=300)  # Set OTP expiration to 5 minutes (300 seconds)
    return totp.now()

# use pyotp package
# def generateOtp():
#     otp = ""
#     for i in range(6):
#         otp += str(random.randint(1, 9))
#     return otp


def send_code_to_user(email):
    Subject = "One time passcode for Email verification"
    user = User.objects.get(email=email)
    otp_code = generate_otp(user)
    print(otp_code)
    current_site = "myAuth.com"
    email_body = f"Hi {user.first_name} thanks for signing up on {current_site}.Please verify your email with the \n one time passcode {otp_code}"
    from_email = settings.DEFAULT_FROM_EMAIL
    otp = OneTimePassword.objects.filter(user=user).exists()
    if not otp:
        OneTimePassword.objects.create(user=user, code=otp_code)
    d_email = EmailMessage(
        subject=Subject, body=email_body, from_email=from_email, to=[email]
    )
    print("otp:", otp_code)
    d_email.send(fail_silently=True)
    print("otp:", otp_code)


def send_normal_email(data):
    email = EmailMessage(
        subject=data['email_subject'],
        body=data['email_body'],
        from_email=settings.EMAIL_HOST_USER,
        to=[data['to_email']]
    )
    email.send()
    
# OTP verification function with extended expiration time
def verify_otp(user, otp_code):
    otp_obj = OneTimePassword.objects.get(user=user)

    secret_key = get_user_secret_key(user)
    totp = pyotp.TOTP(secret_key, interval=300)  # Use the same interval for verification
    
    if totp.verify(otp_code):
        # OTP is valid, mark it as used or delete if necessary
        OneTimePassword.objects.filter(user=user).delete()  # Optionally delete OTP after use
        return True, "OTP verified successfully."
    
    return False, "Invalid or expired OTP."