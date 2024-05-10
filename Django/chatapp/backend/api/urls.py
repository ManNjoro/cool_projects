from django.urls import path
from . import views

urlpatterns = [
    path('messages/', views.MessageListCreateView.as_view(), name="messages"),
    path('users/', views.UserListView.as_view(), name="users"),
    path('my-messages/<int:user_id>/', views.MyInbox.as_view(), name="all"),
    path('get-messages/<int:user_id>/<int:receiver_id>/', views.GetMessages.as_view(), name="two-convo"),
    path('send-message/', views.SendMessage.as_view(), name="send"),
    path('profile/<int:pk>/', views.ProfileDetail.as_view(), name="profile"),
    path('search/<str:username>/', views.SearchUser.as_view(), name="search"),
]