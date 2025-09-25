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
classes = ['Bad Quality_Fruits', 'Good Quality_Fruits', 'Mixed Qualit_Fruits'] # Assumes this order is correct

model = None
try:
    # Set compile=False for safer loading
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
        
        # --- CRITICAL FIX: REMOVED NORMALIZATION ---
        # Data is kept in the [0, 255] range to match the model's training input.
        img_array = np.array(img, dtype=np.float32) 
        # DO NOT divide by 255.0 here.
        
        # Add batch dimension (1, H, W, C)
        img_array = np.expand_dims(img_array, axis=0)

        # 1. Get raw prediction output
        prediction_output = model.predict(img_array)
        
        # 2. Apply Softmax to convert logits (or probabilities) into normalized probabilities
        probs = softmax(prediction_output[0]).numpy()
        
        # Debugging: Print results to console
        print(f"\n--- DEBUG INFO ---")
        print(f"Probabilities (Post-softmax): {probs}")
        print(f"--- END DEBUG INFO ---\n")

        predicted_index = int(np.argmax(probs))
        predicted_class = classes[predicted_index]
        confidence = float(probs[predicted_index] * 100)
        
        return {
            "grade": predicted_class, 
            "confidence": confidence,
            "all_probabilities": {c: f"{p*100:.2f}%" for c, p in zip(classes, probs)}
        }

    except Exception as e:
        print(f"Processing error: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred during processing: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)