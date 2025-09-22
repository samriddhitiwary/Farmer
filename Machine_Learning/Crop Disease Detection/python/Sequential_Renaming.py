import os

# target directory
directory = r"C:\Users\samri\cod\git\Farmer\Machine_Learning\Crop Disease Detection\PlantVillage\Tomato_Spider_mites_Two_spotted_spider_mite"

# get all jpg files
files = [f for f in os.listdir(directory) if f.lower().endswith(".jpg")]

# sort files for consistent ordering
files.sort()

# Step 1: rename to temporary names
temp_names = []
for i, filename in enumerate(files, start=1):
    old_path = os.path.join(directory, filename)
    temp_filename = f"temp_{i}.jpg"
    temp_path = os.path.join(directory, temp_filename)
    os.rename(old_path, temp_path)
    temp_names.append(temp_filename)

# Step 2: rename temporary names to final sequential names
for i, temp_filename in enumerate(temp_names, start=1):
    old_path = os.path.join(directory, temp_filename)
    new_filename = f"Tomato_Spider_mites_Two_spotted_spider_mite_{i}.jpg"
    new_path = os.path.join(directory, new_filename)
    os.rename(old_path, new_path)
    print(f"Renamed: {temp_filename} -> {new_filename}")

print("\n✅ Renaming complete. All files renamed sequentially without conflicts.")
