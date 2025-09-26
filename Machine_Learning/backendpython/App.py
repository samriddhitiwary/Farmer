from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from tensorflow.keras.activations import softmax
from PIL import Image
from io import BytesIO
import numpy as np
import uvicorn

app = FastAPI()

# Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =======================================================
# --- 1. CONFIGURATION FOR CROP QUALITY GRADING MODEL ---
# =======================================================
QUALITY_MODEL_PATH = r"C:\Users\samri\cod\git\Farmer\Machine_Learning\Crop Quality Grading\best_model.h5"
QUALITY_INPUT_SIZE = (180, 180) 

# Quality Classes
QUALITY_BACKEND_CLASSES = ['Bad Quality_Fruits', 'Good Quality_Fruits', 'Mixed Qualit_Fruits']
QUALITY_OUTPUT_GRADES = ['C', 'A', 'B'] 

quality_model = None
try:
    print(f"Loading Quality Model from: {QUALITY_MODEL_PATH}")
    quality_model = load_model(QUALITY_MODEL_PATH, compile=False) 
    print("Quality Model loaded successfully.")
except Exception as e:
    print(f"FATAL: Error loading Quality Model: {e}")

# ========================================================
# --- 2. CONFIGURATION FOR CROP DISEASE DETECTION MODEL ---
# ========================================================
DISEASE_MODEL_PATH = r"C:\Users\samri\cod\git\Farmer\Machine_Learning\Crop Disease Detection\new_leaf_disease_model.h5"
DISEASE_INPUT_SIZE = (180, 180) 

# Disease Classes (Alphabetical order based on your folders)
DISEASE_CLASSES = [
    'Pepper__bell___Bacterial_spot',
    'Pepper__bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Tomato_Bacterial_spot',
    'Tomato_Early_blight',
    'Tomato_Late_blight',
    'Tomato_Leaf_Mold',
    'Tomato_Septoria_leaf_spot',
    'Tomato_Spider_mites_Two_spotted_spider_mite',
    'Tomato__Target_Spot',
    'Tomato__Tomato_YellowLeaf__Curl_Virus',
    'Tomato__Tomato_mosaic_virus',
    'Tomato_healthy'
]

disease_model = None
try:
    print(f"Loading Disease Model from: {DISEASE_MODEL_PATH}")
    disease_model = load_model(DISEASE_MODEL_PATH, compile=False) 
    print("Disease Model loaded successfully.")
except Exception as e:
    print(f"FATAL: Error loading Disease Model: {e}")
    
# =======================================================
# --- 3. ENDPOINT 1: CROP QUALITY GRADING (/api/grade_crop) ---
# =======================================================
@app.post("/api/grade_crop")
async def grade_crop(file: UploadFile = File(...)):
    if quality_model is None:
        raise HTTPException(status_code=503, detail="Quality model is not loaded.")

    try:
        contents = await file.read()
        img = Image.open(BytesIO(contents)).convert('RGB').resize(QUALITY_INPUT_SIZE)
        
        img_array = np.array(img, dtype=np.float32) 
        img_array = np.expand_dims(img_array, axis=0)

        prediction_output = quality_model.predict(img_array)
        probs = softmax(prediction_output[0]).numpy()
        
        predicted_index = int(np.argmax(probs))
        predicted_grade = QUALITY_OUTPUT_GRADES[predicted_index]
        confidence = float(probs[predicted_index] * 100)
        
        probability_map = {
            f'{QUALITY_OUTPUT_GRADES[i]} ({QUALITY_BACKEND_CLASSES[i]})': f"{probs[i]*100:.2f}%" 
            for i in range(len(QUALITY_BACKEND_CLASSES))
        }
        
        return {
            "grade": predicted_grade,
            "confidence": confidence,
            "all_probabilities": probability_map
        }

    except Exception as e:
        print(f"Quality Processing error: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred during quality processing: {e}")

# ========================================================
# --- 4. ENDPOINT 2: CROP DISEASE DETECTION (/api/detect_disease) ---
# ========================================================
@app.post("/api/detect_disease")
async def detect_disease(file: UploadFile = File(...)):
    if disease_model is None:
        raise HTTPException(status_code=503, detail="Disease model is not loaded.")

    try:
        contents = await file.read()
        
        img = Image.open(BytesIO(contents)).convert('RGB').resize(DISEASE_INPUT_SIZE)
        
        img_array = np.array(img, dtype=np.float32) 
        img_array = np.expand_dims(img_array, axis=0)

        prediction_output = disease_model.predict(img_array)
        probs = softmax(prediction_output[0]).numpy()
        
        predicted_index = int(np.argmax(probs))
        predicted_class = DISEASE_CLASSES[predicted_index]
        confidence = float(probs[predicted_index] * 100)
        
        if 'healthy' in predicted_class.lower():
            status = 'Healthy'
        else:
            status = 'Disease Detected'
        
        probability_map = {c: f"{p*100:.2f}%" for c, p in zip(DISEASE_CLASSES, probs)}
        
        print(f"\n--- DISEASE DEBUG INFO ---\nPrediction: {predicted_class}\nConfidence: {confidence:.2f}%\n--- END DEBUG INFO ---\n")
        
        return {
            "disease_name": predicted_class,
            "status": status,
            "confidence": confidence,
            "all_probabilities": probability_map
        }

    except Exception as e:
        print(f"Detection Processing error: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred during detection processing: {e}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)