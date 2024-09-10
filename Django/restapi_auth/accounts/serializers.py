from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import smart_bytes, force_str
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .utils import send_normal_email, send_code_to_user
from rest_framework_simplejwt.tokens import RefreshToken, TokenError


class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for registering a new user.

    Attributes:
        password (str): The password for the new user.
        password2 (str): The confirmation password for the new user.
    """

    password = serializers.CharField(max_length=68, min_length=8, write_only=True)
    password2 = serializers.CharField(max_length=68, min_length=8, write_only=True)

    class Meta:
        """
        Metadata for the UserRegisterSerializer.

        Attributes:
            model (User): The model that this serializer is for.
            fields (list): The fields that are included in this serializer.
        """

        model = User
        fields = ["email", "first_name", "last_name", "password", "password2"]

    def validate(self, attrs):
        """
        Validate the data that is being used to create a new user.

        Args:
            attrs (dict): The data that is being validated.

        Returns:
            dict: The validated data.

        Raises:
            serializers.ValidationError: If the passwords do not match.
        """
        password = attrs.get("password", "")
        password2 = attrs.get("password2", "")

        if password != password2:
            raise serializers.ValidationError("Passwords do not match")
        return attrs

    def create(self, validated_data):
        """
        Create a new user.

        Args:
            validated_data (dict): The validated data that is being used to create the new user.

        Returns:
            User: The new user.
        """
        user = User.objects.create_user(
            email=validated_data.get("email"),
            first_name=validated_data.get("first_name"),
            last_name=validated_data.get("last_name"),
            password=validated_data.get("password"),
        )
        return user


class LoginSerializer(serializers.ModelSerializer):
    """
    Serializer for logging in a user.

    Attributes:
        email (str): The email of the user.
        password (str): The password of the user.
        full_name (str): The full name of the user.
        access_token (str): The access token for the user.
        refresh_token (str): The refresh token for the user.
    """

    email = serializers.EmailField(max_length=255, min_length=6)
    password = serializers.CharField(max_length=68, min_length=8, write_only=True)
    full_name = serializers.CharField(max_length=255, read_only=True)
    access_token = serializers.CharField(max_length=255, read_only=True)
    refresh_token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        """
        Metadata for the LoginSerializer.

        Attributes:
            model (User): The model that this serializer is for.
            fields (list): The fields that are included in this serializer.
        """

        model = User
        fields = ["email", "password", "full_name", "access_token", "refresh_token"]

    def validate(self, attrs):
        """
        Validate the data that is being used to log in a user.

        Args:
            attrs (dict): The data that is being validated.

        Returns:
            dict: The validated data.

        Raises:
            AuthenticationFailed: If the credentials are invalid or the email is not verified.
        """
        email = attrs.get("email")
        password = attrs.get("password")
        request = self.context.get("request")
        user = authenticate(request, email=email, password=password)
        print("user", user)

        if not user:
            raise AuthenticationFailed("Invalid credentials, try again!")

        if not user.is_verified:
            raise AuthenticationFailed("Email is not verified")
        user_tokens = user.tokens()

        return {
            "email": user.email,
            "full_name": user.get_full_name,
            "access_token": str(user_tokens.get("access")),
            "refresh_token": str(user_tokens.get("refresh")),
        }


class PasswordResetRequestSerializer(serializers.Serializer):
    """
    Serializer for requesting a password reset.

    Attributes:
        email (str): The email of the user.
    """

    email = serializers.EmailField(max_length=255)

    class Meta:
        """
        Metadata for the PasswordResetRequestSerializer.

        Attributes:
            fields (list): The fields that are included in this serializer.
        """

        fields = ["email"]

    def validate(self, attrs):
        """
        Validate the data that is being used to request a password reset.

        Args:
            attrs (dict): The data that is being validated.

        Returns:
            dict: The validated data.
        """
        email = attrs.get("email")
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            request = self.context.get("request")
            site_domain = get_current_site(request).domain
            relative_link = reverse(
                "password-reset-confirm", kwargs={"uidb64": uidb64, "token": token}
            )
            abslink = f"http://{site_domain}{relative_link}"
            email_body = f"Hi use the link below to reset your password \n {abslink}"
            data = {
                "email_body": email_body,
                "email_subject": "Reset Your Password",
                "to_email": user.email,
            }

            send_normal_email(data=data)
        return super().validate(attrs)


class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=100, min_length=8, write_only=True)
    confirm_password = serializers.CharField(
        max_length=100, min_length=8, write_only=True
    )
    uidb64 = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)

    class Meta:
        fields = ["password", "confirm_password", "uidb64", "token"]

    def validate(self, attrs):
        try:
            token = attrs.get("token")
            uidb64 = attrs.get("uidb64")
            password = attrs.get("password")
            confirm_password = attrs.get("confirm_password")

            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=user_id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed("Reset link is invalid or has expired", 401)
            if password != confirm_password:
                raise AuthenticationFailed("Passwords do not match")
            user.set_password(password)
            user.save()
            return user
        except Exception as e:
            return AuthenticationFailed("Reset link is invalid or has expired")


class LogoutUserSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()

    default_error_messages = {"bad_token": ("Token is invalid or has expired")}

    def validate(self, attrs):
        self.token = attrs.get("refresh_token")
        return attrs

    def save(self, **kwargs):
        try:
            token = RefreshToken(self.token)
            token.blacklist()
        except TokenError:
            return self.fail("bad_token")


class ResendOtpSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        fields = ["email"]

    def validate(self, attrs):
        email = attrs.get("email")
        if not User.objects.filter(email=email).exists():
            raise ValidationError("Email does not exist.")
        send_code_to_user(email, "resend")
        return super().validate(attrs)
