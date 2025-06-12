from flask import request, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_db_connection():
    return psycopg2.connect(
        host='localhost',
        database='bhukk',  # Using the correct database name
        user='postgres',
        password='sreeja17.'
    )

def register_partner():
    conn = None
    cur = None
    try:
        data = request.json
        print("Received data:", data)
          # Extract data from request
        contact_name = data.get('contact_name')
        email = data.get('email')
        phone_number = data.get('phone')
        type = data.get('restaurant_type')  # Map restaurant_type to type column
        additional_info = data.get('additional_info', '')
        
        # Validate required fields
        if not all([contact_name, email, phone_number, type]):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
            
        try:
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
                (contact_name, email, phone_number, type, additional_info)
            )
            
            # Get the ID of the new partner
            new_partner_id = cur.fetchone()['id']
            
            # Commit the transaction
            conn.commit()
            
            return jsonify({
                'success': True,
                'message': 'Partner registration successful',
                'partner_id': new_partner_id
            }), 201
            
        except psycopg2.Error as e:
            if conn:
                conn.rollback()
            print(f"Database Error: {str(e)}")
            if hasattr(e, 'pgerror') and e.pgerror:
                print(f"Postgres Error: {e.pgerror}")
            return jsonify({
                'success': False,
                'message': 'Database error occurred',
                'error': str(e)
            }), 500
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()
                
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'An error occurred',
            'error': str(e)
        }), 500