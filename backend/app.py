from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
CORS(app)

# =========================================================
# FRONTEND PATH
# =========================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")


# =========================================================
# DATABASE CONNECTION
# =========================================================

def get_db_connection():
    return mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", "Root@123"),
        database=os.environ.get("DB_NAME", "student_activity_db"),
        port=int(os.environ.get("DB_PORT", "3306"))
    )


# =========================================================
# HOME - FRONTEND
# =========================================================

@app.route("/", methods=["GET"])
def home():
    return send_from_directory(FRONTEND_DIR, "index.html")


# =========================================================
# FRONTEND FILES
# =========================================================

@app.route("/<path:filename>")
def frontend_files(filename):
    return send_from_directory(FRONTEND_DIR, filename)


# =========================================================
# STUDENT REGISTER
# =========================================================

@app.route("/api/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    department = data.get("department")
    year = data.get("year")

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "Name, email and password are required."
        }), 400

    conn = None
    cursor = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT student_id FROM students WHERE email = %s",
            (email,)
        )

        existing_student = cursor.fetchone()

        if existing_student:
            return jsonify({
                "success": False,
                "message": "Email already registered."
            }), 409

        hashed_password = generate_password_hash(password)

        query = """
            INSERT INTO students
            (name, email, password, department, year)
            VALUES (%s, %s, %s, %s, %s)
        """

        cursor.execute(
            query,
            (
                name,
                email,
                hashed_password,
                department,
                year
            )
        )

        conn.commit()

        student_id = cursor.lastrowid

        return jsonify({
            "success": True,
            "message": "Registration successful.",
            "student": {
                "student_id": student_id,
                "name": name,
                "email": email,
                "department": department,
                "year": year
            }
        }), 201

    except mysql.connector.Error as e:

        return jsonify({
            "success": False,
            "message": "Database error.",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# =========================================================
# STUDENT LOGIN
# =========================================================

@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required."
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                student_id,
                name,
                email,
                password,
                department,
                year
            FROM students
            WHERE email = %s
        """, (email,))

        student = cursor.fetchone()

        if not student:
            return jsonify({
                "success": False,
                "message": "Invalid email or password."
            }), 401

        if not check_password_hash(student["password"], password):
            return jsonify({
                "success": False,
                "message": "Invalid email or password."
            }), 401

        student.pop("password", None)

        return jsonify({
            "success": True,
            "message": "Login successful.",
            "student": student
        }), 200

    except mysql.connector.Error as e:

        return jsonify({
            "success": False,
            "message": "Database connection error.",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# =========================================================
# GET ALL ACTIVITIES
# =========================================================

@app.route("/api/activities", methods=["GET"])
def get_activities():

    conn = None
    cursor = None

    try:

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                activity_id,
                activity_name,
                description,
                category,
                activity_date,
                venue,
                capacity
            FROM activities
            ORDER BY activity_date ASC
        """)

        activities = cursor.fetchall()

        return jsonify(activities), 200

    except mysql.connector.Error as e:

        return jsonify({
            "success": False,
            "message": "Unable to fetch activities.",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# =========================================================
# REGISTER STUDENT FOR ACTIVITY
# =========================================================

@app.route("/api/register-activity", methods=["POST"])
def register_activity():

    data = request.get_json()

    student_id = data.get("student_id")
    activity_id = data.get("activity_id")

    if not student_id or not activity_id:
        return jsonify({
            "success": False,
            "message": "Student ID and Activity ID are required."
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT registration_id
            FROM registrations
            WHERE student_id = %s
            AND activity_id = %s
        """, (student_id, activity_id))

        existing = cursor.fetchone()

        if existing:
            return jsonify({
                "success": False,
                "message": "You are already registered for this activity."
            }), 409

        cursor.execute("""
            INSERT INTO registrations
            (student_id, activity_id, registration_date, status)
            VALUES (%s, %s, CURDATE(), 'Registered')
        """, (student_id, activity_id))

        conn.commit()

        return jsonify({
            "success": True,
            "message": "Activity registration successful."
        }), 201

    except mysql.connector.Error as e:

        return jsonify({
            "success": False,
            "message": "Unable to register for activity.",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# =========================================================
# STUDENT REGISTRATIONS
# =========================================================

@app.route("/api/registrations/<int:student_id>", methods=["GET"])
def get_registrations(student_id):

    conn = None
    cursor = None

    try:

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                r.registration_id,
                r.registration_date,
                r.status,
                a.activity_id,
                a.activity_name,
                a.description,
                a.category,
                a.activity_date,
                a.venue
            FROM registrations r
            JOIN activities a
                ON r.activity_id = a.activity_id
            WHERE r.student_id = %s
            ORDER BY a.activity_date ASC
        """, (student_id,))

        registrations = cursor.fetchall()

        return jsonify(registrations), 200

    except mysql.connector.Error as e:

        return jsonify({
            "success": False,
            "message": "Unable to fetch registrations.",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# =========================================================
# STUDENT CERTIFICATES
# =========================================================

@app.route("/api/certificates/<int:student_id>", methods=["GET"])
def get_certificates(student_id):

    conn = None
    cursor = None

    try:

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                c.certificate_id,
                c.certificate_name,
                c.issue_date,
                c.certificate_url,
                a.activity_name
            FROM certificates c
            JOIN activities a
                ON c.activity_id = a.activity_id
            WHERE c.student_id = %s
            ORDER BY c.issue_date DESC
        """, (student_id,))

        certificates = cursor.fetchall()

        return jsonify(certificates), 200

    except mysql.connector.Error as e:

        return jsonify({
            "success": False,
            "message": "Unable to fetch certificates.",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# =========================================================
# STUDENT ACHIEVEMENTS
# =========================================================

@app.route("/api/achievements/<int:student_id>", methods=["GET"])
def get_achievements(student_id):

    conn = None
    cursor = None

    try:

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                achievement_id,
                title,
                description,
                achievement_date
            FROM achievements
            WHERE student_id = %s
            ORDER BY achievement_date DESC
        """, (student_id,))

        achievements = cursor.fetchall()

        return jsonify(achievements), 200

    except mysql.connector.Error as e:

        return jsonify({
            "success": False,
            "message": "Unable to fetch achievements.",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# =========================================================
# STUDENT PARTICIPATION
# =========================================================

@app.route("/api/participation/<int:student_id>", methods=["GET"])
def get_participation(student_id):

    conn = None
    cursor = None

    try:

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                p.participation_id,
                p.attendance_status,
                p.participation_role,
                a.activity_name,
                a.activity_date
            FROM participation p
            JOIN activities a
                ON p.activity_id = a.activity_id
            WHERE p.student_id = %s
            ORDER BY a.activity_date DESC
        """, (student_id,))

        participation = cursor.fetchall()

        return jsonify(participation), 200

    except mysql.connector.Error as e:

        return jsonify({
            "success": False,
            "message": "Unable to fetch participation.",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# =========================================================
# STUDENT DASHBOARD
# =========================================================

@app.route("/api/dashboard/<int:student_id>", methods=["GET"])
def dashboard(student_id):

    conn = None
    cursor = None

    try:

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT COUNT(*) AS total
            FROM registrations
            WHERE student_id = %s
        """, (student_id,))

        registrations = cursor.fetchone()["total"]

        cursor.execute("""
            SELECT COUNT(*) AS total
            FROM certificates
            WHERE student_id = %s
        """, (student_id,))

        certificates = cursor.fetchone()["total"]

        cursor.execute("""
            SELECT COUNT(*) AS total
            FROM achievements
            WHERE student_id = %s
        """, (student_id,))

        achievements = cursor.fetchone()["total"]

        cursor.execute("""
            SELECT COUNT(*) AS total
            FROM participation
            WHERE student_id = %s
        """, (student_id,))

        participation = cursor.fetchone()["total"]

        return jsonify({
            "success": True,
            "registrations": registrations,
            "