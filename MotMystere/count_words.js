// Count words in the database
import { WORDS } from "./static/words_filtered.js";

console.log("=== TUSMO CESI - Word Count ===\n");

// Total count
console.log(`Total words: ${WORDS.length}`);

// Count by length
const byLength = {};
WORDS.forEach(word => {
    const len = word.length;
    byLength[len] = (byLength[len] || 0) + 1;
});

console.log("\nWords by length:");
for (let len = 5; len <= 10; len++) {
    console.log(`  ${len} letters: ${byLength[len] || 0} words`);
}

console.log("\n=== End ===");
