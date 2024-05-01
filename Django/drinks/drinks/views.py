from django.http import JsonResponse
from .models import Drink
from .serializer import DrinkSerializer


def drink_list(request):
    """
    Get all drinks
    serialize them
    return Json
    """
    drinks = Drink.objects.all()
    serializer = DrinkSerializer(drinks, many=True)
    return JsonResponse(serializer.data)
