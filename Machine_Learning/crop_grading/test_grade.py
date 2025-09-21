import os
from model import predict_quality

# Folder with images
image_folder = r"C:\Users\samri\cod\git\Farmer\Machine_Learning\sample_images"

# Only process image files
valid_extensions = ('.jpg', '.jpeg', '.png', '.bmp')

for img_file in os.listdir(image_folder):
    if img_file.lower().endswith(valid_extensions):
        img_path = os.path.join(image_folder, img_file)
        try:
            grade = predict_quality(img_path)
            print(f"Image: {img_file} → Predicted Grade: {grade}")
        except Exception as e:
            print(f"Failed to process {img_file}: {e}")
