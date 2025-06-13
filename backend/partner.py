from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database connection configuration
def get_db_connection():
    return psycopg2.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        database=os.getenv('DB_NAME', 'bhukk'),
        user=os.getenv('DB_USER', 'postgres'),
        password=os.getenv('sreeja17.')
    )

@app.route('/api/partner/register', methods=['POST'])
def register_partner():
    try:
        data = request.json
        
        # Extract data from request
        contact_name = data.get('contact_name')
        email = data.get('email')
        phone_number = data.get('phone')
        restaurant_type = data.get('restaurant_type')
        additional_info = data.get('additional_info')
        
        # Validate required fields
        if not all([contact_name, email, phone_number, restaurant_type]):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        # Connect to database
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Insert data into database
        cur.execute(
            """
            INSERT INTO restaurant_partner 
            (contact_name, email, phone_number, type, additional_info)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
            """,
            (contact_name, email, phone_number, restaurant_type, additional_info)
        )
        
        # Get the ID of the new partner
        new_partner_id = cur.fetchone()['id']
        
        # Commit the transaction
        conn.commit()
        
        # Close database connection
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Partner registration successful',
            'partner_id': new_partner_id
        }), 201
        
    except psycopg2.Error as e:
        # Handle database errors
        return jsonify({
            'success': False,
            'message': 'Database error occurred',
            'error': str(e)
        }), 500
        
    except Exception as e:
        # Handle other errors
        return jsonify({
            'success': False,
            'message': 'An error occurred',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)