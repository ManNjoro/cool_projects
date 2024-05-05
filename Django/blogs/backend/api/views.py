from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework import serializers
from .serializers import UserSerializer, BlogSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Blog


# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class BlogListCreate(generics.ListCreateAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Blog.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            raise Exception
        
class BlogDelete(generics.DestroyAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Blog.objects.filter(author=user)

class BlogUpdate(generics.UpdateAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Blog.objects.filter(author=user)
    
class BlogView(generics.RetrieveAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Blog.objects.filter(author=user)
