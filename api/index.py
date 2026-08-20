"""
Flask app entrypoint. Creates the app, registers extensions, blueprints,
and error handlers. This is what Vercel points to as the serverless function.
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from api.extensions import db, bcrypt
from api.utils.error_handlers import register_error_handlers

load_dotenv()


def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    bcrypt.init_app(app)
    CORS(app)  # allows the React frontend to call this API

    register_error_handlers(app)

    # Import blueprints AFTER db.init_app to avoid circular import issues
    from api.routes.auth import auth_bp
    from api.routes.songs import songs_bp
    from api.routes.playlists import playlists_bp
    from api.routes.ai import ai_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(songs_bp)
    app.register_blueprint(playlists_bp)
    app.register_blueprint(ai_bp)

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok"}), 200

    with app.app_context():
        db.create_all()  # creates tables if they don't exist yet — fine for this project size

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)