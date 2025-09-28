import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const inputFolder = path.join(__dirname, '../public/Portfolio-Photos-WebP'); // Full size photos
const thumbnailFolder = path.join(__dirname, '../public/Portfolio-Photos-Thumbnails');
const supportedFormats = ['.webp', '.jpg', '.jpeg', '.png'];

// Thumbnail settings
const thumbnailOptions = {
  width: 800, // Max width for thumbnails
  height: 1200, // Max height for thumbnails
  quality: 100, // Lower quality for faster loading
  format: 'webp',
  fit: 'inside', // Maintain aspect ratio
  withoutEnlargement: true, // Don't upscale small images
};

async function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

async function generateThumbnail(inputPath, outputPath) {
  try {
    const filename = path.basename(inputPath);
    const nameWithoutExt = path.parse(filename).name;
    const outputFilename = `${nameWithoutExt}-thumb.${thumbnailOptions.format}`;
    const fullOutputPath = path.join(outputPath, outputFilename);

    // Skip if thumbnail already exists
    if (fs.existsSync(fullOutputPath)) {
      console.log(`⏭️  Thumbnail already exists: ${outputFilename}`);
      return null;
    }

    console.log(`Creating thumbnail: ${filename}`);

    await sharp(inputPath)
      .resize({
        width: thumbnailOptions.width,
        height: thumbnailOptions.height,
        fit: thumbnailOptions.fit,
        withoutEnlargement: thumbnailOptions.withoutEnlargement,
      })
      .webp({
        quality: thumbnailOptions.quality,
        effort: 6,
      })
      .toFile(fullOutputPath);

    // Get file sizes for comparison
    const originalStats = fs.statSync(inputPath);
    const thumbnailStats = fs.statSync(fullOutputPath);
    const reductionRatio = ((originalStats.size - thumbnailStats.size) / originalStats.size * 100).toFixed(1);

    console.log(`✓ Created: ${outputFilename}`);
    console.log(`  Original: ${(originalStats.size / 1024).toFixed(1)} KB`);
    console.log(`  Thumbnail: ${(thumbnailStats.size / 1024).toFixed(1)} KB`);
    console.log(`  Size reduction: ${reductionRatio}%\n`);

    return {
      original: originalStats.size,
      thumbnail: thumbnailStats.size,
      reduction: reductionRatio,
    };
  } catch (error) {
    console.error(`✗ Error creating thumbnail for ${path.basename(inputPath)}:`, error.message);
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

async function generateThumbnails() {
  console.log('🖼️  Starting thumbnail generation...\n');

  // Ensure output directory exists
  await ensureDirectoryExists(thumbnailFolder);

  // Check if input folder exists
  if (!fs.existsSync(inputFolder)) {
    console.error(`❌ Input folder not found: ${inputFolder}`);
    console.log('Please ensure your Portfolio-Photos-WebP folder exists.');
    return;
  }

  // Get all image files
  const imageFiles = await getImageFiles(inputFolder);

  if (imageFiles.length === 0) {
    console.log('No supported image files found in the input folder.');
    return;
  }

  console.log(`Found ${imageFiles.length} image files to process.\n`);

  // Generate thumbnails
  const results = [];
  let totalOriginalSize = 0;
  let totalThumbnailSize = 0;
  let processedCount = 0;

  for (const file of imageFiles) {
    const inputPath = path.join(inputFolder, file);
    const result = await generateThumbnail(inputPath, thumbnailFolder);

    if (result) {
      results.push(result);
      totalOriginalSize += result.original;
      totalThumbnailSize += result.thumbnail;
      processedCount++;
    }
  }

  // Summary
  console.log('📊 Thumbnail Generation Summary:');
  console.log(`Total files processed: ${processedCount}`);
  console.log(`Files skipped (already exist): ${imageFiles.length - processedCount}`);
  if (processedCount > 0) {
    console.log(`Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total thumbnail size: ${(totalThumbnailSize / 1024).toFixed(1)} KB`);
    console.log(`Overall size reduction: ${((totalOriginalSize - totalThumbnailSize) / totalOriginalSize * 100).toFixed(1)}%`);
  }
  console.log(`\n✅ Thumbnails saved to: ${thumbnailFolder}`);

  // Provide usage instructions
  console.log('\n💡 Usage Instructions:');
  console.log('1. Update your Photography.tsx component to use thumbnails for initial loading');
  console.log('2. Load full-size images when users click on thumbnails');
  console.log('3. Thumbnail naming convention: [original-name]-thumb.webp');
}

// Run the thumbnail generation
generateThumbnails().catch(console.error);