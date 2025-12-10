import re

# Read the file
with open('static/words_filtered.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all words between quotes
words = re.findall(r'"([A-Z]+)"', content)

print("=== TUSMO CESI - Word Count ===\n")
print(f"Total words: {len(words)}")

# Count by length
by_length = {}
for word in words:
    length = len(word)
    by_length[length] = by_length.get(length, 0) + 1

print("\nWords by length:")
for length in sorted(by_length.keys()):
    print(f"  {length} letters: {by_length[length]} words")

print("\n=== End ===")
