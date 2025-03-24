from flask import Flask, request, jsonify, render_template
import sqlite3
import qrcode
import os

# Load API URL from Render environment variables
API_BASE = os.getenv("API_BASE")

if API_BASE:
    print(f"✅ API_BASE Loaded from Render: {API_BASE}")
else:
    print("❌ ERROR: API_BASE environment variable not found in Render!")

app = Flask(__name__, template_folder="templates", static_folder="static")

# Ensure QR Code folder exists
qr_folder = "qrcodes"
os.makedirs(qr_folder, exist_ok=True)

# Database initialization
DB_FILE = "bus_fare.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            admission_number TEXT PRIMARY KEY,
            name TEXT,
            place TEXT,
            branch TEXT,
            semester TEXT,
            fixed_fare INTEGER,
            total_fare INTEGER DEFAULT 0
        )
    """)
    conn.commit()
    conn.close()

init_db()  # Ensure database exists on startup

def generate_qr(admission_number):
    qr_path = f"{qr_folder}/{admission_number}.png"
    qr = qrcode.make(admission_number)
    qr.save(qr_path)
    return qr_path

@app.route('/get_api_url')
def get_api_url():
    return jsonify({"api_url": os.getenv("API_BASE")})

@app.route("/")
def home():
    return render_template("index.html")  # Serve frontend

@app.route("/admin")
def admin():
    return render_template("admin.html")  # Check if 'admin.html' exists

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html") # Check if 'dashboard.html' exists

@app.route("/add_user", methods=["POST"])
def add_user():
    data = request.json
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO users (admission_number, name, place, branch, semester, fixed_fare, total_fare)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (data["admission_number"], data["name"], data["place"], data["branch"], data["semester"], data["fixed_fare"], 0))

    conn.commit()
    conn.close()

    qr_path = generate_qr(data["admission_number"])
    return jsonify({"message": "User added successfully", "qr_path": qr_path})

@app.route("/scan_qr", methods=["POST"])
def scan_qr():
    data = request.json
    admission_number = data["admission_number"]

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    cursor.execute("SELECT name, fixed_fare, total_fare FROM users WHERE admission_number = ?", (admission_number,))
    user = cursor.fetchone()

    if user:
        new_total = user[2] + user[1]
        cursor.execute("UPDATE users SET total_fare = ? WHERE admission_number = ?", (new_total, admission_number))
        conn.commit()
        conn.close()
        return jsonify({"message": f"Scanned {user[0]} successfully", "total_fare": new_total})
    
    conn.close()
    return jsonify({"error": "QR Code not found"}), 404

@app.route("/reset_fare", methods=["POST"])
def reset_fare():
    data = request.json
    admission_number = data["admission_number"]

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET total_fare = 0 WHERE admission_number = ?", (admission_number,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Total fare reset successfully"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # Render provides PORT
    app.run(host="0.0.0.0", port=port, debug=True)
