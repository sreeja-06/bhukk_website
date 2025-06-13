from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv
import os

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()

def create_app(config=None):
    app = Flask(__name__)
    
    # Load environment variables
    load_dotenv()
    
    # Configure the app
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:sreeja17.@localhost:5432/bhukk')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'uploads')
    
    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Initialize extensions
    CORS(app, origins=os.getenv('CORS_ORIGINS', '*').split(','))
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Register blueprints
    from .routes import routes
    app.register_blueprint(routes)
    
    # Register error handlers
    register_error_handlers(app)
    
    return app

def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found_error(error):
        return {
            'error': 'Resource not found',
            'message': str(error)
        }, 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return {
            'error': 'Internal server error',
            'message': str(error)
        }, 500
