import qrcode
import os
import json

# Folder to store QR codes
qr_folder = "qrcodes"

# Create folder if not exists
if not os.path.exists(qr_folder):
    os.makedirs(qr_folder)

# Data for QR codes (instead of using Google Sheets)
people = [
    {"code": "12345", "name": "John Doe", "place": "New York", "fare": 50},
    {"code": "67890", "name": "Jane Smith", "place": "Los Angeles", "fare": 75}
]

# Generate QR code for each person
for person in people:
    qr = qrcode.make(person["code"])  # QR stores only the unique code
    qr_path = f"{qr_folder}/{person['code']}.png"
    qr.save(qr_path)
    print(f"QR Code for {person['name']} saved as {qr_path}")

# Save data to a JSON file
with open("data.json", "w") as json_file:
    json.dump(people, json_file, indent=4)

print("Data saved to data.json")
