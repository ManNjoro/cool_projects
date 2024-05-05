from django.urls import path
from . import views

urlpatterns = [
    path("blogs/", views.BlogListCreate.as_view(), name="blogs"),
    path("blogs/<int:pk>/", views.BlogView.as_view(), name="blog"),
    path("blogs/delete/<int:pk>/", views.BlogDelete.as_view(), name="delete-blog"),
    path("blogs/update/<int:pk>/", views.BlogUpdate.as_view(), name="update-blog"),
]