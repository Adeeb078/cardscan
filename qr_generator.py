import qrcode
import os
import json

# Folder to store QR codes
qr_folder = "qrcodes"

# Create folder if not exists
if not os.path.exists(qr_folder):
    os.makedirs(qr_folder)

# Load data from data.json
json_file_path = "data.json"

try:
    with open(json_file_path, "r") as json_file:
        people = json.load(json_file)  # Load people data from JSON
except (FileNotFoundError, json.JSONDecodeError):
    print("Error: data.json not found or invalid. Please check the file.")
    people = []

# Generate QR code for each person
for person in people:
    if "code" in person:  # Ensure "code" exists
        qr = qrcode.make(person["code"])  # QR stores only the unique code
        qr_path = f"{qr_folder}/{person['code']}.png"
        qr.save(qr_path)
        print(f"QR Code for {person['name']} saved as {qr_path}")
    else:
        print(f"Skipping entry: {person} (No 'code' found)")

print("QR code generation complete!")
