import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

// This regex finds words that contain a mix of Ukrainian Cyrillic letters and the Latin 'i'.
// This is a strong indicator of a typo, common when switching keyboard layouts.
// It ensures at least one Cyrillic letter is present to avoid false positives in English/code.
const typoRegex = /\b([а-яА-ЯҐґЄєІіЇї]+i[а-яА-ЯҐґЄєІіЇї]*|[а-яА-ЯҐґЄєІіЇї]*i[а-яА-ЯҐґЄєІіЇї]+)\b/gu;

/**
 * Reads a file, replaces Latin 'i' with Cyrillic 'і' in Ukrainian words, and saves it back.
 * @param filePath The absolute path to the file to fix.
 * @returns The number of typos fixed in the file.
 */
async function fixFile(filePath: string): Promise<number> {
  try {
    const originalContent = await fs.readFile(filePath, 'utf-8');
    let typosFound = 0;
    const correctedWords = new Set<string>();

    const newContent = originalContent.replace(typoRegex, (word) => {
      typosFound++;
      const corrected = word.replace(/i/g, 'і');
      correctedWords.add(`'${word}' -> '${corrected}'`);
      return corrected;
    });

    if (typosFound > 0) {
      await fs.writeFile(filePath, newContent, 'utf-8');
      console.log(`✅ Fixed ${typosFound} typo(s) in ${path.relative(process.cwd(), filePath)}`);
      console.log(`   Corrections: ${Array.from(correctedWords).join(', ')}`);
      return typosFound;
    }
    return 0;
  } catch (error) {
    console.error(`❌ Error processing file ${filePath}:`, error);
    return 0;
  }
}

async function main() {
  // Default glob patterns based on the audit plan.
  // You can override this by passing file paths or glob patterns as command-line arguments.
  const defaultPatterns = [
    'src/app/crm/**/*.jsx',
    'atlas_ewu/configs/languages/uk.json',
    'docs/**/*.md',
  ];
  
  const patterns = process.argv.length > 2 ? process.argv.slice(2) : defaultPatterns;
  
  console.log('🇺🇦 Starting typo scan for Latin "i" in Ukrainian words...');
  
  const files = await glob(patterns, { nodir: true, absolute: true });

  console.log(`🔍 Found ${files.length} files matching patterns: ${patterns.join(', ')}`);
  const results = await Promise.all(files.map(fixFile));
  const totalFixed = results.reduce((sum, count) => sum + count, 0);

  console.log(totalFixed > 0 ? `\n✨ Total typos fixed: ${totalFixed}` : '\n✨ No typos found in the scanned files.');
  console.log('Done.');
}

main().catch(console.error);