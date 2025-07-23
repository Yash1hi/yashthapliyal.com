import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const inputFolder = path.join(__dirname, '../public/Uncompressed-Photos'); // Path to uncompressed photos
const outputFolder = path.join(__dirname, '../public/Portfolio-Photos-WebP');
const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif'];

// Compression settings
const compressionOptions = {
  quality: 80, // WebP quality (0-100)
  format: 'webp', // Output format
  lossless: false, // Lossy compression for smaller file sizes
  effort: 6, // Compression effort (0-6, higher = better compression but slower)
};

async function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

async function compressImage(inputPath, outputPath) {
  try {
    const filename = path.basename(inputPath);
    const nameWithoutExt = path.parse(filename).name;
    const outputFilename = `${nameWithoutExt}.${compressionOptions.format}`;
    const fullOutputPath = path.join(outputPath, outputFilename);

    console.log(`Compressing: ${filename}`);

    await sharp(inputPath)
      .webp({
        quality: compressionOptions.quality,
        lossless: compressionOptions.lossless,
        effort: compressionOptions.effort,
      })
      .toFile(fullOutputPath);

    // Get file sizes for comparison
    const originalStats = fs.statSync(inputPath);
    const compressedStats = fs.statSync(fullOutputPath);
    const compressionRatio = ((originalStats.size - compressedStats.size) / originalStats.size * 100).toFixed(1);

    console.log(`✓ Compressed: ${filename}`);
    console.log(`  Original: ${(originalStats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Compressed: ${(compressedStats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Compression: ${compressionRatio}% smaller\n`);

    return {
      original: originalStats.size,
      compressed: compressedStats.size,
      ratio: compressionRatio,
    };
  } catch (error) {
    console.error(`✗ Error compressing ${path.basename(inputPath)}:`, error.message);
    return null;
  }
}

async function getImageFiles(folderPath) {
  try {
    const files = fs.readdirSync(folderPath);
    return files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return supportedFormats.includes(ext);
    });
  } catch (error) {
    console.error(`Error reading directory ${folderPath}:`, error.message);
    return [];
  }
}

async function compressPhotos() {
  console.log('🚀 Starting photo compression...\n');

  // Ensure output directory exists
  await ensureDirectoryExists(outputFolder);

  // Check if input folder exists
  if (!fs.existsSync(inputFolder)) {
    console.error(`❌ Input folder not found: ${inputFolder}`);
    console.log('Please update the inputFolder path in the script to point to your photos directory.');
    return;
  }

  // Get all image files
  const imageFiles = await getImageFiles(inputFolder);
  
  if (imageFiles.length === 0) {
    console.log('No supported image files found in the input folder.');
    return;
  }

  console.log(`Found ${imageFiles.length} image files to compress.\n`);

  // Compress each image
  const results = [];
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;

  for (const file of imageFiles) {
    const inputPath = path.join(inputFolder, file);
    const result = await compressImage(inputPath, outputFolder);
    
    if (result) {
      results.push(result);
      totalOriginalSize += result.original;
      totalCompressedSize += result.compressed;
    }
  }

  // Summary
  console.log('📊 Compression Summary:');
  console.log(`Total files processed: ${results.length}`);
  console.log(`Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total compressed size: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Overall compression: ${((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1)}% smaller`);
  console.log(`\n✅ Compressed photos saved to: ${outputFolder}`);
}

// Run the compression
compressPhotos().catch(console.error);