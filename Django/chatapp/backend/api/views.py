from django.shortcuts import render
from django.contrib.auth.models import User
from django.db.models import Subquery, OuterRef, Q
from rest_framework import generics
from .serializers import MessageSerializer, UserSerializer, ProfileSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Message, CustomUser, Profile



class UserCreateView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        receiver_id = self.request.query_params.get('receiver')
        if receiver_id:
            return Message.objects.filter(sender=user, receiver_id=receiver_id) | Message.objects.filter(sender_id=receiver_id, receiver=user)
        return Message.objects.none()

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

class MyInbox(generics.ListAPIView):
    """Gets all the messages of a user ordered by the latest message
    """
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']

        messages = Message.objects.filter(
            id__in=Subquery(
                CustomUser.objects.filter(
                    Q(sender__receiver=user_id)|
                    Q(receiver__sender=user_id)
                ).distinct().annotate(
                    last_msg=Subquery(
                        Message.objects.filter(
                            Q(sender=OuterRef('id'), receiver=user_id)|
                            Q(receiver=OuterRef('id'), sender=user_id)
                        ).order_by("-id")[:1].values_list("id", flat=True)
                    )
                ).values_list("last_msg", flat=True).order_by("-id")
            )
        ).order_by("-id")
        return messages
    
class GetMessages(generics.ListAPIView):
    """Gets the messages between 2 users(conversation)
    """
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        sender_id = self.kwargs["sender_id"]
        receiver_id = self.kwargs["receiver_id"]
        messages = Message.objects.filter(
            sender__in=[sender_id, receiver_id],
            receiver__in=[sender_id, receiver_id],
        )
        return messages
    
class SendMessage(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

class ProfileDetail(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsAuthenticated]


class SearchUser(generics.ListAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        """
        class Profile(models.Model):
            user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
        class CustomUser(AbstractUser):
            username = models.CharField(max_length=150, unique=True)
        Q(user__username) - Profile has a property user which is comes from a model CustomUser which has a property named username
        """
        username=self.kwargs["username"]
        logged_in_user = self.request.user
        users=Profile.objects.filter(
            Q(user__username__icontains=username)|
            Q(full_name__icontains=username)
            # -Q(user=logged_in_user)
        )

        if not users.exists():
            return Response(
                {"detail": "No users found"},
                status=status.HTTP_404_NOT_FOUND
                )
        serializer=self.get_serializer(users, many=True)
        return Response(serializer.data)