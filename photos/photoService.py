import os
import json

# Paths to your JSON file and photo directory
json_path = 'photos.json'  # Path to your JSON file
photo_directory = '.'  # Set to current directory if photos are in the same folder as the script

def load_json_data(json_path):
    """Load existing data from JSON, or create a new structure if not found."""
    try:
        with open(json_path, 'r') as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"directory": photo_directory, "photos": []}

def save_json_data(json_path, data):
    """Save updated data back to JSON."""
    with open(json_path, 'w') as file:
        json.dump(data, file, indent=4)

def get_photo_files(directory):
    """Retrieve photo files in the specified directory."""
    return [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f)) and f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif'))]

def parse_filename(filename):
    """Extract description and name from the filename, and return the cleaned name."""
    if '-' in filename:
        description, name = filename.rsplit('-', 1)
        name = name.strip()
        description = description.strip()
    else:
        description, name = '', filename
    return description, name

def rename_file(old_name, new_name, directory):
    """Rename the file if it has a new name."""
    old_path = os.path.join(directory, old_name)
    new_path = os.path.join(directory, new_name)
    if old_path != new_path:
        os.rename(old_path, new_path)

def main():
    # Load current data from JSON file
    data = load_json_data(json_path)

    # Extract current photo names from JSON data to avoid duplicates
    existing_names = {photo['name'] for photo in data['photos']}

    # Iterate over photo files in the directory
    for filename in get_photo_files(photo_directory):
        description, name = parse_filename(filename)

        # Check if photo is already in the JSON file based on the name only
        if name not in existing_names:
            # Add new photo data to the list
            data['photos'].append({
                "name": name,
                "description": description
            })
            existing_names.add(name)  # Update set to include the new photo name

        # Rename the file to only include the cleaned name
        rename_file(filename, name, photo_directory)

    # Save the updated data back to JSON
    save_json_data(json_path, data)
    print("JSON file updated and photos renamed successfully.")

if __name__ == '__main__':
    main()
