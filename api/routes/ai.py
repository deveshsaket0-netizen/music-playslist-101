"""
AI description route. Sends the playlist's song list to Gemini and
stores the generated description on the playlist.
"""
import os
import google.generativeai as genai
from flask import Blueprint, jsonify
from api.extensions import db
from api.models import Playlist
from api.utils.jwt_helpers import require_auth

ai_bp = Blueprint("ai", __name__, url_prefix="/api/ai")

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


@ai_bp.route("/playlists/<int:playlist_id>/generate-description", methods=["POST"])
@require_auth
def generate_description(current_user_id, playlist_id):
    playlist = Playlist.query.filter_by(id=playlist_id, user_id=current_user_id).first()
    if not playlist:
        return jsonify({"error": "Playlist not found"}), 404

    if not playlist.songs:
        return jsonify({"error": "Add some songs before generating a description"}), 400

    if not GEMINI_API_KEY:
        return jsonify({"error": "AI feature not configured on the server"}), 503

    song_lines = "\n".join(f"- {s.title} by {s.artist} ({s.genre})" for s in playlist.songs)
    prompt = (
        f"Write a short, catchy 2-3 sentence description for a music playlist called "
        f"'{playlist.name}' based on these songs:\n{song_lines}\n\n"
        f"Keep it fun and evocative, no song titles listed literally, just the vibe."
    )

    try:
        model = genai.GenerativeModel("gemini-3.6-flash")
        response = model.generate_content(prompt)
        description = response.text.strip()
    except Exception as e:
        return jsonify({"error": f"AI generation failed: {str(e)}"}), 502

    playlist.ai_description = description
    db.session.commit()

    return jsonify({"playlist": playlist.to_dict()}), 200