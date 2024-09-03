from google.auth.transport import requests
from google.oauth2 import id_token
from accounts.models import User
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed


class Google:
    """
    Utility class for Google authentication and verification.
    """

    @staticmethod
    def validate(access_token):
        """
        Validate the provided Google access token.

        Args:
            access_token (str): The access token to validate.

        Returns:
            The verified ID info if the token is valid, otherwise returns an error message.
        """
        try:
            # Verify the OAuth2 token using Google's verification endpoint
            id_info = id_token.verify_oauth2_token(access_token, requests.Request())

            # Check if the token was issued by Google's accounts domain
            if "accounts.google.com" in id_info["iss"]:
                return id_info
        except Exception as e:
            # Return an error message if the token is invalid or has expired
            return "Token is invalid or has expired"


def login_social_user(email, password):
    """
    Login a social user using the provided email and password.

    Args:
        email (str): The email address of the user.
        password (str): The password of the user.

    Returns:
        A dictionary containing the user's details and access tokens.
    """
    # Authenticate the user using the provided email and password
    login_user = authenticate(email=email, password=password)

    # Get the user's tokens
    user_tokens = login_user.tokens()

    # Return the user's details and access tokens
    return {
        "email": login_user.email,
        "full_name": login_user.get_full_name,
        "access_token": str(user_tokens.get("access")),
        "refresh_token": str(user_tokens.get("refresh")),
    }


def register_social_user(provider, email, first_name, last_name):
    """
    Register a social user using the provided details.

    Args:
        provider (str): The provider of the user (e.g. Google).
        email (str): The email address of the user.
        first_name (str): The first name of the user.
        last_name (str): The last name of the user.

    Returns:
        The registered user instance.
    """
    # Check if a user with the provided email already exists
    user = User.objects.filter(email=email)

    if user.exists():
        # If the user exists, check if the provider matches
        if provider == user[0].auth_provider:
            # If the provider matches, login the user
            login_social_user(email=email, password=settings.SOCIAL_AUTH_PASSWORD)
        else:
            # If the provider does not match, raise an authentication failure
            raise AuthenticationFailed(
                detail=f"Please continue your login with {user[0].auth_provider}"
            )
    else:
        # If the user does not exist, create a new user
        new_user = {
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "password": settings.SOCIAL_AUTH_PASSWORD,
        }

        # Create the new user
        register_user = User.objects.create_user(**new_user)

        # Set the user's auth provider and verification status
        register_user.auth_provider = provider
        register_user.is_verified = True

        # Save the user
        register_user.save()

        # Login the user
        login_social_user(
            email=register_user.email, password=settings.SOCIAL_AUTH_PASSWORD
        )
