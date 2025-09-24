# import os

# # target directory
# directory = r"C:\Users\samri\cod\TeamA_EHR-Imaging-Documentation-System\data\images\lung_cancer\The IQ-OTHNCCD lung cancer dataset\The IQ-OTHNCCD lung cancer dataset\Normal cases"

# # iterate through all files in the directory
# for filename in os.listdir(directory):
#     if filename.lower().endswith(".jpg"):
#         # build full file path
#         old_path = os.path.join(directory, filename)

#         # rename pattern: replace spaces with underscores, remove parentheses
#         new_filename = filename.replace(" ", "_").replace("(", "").replace(")", "")
        
#         # final formatting to match Malignant_case_1.jpg
#         new_filename = new_filename.replace("__", "_")  # remove double underscores
#         new_filename = new_filename.replace("Normal_case_", "Normal_case_")

#         new_path = os.path.join(directory, new_filename)

#         # rename the file
#         os.rename(old_path, new_path)
#         print(f"Renamed: {filename} -> {new_filename}")


import os

# Base directory containing all quality folders
base_dir = r"C:\Users\samri\cod\git\Farmer\Machine_Learning\Crop Quality Grading"

# Walk through all subfolders
for root, dirs, files in os.walk(base_dir):
    for dir_name in dirs:
        subfolder_path = os.path.join(root, dir_name)
        # List only jpg files
        jpg_files = [f for f in os.listdir(subfolder_path) if f.lower().endswith(".jpg")]
        jpg_files.sort()  # optional: sort alphabetically
        # Rename files
        for i, filename in enumerate(jpg_files, start=1):
            ext = os.path.splitext(filename)[1]  # keep the original extension
            new_filename = f"{dir_name}_{i}{ext}"
            old_path = os.path.join(subfolder_path, filename)
            new_path = os.path.join(subfolder_path, new_filename)
            os.rename(old_path, new_path)
            print(f"Renamed: {filename} -> {new_filename}")
