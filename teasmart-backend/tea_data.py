import pandas as pd

# Sample data
data = {
    'location': ['Nakuru', 'Kericho', 'Kisii', 'Kirinyaga', 'Muranga', 'Nyeri', 'Kakamega', 'Embu', 'Nandi'],
    'altitude': [1500, 2200, 1600, 2000, 2500, 1800, 2700, 1700, 1900],  # in meters
    'temperature': [20, 18, 22, 24, 21, 19, 23, 25, 26],  # in degrees Celsius
    'rainfall': [1000, 1500, 1200, 1800, 1100, 1300, 1600, 1700, 2000],  # in mm/year
    'soilType': ['Volcanic red', 'Deep alluvial', 'Acidic', 'Laterite', 'Loamy', 'Sandy', 'Clay', 'Silt', 'Peat'],
    'soilPH': [5.5, 6.5, 4.5, 5.0, 6.0, 6.5, 5.5, 6.0, 5.5],
    'farmSize': [5, 10, 8, 1, 3, 6, 4, 2, 7],  # in acres
    'cropYield': [500, 600, 550, 450, 480, 520, 530, 490, 510],  # in kg/acre
    'teaType': ['Black Tea', 'Green Tea', 'Black Tea', 'Yellow Tea', 'Black Tea', 'Green Tea', 'Black Tea', 'Yellow Tea', 'Green Tea'],
    'recommendation': [
        'Use NPK 10-10-10', 
        'Plant in early March', 
        'Use Urea fertilizer', 
        'Use NPK 10-10-10', 
        'Plant in early March', 
        'Use Urea fertilizer', 
        'Use NPK 10-10-10', 
        'Plant in early March', 
        'Use Urea fertilizer'
    ],
}

# Create a DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv('tea_data.csv', index=False)

print("CSV file created successfully!")