from rest_framework import serializers
from .utils import Google, register_social_user
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed


class GoogleSignInSerializer(serializers.Serializer):
    """
    Serializer for Google sign-in, validating access tokens and registering users.
    """

    # Define a CharField for the access token, with a minimum length of 6 characters
    access_token = serializers.CharField(min_length=6)

    def validate_access_token(self, access_token):
        """
        Validate the provided access token and register the user if valid.

        Args:
            access_token (str): The access token to validate.

        Returns:
            The registered user instance if the token is valid, otherwise raises an exception.
        """
        # Use the Google utility function to validate the access token
        google_user_data = Google.validate(access_token)

        try:
            # Extract the user ID from the Google user data
            userid = google_user_data["sub"]
        except Exception as e:
            # Raise a validation error if the token is invalid or has expired
            raise serializers.ValidationError("This token is invalid or has expired")

        # Verify that the token's audience matches the Google client ID
        if google_user_data["aud"] != settings.GOOGLE_CLIENT_ID:
            # Raise an authentication failure if the token's audience is incorrect
            raise AuthenticationFailed(detail="Could not verify user")

        # Extract the user's email, first name, and last name from the Google user data
        email = google_user_data["email"]
        first_name = google_user_data["given_name"]
        last_name = google_user_data["family_name"]

        # Define the provider as Google
        provider = "google"

        # Register the social user using the extracted data
        return register_social_user(
            provider=provider, email=email, first_name=first_name, last_name=last_name
        )
