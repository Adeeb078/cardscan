from flask import Flask, request, jsonify
import sqlite3
import qrcode
import os

app = Flask(__name__)

qr_folder = "qrcodes"
if not os.path.exists(qr_folder):
    os.makedirs(qr_folder)

def generate_qr(admission_number):
    qr_path = f"{qr_folder}/{admission_number}.png"
    qr = qrcode.make(admission_number)
    qr.save(qr_path)
    return qr_path

@app.route("/add_user", methods=["POST"])
def add_user():
    data = request.json
    conn = sqlite3.connect("bus_fare.db")
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

    conn = sqlite3.connect("bus_fare.db")
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

    conn = sqlite3.connect("bus_fare.db")
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET total_fare = 0 WHERE admission_number = ?", (admission_number,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Total fare reset successfully"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Render provides PORT
    app.run(host="0.0.0.0", port=port, debug=True)
