import os
import hashlib

# your directory
directory = r"C:\Users\samri\cod\TeamA_EHR-Imaging-Documentation-System\data\images\lung_cancer\The IQ-OTHNCCD lung cancer dataset\The IQ-OTHNCCD lung cancer dataset\Normal cases"

def file_hash(filepath):
    """Return MD5 hash of the file contents."""
    hasher = hashlib.md5()
    with open(filepath, 'rb') as f:
        # read in chunks to handle large files
        for chunk in iter(lambda: f.read(4096), b""):
            hasher.update(chunk)
    return hasher.hexdigest()

hashes = {}
duplicates = []

for filename in os.listdir(directory):
    if filename.lower().endswith(".jpg"):
        filepath = os.path.join(directory, filename)
        filehash = file_hash(filepath)

        if filehash in hashes:
            duplicates.append((filename, hashes[filehash]))
        else:
            hashes[filehash] = filename

# Report results
if duplicates:
    print("Duplicate images found:\n")
    for dup, original in duplicates:
        print(f"{dup} is a duplicate of {original}")
else:
    print("✅ All images are unique. No duplicates found.")
