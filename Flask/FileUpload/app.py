from flask import send_file
from config import app


@app.route("/api/image", methods=["GET"])
def get_image():
    image_path = '/'.join([app.config['UPLOAD_FOLDER'], 'vim.jpg'])
    return send_file(image_path, mimetype='image/jpeg')


if __name__ == "__main__":
    app.run(debug=True)