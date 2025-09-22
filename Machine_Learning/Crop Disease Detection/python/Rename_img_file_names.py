import os

# target directory
directory = r"C:\Users\samri\cod\TeamA_EHR-Imaging-Documentation-System\data\images\lung_cancer\The IQ-OTHNCCD lung cancer dataset\The IQ-OTHNCCD lung cancer dataset\Normal cases"

# iterate through all files in the directory
for filename in os.listdir(directory):
    if filename.lower().endswith(".jpg"):
        # build full file path
        old_path = os.path.join(directory, filename)

        # rename pattern: replace spaces with underscores, remove parentheses
        new_filename = filename.replace(" ", "_").replace("(", "").replace(")", "")
        
        # final formatting to match Malignant_case_1.jpg
        new_filename = new_filename.replace("__", "_")  # remove double underscores
        new_filename = new_filename.replace("Normal_case_", "Normal_case_")

        new_path = os.path.join(directory, new_filename)

        # rename the file
        os.rename(old_path, new_path)
        print(f"Renamed: {filename} -> {new_filename}")
