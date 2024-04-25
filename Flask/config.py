from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
app.url_map.strict_slashes=False
CORS(app)

app.config["UPLOAD_FOLDER"]="uploads"
app.config["ALLOWED_EXTENSIONS"] = set(["png", "jpg", "jpeg", "gif"])