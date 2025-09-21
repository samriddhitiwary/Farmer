import torch
import torchvision.transforms as transforms
from PIL import Image
from torchvision import models
import random

# For testing only: use pretrained ResNet without custom weights
model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

grades = ['A', 'B', 'C']

def predict_quality(image_path):
    # Open image (still required for transform)
    img = Image.open(image_path).convert('RGB')
    img_t = transform(img).unsqueeze(0)
    
    # For testing, just return random grade
    return random.choice(grades)
