from rest_framework import serializers
from .models import Drink

class DrinkSerializer(serializers.ModelSerializer):
    """
    Json Serializer for Drink model
    """
    class Meta:
        """
        """
        model = Drink
        fields = ['id', 'name', 'description']