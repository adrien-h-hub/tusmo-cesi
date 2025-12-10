"""
Get the daily word for TUSMO CESI
"""
from datetime import datetime
import re

# Read words from file
with open('static/words_filtered.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all words
words = re.findall(r'"([A-Z]+)"', content)

print(f"Total words in database: {len(words)}")

# Get current date and time
now = datetime.now()
year = now.year
month = now.month
day = now.day
hour = now.hour

# Determine seed (changes at noon)
if hour >= 12:
    seed = f"{year}-{month}-{day}-PM"
else:
    seed = f"{year}-{month}-{day}-AM"

print(f"\nCurrent time: {now.strftime('%Y-%m-%d %H:%M:%S')}")
print(f"Seed: {seed}")

# Calculate hash (same algorithm as JavaScript)
hash_value = 0
for char in seed:
    hash_value = ((hash_value << 5) - hash_value) + ord(char)
    hash_value = hash_value & 0xFFFFFFFF  # Keep as 32-bit integer

# Get index
index = abs(hash_value) % len(words)
daily_word = words[index]

print(f"\n{'='*50}")
print(f"MOT DU JOUR: {daily_word}")
print(f"{'='*50}")
print(f"\nLongueur: {len(daily_word)} lettres")
print(f"Index: {index}")

# Calculate next change time
if hour >= 12:
    next_change = "demain à 00:00"
else:
    next_change = "aujourd'hui à 12:00"

print(f"\nProchain changement: {next_change}")
