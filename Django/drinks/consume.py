import requests

data = requests.get('http://localhost:8000/drinks').json()
print(data)