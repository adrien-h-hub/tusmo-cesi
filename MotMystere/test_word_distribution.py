"""
Test the word distribution to verify 75% short / 25% long
"""
import re

# Read words from file
with open('static/words_filtered.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all words
words = re.findall(r'"([A-Z]+)"', content)

print(f"Total words: {len(words)}")

# Count by length category
short_words = [w for w in words if len(w) <= 7]
long_words = [w for w in words if len(w) >= 8]

print(f"\nShort words (5-7 letters): {len(short_words)} ({len(short_words)/len(words)*100:.1f}%)")
print(f"Long words (8+ letters): {len(long_words)} ({len(long_words)/len(words)*100:.1f}%)")

# Simulate 1000 selections
print("\n=== Simulation de 1000 selections ===")

def get_weighted_word(seed_num):
    """Simulate the JavaScript weighted selection"""
    # Simple hash
    hash_val = seed_num * 31
    
    # 75% chance for short words
    use_short = (abs(hash_val) % 100) < 75
    
    if use_short and short_words:
        index = abs(hash_val) % len(short_words)
        return short_words[index]
    elif long_words:
        index = abs(hash_val) % len(long_words)
        return long_words[index]
    else:
        index = abs(hash_val) % len(words)
        return words[index]

# Run simulation
selected_short = 0
selected_long = 0

for i in range(1000):
    word = get_weighted_word(i)
    if len(word) <= 7:
        selected_short += 1
    else:
        selected_long += 1

print(f"\nResultats de la simulation:")
print(f"Mots courts selectionnes: {selected_short} ({selected_short/10:.1f}%)")
print(f"Mots longs selectionnes: {selected_long} ({selected_long/10:.1f}%)")

print("\n=== Distribution par longueur ===")
by_length = {}
for word in words:
    length = len(word)
    by_length[length] = by_length.get(length, 0) + 1

for length in sorted(by_length.keys()):
    count = by_length[length]
    pct = count / len(words) * 100
    bar = '█' * int(pct)
    print(f"{length:2d} lettres: {count:6d} ({pct:5.1f}%) {bar}")
