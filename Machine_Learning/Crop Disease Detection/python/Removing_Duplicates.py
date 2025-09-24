# import os
# import hashlib

# # your directory
# directory = r"C:\Users\samri\cod\git\Farmer\Machine_Learning\Crop Disease Detection\PlantVillage\Tomato_Spider_mites_Two_spotted_spider_mite"

# def file_hash(filepath):
#     """Return MD5 hash of the file contents."""
#     hasher = hashlib.md5()
#     with open(filepath, 'rb') as f:
#         for chunk in iter(lambda: f.read(4096), b""):
#             hasher.update(chunk)
#     return hasher.hexdigest()

# hashes = {}
# duplicates_removed = []

# for filename in os.listdir(directory):
#     if filename.lower().endswith(".jpg"):
#         filepath = os.path.join(directory, filename)
#         filehash = file_hash(filepath)

#         if filehash in hashes:
#             # duplicate found → delete it
#             os.remove(filepath)
#             duplicates_removed.append((filename, hashes[filehash]))
#         else:
#             hashes[filehash] = filename

# # Report
# if duplicates_removed:
#     print("🗑️ Duplicate images removed:\n")
#     for dup, original in duplicates_removed:
#         print(f"{dup} (removed) was a duplicate of {original}")
# else:
#     print("✅ No duplicates found. All images are unique.")


import os
import hashlib

# Base directory containing all your quality folders
base_dir = r"C:\Users\samri\cod\git\Farmer\Machine_Learning\Crop Quality Grading"

def file_hash(filepath):
    """Return MD5 hash of the file contents."""
    hasher = hashlib.md5()
    with open(filepath, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hasher.update(chunk)
    return hasher.hexdigest()

hashes = {}
duplicates_removed = []

# Walk through all subfolders
for root, dirs, files in os.walk(base_dir):
    for filename in files:
        if filename.lower().endswith(".jpg"):
            filepath = os.path.join(root, filename)
            filehash = file_hash(filepath)
            
            if filehash in hashes:
                # Duplicate found → delete it
                os.remove(filepath)
                duplicates_removed.append((filepath, hashes[filehash]))
            else:
                hashes[filehash] = filepath

# Report
if duplicates_removed:
    print("🗑️ Duplicate images removed:\n")
    for dup, original in duplicates_removed:
        print(f"{dup} (removed) was a duplicate of {original}")
else:
    print("✅ No duplicates found. All images are unique.")
