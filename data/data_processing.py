import csv
import json

def csv_to_json(csv_file_path, json_file_path):
    data = []
    with open(csv_file_path, 'r', encoding='utf-8') as csvfile:
        csv_reader = csv.DictReader(csvfile)
        for row in csv_reader:
            # Clean and convert phone number to integer
            phone = row.get('phone')
            if phone:
                phone = phone.replace("+", "").replace(" ", "")  # Remove '+' sign and spaces
                try:
                    row['phone'] = int(phone)
                except ValueError:
                    # Handle cases where the phone number is not a valid integer
                    row['phone'] = None

            row['status'] = 'none'
            data.append(row)

    with open(json_file_path, 'w', encoding='utf-8') as jsonfile:
        json.dump(data, jsonfile, indent=4, ensure_ascii=False)

csv_file_path = 'marketing_agencies_alger.csv'
json_file_path = 'marketing_agencies_alger.json'

csv_to_json(csv_file_path, json_file_path)
