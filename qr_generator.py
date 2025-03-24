import qrcode
import sqlite3
import os

# Folder to store QR codes
qr_folder = "qrcodes"
if not os.path.exists(qr_folder):
    os.makedirs(qr_folder)

def generate_qr(admission_number):
    qr_path = f"{qr_folder}/{admission_number}.png"
    qr = qrcode.make(admission_number)
    qr.save(qr_path)
    return qr_path

# Connect to SQLite and fetch users
conn = sqlite3.connect("bus_fare.db")
cursor = conn.cursor()
cursor.execute("SELECT admission_number FROM users")
users = cursor.fetchall()

# Generate QR codes for existing users
for user in users:
    generate_qr(user[0])

conn.close()
