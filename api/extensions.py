"""
Central place for Flask extension instances.
Kept separate from index.py to avoid circular imports
(models.py and routes/*.py both need `db`, but shouldn't import index.py).
"""
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()