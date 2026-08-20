"""
Database models. One class per table.
"""
from datetime import datetime, timezone
from api.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # One user has many playlists. cascade="all, delete-orphan" means
    # deleting a user also deletes their playlists (and songs, via Playlist's cascade).
    playlists = db.relationship(
        "Playlist", backref="owner", cascade="all, delete-orphan", lazy=True
    )

    def to_dict(self):
        return {"id": self.id, "email": self.email, "created_at": self.created_at.isoformat()}


class Playlist(db.Model):
    __tablename__ = "playlists"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    ai_description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    songs = db.relationship(
        "Song", backref="playlist", cascade="all, delete-orphan", lazy=True
    )

    def to_dict(self, include_songs=False):
        data = {
            "id": self.id,
            "name": self.name,
            "ai_description": self.ai_description,
            "created_at": self.created_at.isoformat(),
            "song_count": len(self.songs),
        }
        if include_songs:
            data["songs"] = [s.to_dict() for s in self.songs]
        return data


class Song(db.Model):
    __tablename__ = "songs"

    id = db.Column(db.Integer, primary_key=True)
    playlist_id = db.Column(db.Integer, db.ForeignKey("playlists.id"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    artist = db.Column(db.String(255), nullable=False)
    genre = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "artist": self.artist,
            "genre": self.genre,
            "playlist_id": self.playlist_id,
        }