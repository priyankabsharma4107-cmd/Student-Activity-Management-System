from flask import Flask, jsonify
import mysql.connector

app = Flask(__name__)


# =========================
# DATABASE CONNECTION
# =========================

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Root@123",
        database="student_activity_db"
    )


# =========================
# HOME
# =========================

@app.route("/")
def home():
    return jsonify({
        "message": "Student Activity Management System backend is running!",
        "status": "success"
    })


# =========================
# ACTIVITIES API
# =========================

@app.route("/api/activities")
def activities():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

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
    """)

    activities_data = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(activities_data)


# =========================
# RUN SERVER
# =========================

if __name__ == "__main__":
    app.run(debug=True)