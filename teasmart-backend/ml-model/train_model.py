import pandas as pd
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import os

# Load and clean dataset
try:
    data = pd.read_csv('tea_plantation_dataset.csv')
    # Fix column name typo
    data = data.rename(columns={'My Moleture': 'Moisture'})
    # Fix tea type naming
    data['Tea Type'] = data['Tea Type'].replace({'Colong': 'Oolong'})
    print("Dataset loaded successfully! Shape:", data.shape)
except Exception as e:
    print(f"Error loading dataset: {e}")
    exit()

# Configuration
TARGET_COLUMN = 'Fertilizer Name'
CATEGORICAL_COLS = ['Soil Type', 'Tea Type', TARGET_COLUMN]
NUMERICAL_COLS = ['Temperature', 'Humidity', 'Moisture', 'pH', 'Nitrogen',
                 'Potassium', 'Phosphorous', 'Size of land', 'Kilos Produced',
                 'Number of Bushes', 'Number of Bags']

# Create directory for artifacts
os.makedirs('label_encoders', exist_ok=True)

# Encode categorical variables
label_encoders = {}
for col in CATEGORICAL_COLS:
    le = LabelEncoder()
    data[col] = le.fit_transform(data[col])
    label_encoders[col] = le
    joblib.dump(le, f'label_encoders/{col}_encoder.pkl')

# Define features and target
features = NUMERICAL_COLS + ['Soil Type', 'Tea Type']
X = data[features]
y = data[TARGET_COLUMN]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Feature scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
joblib.dump(scaler, 'feature_scaler.pkl')

# XGBoost model
model = xgb.XGBClassifier(
    objective='multi:softmax',
    num_class=len(label_encoders[TARGET_COLUMN].classes_),
    max_depth=6,
    learning_rate=0.1,
    n_estimators=100,
    eval_metric='mlogloss',
    random_state=42
)

# Train model
model.fit(X_train_scaled, y_train)

# Evaluate
y_pred = model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)
print(f"\nModel Accuracy: {accuracy:.4f}")

# Save model
joblib.dump(model, 'fertilizer_recommendation_model.pkl')
print("\nModel and artifacts saved successfully!")