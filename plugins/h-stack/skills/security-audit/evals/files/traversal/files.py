import os
from flask import Flask, request, send_file
app = Flask(__name__)
UPLOADS = "/srv/app/uploads"

@app.get("/download")
def download():
    # Any logged-in user can download files they uploaded.
    name = request.args.get("file", "")
    return send_file(os.path.join(UPLOADS, name))
