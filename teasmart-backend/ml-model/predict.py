import joblib
import pandas as pd
import json
import sys
import os
import numpy as np

# Get the absolute path to the directory containing this script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Configuration - MUST MATCH train_model.py
TARGET_COLUMN = 'Fertilizer Name'
FEATURES = ['Temperature', 'Humidity', 'Moisture', 'pH', 'Soil Type', 'Tea Type',
           'Nitrogen', 'Potassium', 'Phosphorous', 'Size of land',
           'Kilos Produced', 'Number of Bushes', 'Number of Bags']

def load_artifacts():
    """Load all required artifacts (model, encoders, scaler) using absolute paths"""
    try:
        artifacts = {
            'model': joblib.load(os.path.join(SCRIPT_DIR, 'fertilizer_recommendation_model.pkl')),
            'scaler': joblib.load(os.path.join(SCRIPT_DIR, 'feature_scaler.pkl'))
        }
        
        # Load all label encoders
        artifacts['encoders'] = {}
        encoders_dir = os.path.join(SCRIPT_DIR, 'label_encoders')
        
        if not os.path.exists(encoders_dir):
            raise FileNotFoundError(f"Label encoders directory not found at: {encoders_dir}")
            
        for file in os.listdir(encoders_dir):
            if file.endswith('_encoder.pkl'):
                col_name = file.replace('_encoder.pkl', '')
                artifacts['encoders'][col_name] = joblib.load(os.path.join(encoders_dir, file))
        
        return artifacts
        
    except Exception as e:
        raise RuntimeError(f"Error loading model artifacts: {str(e)}")

def validate_input(input_df):
    """Validate input data ranges"""
    ranges = {
        'Temperature': (10, 40),
        'Humidity': (0, 100),
        'Moisture': (0, 100),
        'pH': (3, 9),
        'Nitrogen': (0, 100),
        'Potassium': (0, 100),
        'Phosphorous': (0, 100),
        'Size of land': (0, 100),
        'Kilos Produced': (0, 5000),
        'Number of Bushes': (0, 5000),
        'Number of Bags': (0, 100)
    }
    
    for col, (min_val, max_val) in ranges.items():
        if col in input_df.columns:
            if not input_df[col].between(min_val, max_val).all():
                raise ValueError(f"{col} values out of range ({min_val}-{max_val})")

def preprocess_input(input_data, encoders):
    """Convert and preprocess input data"""
    # Convert input to DataFrame
    input_df = pd.DataFrame([input_data])
    
    # Fix tea type naming inconsistency
    if 'Tea Type' in input_df.columns:
        input_df['Tea Type'] = input_df['Tea Type'].replace({'Oolong': 'Colong'})
    
    # Convert humidity/moisture from 0-1 to 0-100 if needed
    if 'Humidity' in input_df.columns and input_df['Humidity'].max() <= 1:
        input_df['Humidity'] = input_df['Humidity'] * 100
    if 'Moisture' in input_df.columns and input_df['Moisture'].max() <= 1:
        input_df['Moisture'] = input_df['Moisture'] * 100
    
    # Encode categorical features
    for col in ['Soil Type', 'Tea Type']:
        if col in input_df.columns and col in encoders:
            if input_df[col].iloc[0] not in encoders[col].classes_:
                raise ValueError(f"Invalid value for {col}: {input_df[col].iloc[0]}")
            input_df[col] = encoders[col].transform(input_df[col])
    
    return input_df

def recommend_fertilizer(input_data):
    try:
        # Load artifacts
        artifacts = load_artifacts()
        
        # Preprocess input
        input_df = preprocess_input(input_data, artifacts['encoders'])
        
        # Validate input ranges
        validate_input(input_df)
        
        # Ensure correct feature order and scale
        input_features = input_df[FEATURES]
        input_features_scaled = artifacts['scaler'].transform(input_features)
        
        # Make prediction
        prediction = artifacts['model'].predict(input_features_scaled)[0]
        recommended_fertilizer = artifacts['encoders'][TARGET_COLUMN].inverse_transform([prediction])[0]
        
        return {
            'status': 'success',
            'recommended_fertilizer': recommended_fertilizer,
            'input_features': input_data
        }
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e),
            'input_data': input_data,
            'python_script_location': SCRIPT_DIR  # For debugging
        }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            input_data = json.loads(sys.argv[1])
            result = recommend_fertilizer(input_data)
            print(json.dumps(result, indent=2))
        except json.JSONDecodeError:
            print(json.dumps({
                'status': 'error',
                'message': 'Invalid JSON input',
                'argv': sys.argv
            }, indent=2))
    else:
        # Test with known value from dataset
        test_case = {
            "Temperature": 26,
            "Humidity": 68,
            "Moisture": 53,
            "pH": 4.59,
            "Soil Type": "Sandy",
            "Tea Type": "Green",
            "Nitrogen": 46,
            "Potassium": 33,
            "Phosphorous": 10,
            "Size of land": 9,
            "Kilos Produced": 1120,
            "Number of Bushes": 1368,
            "Number of Bags": 1
        }
        print("Testing with known value from dataset:")
        result = recommend_fertilizer(test_case)
        print(json.dumps(result, indent=2))
        
        # Print paths for verification
        print("\nSystem paths:")
        print(f"Script directory: {SCRIPT_DIR}")
        print(f"Model path: {os.path.join(SCRIPT_DIR, 'fertilizer_recommendation_model.pkl')}")
        print(f"Scaler path: {os.path.join(SCRIPT_DIR, 'feature_scaler.pkl')}")
        print(f"Encoders dir: {os.path.join(SCRIPT_DIR, 'label_encoders')}")