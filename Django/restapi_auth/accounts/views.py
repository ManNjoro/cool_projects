from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from .serializers import (
    UserRegisterSerializer,
    LoginSerializer,
    PasswordResetRequestSerializer,
    SetNewPasswordSerializer,
    LogoutUserSerializer,
    ResendOtpSerializer,
)
from rest_framework.response import Response
from rest_framework import status
from .utils import send_code_to_user, verify_otp
from .models import OneTimePassword, User
from rest_framework.permissions import IsAuthenticated
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import smart_str, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator

# Create your views here.


class RegisterUserView(GenericAPIView):
    """
    View to handle user registration.
    """
    serializer_class = UserRegisterSerializer

    def post(self, request):
        """
        Handle POST request to register a new user.
        
        :param request: Request object containing user data
        :return: Response object with user data and success message
        """
        try:
            user_data = request.data
            serializer = self.serializer_class(data=user_data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                user = serializer.data
                # send email function user['email']
                send_code_to_user(user.get("email"))

                return Response(
                    {
                        "data": user,
                        "message": f"Hi thanks for signing up a passcode",
                    },
                    status=status.HTTP_201_CREATED,
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class VerifyUserEmail(GenericAPIView):
    """
    View to handle email verification.
    """

    def post(self, request):
        """
        Handle POST request to verify user email.

        :param request: Request object containing OTP code
        :return: Response object with verification result
        """
        otp_code = request.data.get("otp")
        email = request.data.get("email")  # Make sure the email is provided

        if not otp_code or not email:
            return Response(
                {"message": "OTP code and email are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            print(email, otp_code)
            user = User.objects.get(email=email)
            # otp_obj = OneTimePassword.objects.get(user=user, code=otp_code)

            if verify_otp(user, otp_code):  # Call the verify_otp function
                if not user.is_verified:
                    user.is_verified = True
                    user.save()
                    return Response(
                        {"message": "Account email verified successfully"},
                        status=status.HTTP_200_OK,
                    )
                return Response(
                    {"message": "User is already verified."},
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {"message": "Invalid or expired OTP code."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except (User.DoesNotExist):
            return Response(
                {"message": "Invalid email or OTP code."},
                status=status.HTTP_404_NOT_FOUND
            )


class LoginUserView(GenericAPIView):
    """
    View to handle user login.
    """
    serializer_class = LoginSerializer

    def post(self, request):
        """
        Handle POST request to login a user.
        
        :param request: Request object containing login credentials
        :return: Response object with user data
        """
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TestAuthentication(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {
            "msg": "it works",
        }
        return Response(data, status=status.HTTP_200_OK)


class PasswordResetRequestView(GenericAPIView):
    """
    View to handle password reset request.
    """
    serializer_class = PasswordResetRequestSerializer

    def post(self, request):
        """
        Handle POST request to send password reset link.
        
        :param request: Request object containing email
        :return: Response object with success message
        """
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        return Response(
            {"message": "A link has been sent to your email to reset your password"},
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirm(GenericAPIView):
    """
    View to handle password reset confirmation.
    """
    def get(self, request, uidb64, token):
        """
        Handle GET request to confirm password reset.
        
        :param request: Request object
        :param uidb64: User ID encoded in base64
        :param token: Password reset token
        :return: Response object with confirmation result
        """
        try:
            user_id = urlsafe_base64_decode(uidb64)
            user = User.objects.get(id=user_id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response(
                    {"message": "Token is invalid or has expired"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            return Response(
                {
                    "success": True,
                    "message": "Credentials are valid",
                    "uidb64": uidb64,
                    "token": token,
                },
                status=status.HTTP_200_OK,
            )
        except DjangoUnicodeDecodeError:
            return Response(
                {"message": "Token is invalid or has expired"},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class SetNewPassword(GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(
            {"message": "Password reset successful"}, status=status.HTTP_200_OK
        )


class LogoutUserView(GenericAPIView):
    serializer_class = LogoutUserSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)


class ResendOtpView(GenericAPIView):
    """
    View to handle password reset request.
    """
    serializer_class = ResendOtpSerializer

    def post(self, request):
        """
        Handle POST request to send password reset link.
        
        :param request: Request object containing email
        :return: Response object with success message
        """
        try:
            serializer = self.serializer_class(
                data=request.data, context={"request": request}
            )
            serializer.is_valid(raise_exception=True)
            return Response(
                {"message": "An otp code has been sent to your email"},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)