from flask import request, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_db_connection():
    try:
        conn = psycopg2.connect(
            host='localhost',
            database='bhukk',
            user='postgres',
            password='sreeja17.'
        )
        print("Database connection successful")
        return conn
    except Exception as e:
        print(f"Database connection error: {str(e)}")
        raise

def submit_contact():
    conn = None
    cur = None
    try:
        data = request.json
        print("Received data:", data)
        
        # Extract data from request
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')
          # Validate required fields
        missing_fields = []
        if not name: missing_fields.append('name')
        if not email: missing_fields.append('email')
        if not subject: missing_fields.append('subject')
        if not message: missing_fields.append('message')
        
        if missing_fields:
            return jsonify({
                'success': False,
                'message': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400
            
        try:
            # Connect to database
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            # Insert data into database
            cur.execute(
                """
                INSERT INTO contact 
                (name, email, subject, message)
                VALUES (%s, %s, %s, %s)
                RETURNING id
                """,
                (name, email, subject, message)
            )
            
            # Get the ID of the new contact submission
            new_contact_id = cur.fetchone()['id']
            
            # Commit the transaction
            conn.commit()
            
            return jsonify({
                'success': True,
                'message': 'Contact form submitted successfully',
                'contact_id': new_contact_id
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