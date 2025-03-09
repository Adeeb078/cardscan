from flask import Flask, jsonify, request, send_file
import sqlite3
import os
import qrcode

app = Flask(__name__)
UPLOAD_FOLDER = "images/"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Function to add user and save image
@app.route("/add_user", methods=["POST"])
def add_user():
    code = request.form["code"]
    name = request.form["name"]
    place = request.form["place"]
    fare = request.form["fare"]
    
    # Handle image upload
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    image = request.files["image"]
    image_path = f"{UPLOAD_FOLDER}{code}.jpg"
    image.save(image_path)

    # Insert into database
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    
    try:
        cursor.execute("INSERT INTO users (code, name, place, fare, total_fare, image) VALUES (?, ?, ?, ?, ?, ?)",
                       (code, name, place, fare, 0, image_path))
        conn.commit()

        # Generate QR code
        qr = qrcode.make(code)
        qr.save(f"qrcodes/{code}.png")

        return jsonify({"message": "User added successfully", "qr_path": f"qrcodes/{code}.png"})
    except:
        return jsonify({"error": "User already exists"}), 400
    finally:
        conn.close()

# Fetch user data when scanning QR
@app.route("/scan_qr", methods=["POST"])
def scan_qr():
    data = request.json
    qr_code = data.get("code")

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT name, place, fare, total_fare, image FROM users WHERE code = ?", (qr_code,))
    user = cursor.fetchone()

    if user:
        name, place, fare, total_fare, image = user
        new_total_fare = total_fare + fare

        cursor.execute("UPDATE users SET total_fare = ? WHERE code = ?", (new_total_fare, qr_code))
        conn.commit()
        conn.close()

        return jsonify({
            "name": name,
            "place": place,
            "fare": fare,
            "total_fare": new_total_fare,
            "image": image
        })
    else:
        conn.close()
        return jsonify({"error": "Invalid QR Code"}), 404

if __name__ == "__main__":
    app.run(debug=True)
