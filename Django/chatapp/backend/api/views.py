from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework import serializers
from .serializers import MessageSerializer, RoomSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Message, Room



class MessageList(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        room = self.request['room_name']
        return Message.objects.filter(room=room)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(room=self.request["room_name"])
        else:
            raise Exception