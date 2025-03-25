import qrcode
import sqlite3
import os

qr_folder = os.path.join("static", "qrcodes")  # Ensure QR codes are saved in static/qrcodes

if not os.path.exists(qr_folder):
    os.makedirs(qr_folder)  # Create folder if it doesn't exist

def generate_qr(admission_number):
    qr_path = os.path.join(qr_folder, f"{admission_number}.png")
    qr = qrcode.make(admission_number)
    qr.save(qr_path)
    return qr_path  # Returns the path to be used in frontend

# Connect to SQLite and fetch users
conn = sqlite3.connect("bus_fare.db")
cursor = conn.cursor()
cursor.execute("SELECT admission_number FROM users")
users = cursor.fetchall()

# Generate QR codes for existing users
for user in users:
    generate_qr(user[0])

conn.close()
