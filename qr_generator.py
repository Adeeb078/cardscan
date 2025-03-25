import qrcode
import sqlite3
import os

# Folder to store QR codes
qr_folder = "qrcodes"
if not os.path.exists(qr_folder):
    os.makedirs(qr_folder)

def generate_qr(admission_number):
    qr_folder = "static/qrcodes"  # Ensure QR codes are stored in 'static/qrcodes'
    os.makedirs(qr_folder, exist_ok=True)  # Create folder if it doesn't exist
    
    qr_path = f"{qr_folder}/{admission_number}.png"
    qr_code = qrcode.make(admission_number)
    qr_code.save(qr_path)
    
    return qr_path  # Return correct path


# Connect to SQLite and fetch users
conn = sqlite3.connect("bus_fare.db")
cursor = conn.cursor()
cursor.execute("SELECT admission_number FROM users")
users = cursor.fetchall()

# Generate QR codes for existing users
for user in users:
    generate_qr(user[0])

conn.close()
