from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://127.0.0.1:5500", "http://localhost:5500", 
                   "http://127.0.0.1:5502", "http://localhost:5502"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Accept"]
    }
})

# Database Configuration
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="bhukk",
        user="postgres",
        password="sreeja17."
    )

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:sreeja17.@localhost:5432/bhukk'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models
class Contact(db.Model):
    __tablename__ = 'contact'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)

class DeliveryPartner(db.Model):
    __tablename__ = 'delivery'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    vehicle = db.Column(db.String(50), nullable=False)
    license = db.Column(db.String(50), nullable=False)
    experience = db.Column(db.Text, nullable=True)
    city = db.Column(db.String(100), nullable=False)

class RestaurantPartner(db.Model):
    __tablename__ = 'restaurant_partner'
    id = db.Column(db.Integer, primary_key=True)
    contact_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    restaurant_name = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    additional_info = db.Column(db.Text, nullable=True)

class Ecosystem(db.Model):
    __tablename__ = 'ecosystem'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    icon_name = db.Column(db.String(100), nullable=False)
    
# Create tables
with app.app_context():
    db.create_all()
    print("Database tables created successfully")

# Route handlers
@app.route('/api/contact', methods=['POST'])
def handle_contact():
    conn = None
    cur = None
    try:
        data = request.json
        print('Received contact form data:', data)
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Insert into contact table using SQL
        cur.execute("""
            INSERT INTO contact (name, email, subject, message)
            VALUES (%s, %s, %s, %s)
            RETURNING id;
        """, (data['name'], data['email'], data['subject'], data['message']))
        
        new_contact_id = cur.fetchone()[0]
        conn.commit()
        
        print(f"Contact created with ID: {new_contact_id}")
        return jsonify({'message': 'Contact form submitted successfully', 'id': new_contact_id}), 201
        
    except Exception as e:
        if conn:
            conn.rollback()
        print('Error handling contact form:', str(e))
        return jsonify({'error': str(e)}), 500
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

@app.route('/api/delivery-partner', methods=['POST'])
def handle_delivery_partner():
    conn = None
    cur = None
    try:
        data = request.json
        print('Received delivery partner data:', data)
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Insert into delivery table using SQL
        cur.execute("""
            INSERT INTO delivery (name, email, phone, age, vehicle, license, experience, city)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (
            data['name'],
            data['email'],
            data['phone'],
            int(data['age']),
            data['vehicle'],
            data['license'],
            data.get('experience', ''),
            data['city']
        ))
        
        new_partner_id = cur.fetchone()[0]
        conn.commit()
        
        print(f"Delivery partner created with ID: {new_partner_id}")
        return jsonify({'message': 'Delivery partner application submitted successfully', 'id': new_partner_id}), 201
        
    except Exception as e:
        if conn:
            conn.rollback()
        print('Error handling delivery partner form:', str(e))
        return jsonify({'error': str(e)}), 500
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

@app.route('/api/restaurant-partner', methods=['POST'])
def handle_restaurant_partner():
    conn = None
    cur = None
    try:
        data = request.json
        print('Received restaurant partner data:', data)
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Insert into restaurant_partner table using SQL
        cur.execute("""
            INSERT INTO restaurant_partner (contact_name, email, phone_number, restaurant_name, type, additional_info)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (
            data['contact_name'],
            data['email'],
            data['phone_number'],
            data['restaurant_name'],
            data['type'],
            data.get('additional_info', '')
        ))
        
        new_partner_id = cur.fetchone()[0]
        conn.commit()
        
        print(f"Restaurant partner created with ID: {new_partner_id}")
        return jsonify({'message': 'Restaurant partner application submitted successfully', 'id': new_partner_id}), 201
        
    except Exception as e:
        if conn:
            conn.rollback()
        print('Error handling restaurant partner form:', str(e))
        return jsonify({'error': str(e)}), 500
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
            
@app.route('/api/ecosystem', methods=['GET'])
def get_ecosystem():
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Fetch ecosystem data
        cur.execute("SELECT title, description, icon_name FROM ecosystem")
        rows = cur.fetchall()
        
        data = []
        for row in rows:
            data.append({
                'title': row[0],
                'description': row[1],
                'icon_name': row[2]
            })
        
        print(f"Fetched {len(data)} ecosystem items")
        return jsonify(data), 200

    except Exception as e:
        print('Error fetching ecosystem data:', str(e))
        return jsonify({'error': str(e)}), 500

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

            
# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({
        'success': False,
        'message': 'Resource not found',
        'error': str(error)
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'message': 'Internal server error',
        'error': str(error)
    }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)