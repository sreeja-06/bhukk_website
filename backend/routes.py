from flask import Blueprint, jsonify, request, send_from_directory
from datetime import datetime
from werkzeug.utils import secure_filename
import os
from .contact import handle_contact_form
from .career import handle_career_form
from .partner import register_partner

routes = Blueprint('routes', __name__)

# File upload configuration for resumes
UPLOAD_FOLDER = 'backend/uploads'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@routes.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

@routes.route('/api/contact', methods=['POST'])
def contact():
    """Handle contact form submissions"""
    try:
        return handle_contact_form()
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@routes.route('/api/career/apply', methods=['POST'])
def apply_job():
    """Handle job applications"""
    try:
        return handle_career_form()
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@routes.route('/api/partner/register', methods=['POST'])
def partner():
    """Handle restaurant partner registration"""
    try:
        return register_partner()
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@routes.errorhandler(404)
def not_found_error(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Resource not found'}), 404

@routes.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500