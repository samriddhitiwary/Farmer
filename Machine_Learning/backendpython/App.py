from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from tensorflow.keras.activations import softmax
from PIL import Image
from io import BytesIO
import numpy as np

app = FastAPI()

# Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Configuration Variables ---
MODEL_PATH = r"C:\Users\samri\cod\git\Farmer\Machine_Learning\Crop Quality Grading\best_model.h5"
INPUT_SIZE = (180, 180) 

# --- CRITICAL CHANGE: MAPPING TO A, B, C GRADES ---
# Assuming the model's output index order is:
# Index 0: 'Bad Quality_Fruits' (Now maps to C)
# Index 1: 'Good Quality_Fruits' (Now maps to A)
# Index 2: 'Mixed Qualit_Fruits' (Now maps to B)
# *YOU MUST VERIFY THIS INDEX ORDER based on your training class_names:*
# If class_names was ['Bad Quality_Fruits', 'Good Quality_Fruits', 'Mixed Qualit_Fruits'] (Alphabetical)

# Use a clear mapping list for the backend:
BACKEND_CLASSES = ['Bad Quality_Fruits', 'Good Quality_Fruits', 'Mixed Qualit_Fruits']

# Define the final output grades corresponding to the order of BACKEND_CLASSES
OUTPUT_GRADES = ['C', 'A', 'B'] # Map: C=Bad, A=Good, B=Mixed

model = None
try:
    model = load_model(MODEL_PATH, compile=False) 
    print("Model loaded successfully.")
except Exception as e:
    print(f"FATAL: Error loading model: {e}")
# -------------------------------

@app.post("/api/grade_crop")
async def grade_crop(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model is not loaded.")

    try:
        contents = await file.read()
        img = Image.open(BytesIO(contents)).convert('RGB').resize(INPUT_SIZE)
        
        # Preprocessing: Keeping data unnormalized [0, 255] as per the fix
        img_array = np.array(img, dtype=np.float32) 
        img_array = np.expand_dims(img_array, axis=0)

        # Prediction
        prediction_output = model.predict(img_array)
        probs = softmax(prediction_output[0]).numpy()
        
        predicted_index = int(np.argmax(probs))
        
        # --- APPLY NEW GRADE MAPPING ---
        predicted_grade = OUTPUT_GRADES[predicted_index]
        # -----------------------------
        
        confidence = float(probs[predicted_index] * 100)
        
        # Debugging: Show the detailed mapping in the console output
        probability_map = {
            f'{OUTPUT_GRADES[i]} ({BACKEND_CLASSES[i]})': f"{probs[i]*100:.2f}%" 
            for i in range(len(BACKEND_CLASSES))
        }
        print(f"\n--- DEBUG INFO ---\nProbabilities: {probability_map}\n--- END DEBUG INFO ---\n")
        
        return {
            "grade": predicted_grade, # Returns A, B, or C
            "confidence": confidence,
            "all_probabilities": probability_map
        }

    except Exception as e:
        print(f"Processing error: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred during processing: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)