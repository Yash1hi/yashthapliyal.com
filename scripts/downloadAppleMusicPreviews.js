#!/usr/bin/env node

/**
 * Apple Music Preview Downloader
 * 
 * This script downloads 30-second audio previews from Apple Music and saves them as static files.
 * Apple Music generally has better preview availability than Spotify!
 * 
 * Setup:
 * 1. npm install node-fetch
 * 2. No API key needed - uses public iTunes Search API
 * 3. Run: node scripts/downloadAppleMusicPreviews.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize dependencies
let fetch;
async function initializeDependencies() {
  try {
    const fetchModule = await import('node-fetch');
    fetch = fetchModule.default;
  } catch (error) {
    console.error('❌ node-fetch not found. Please install it:');
    console.error('npm install node-fetch');
    process.exit(1);
  }
}

// Search for track on Apple Music using iTunes Search API
async function searchAppleMusicTrack(title, artist) {
  const query = encodeURIComponent(`${artist} ${title}`);
  const url = `https://itunes.apple.com/search?term=${query}&entity=song&limit=5`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to search Apple Music: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Find the best match
  for (const track of data.results) {
    const titleMatch = track.trackName.toLowerCase().includes(title.toLowerCase()) ||
                      title.toLowerCase().includes(track.trackName.toLowerCase());
    const artistMatch = track.artistName.toLowerCase().includes(artist.toLowerCase()) ||
                       artist.toLowerCase().includes(track.artistName.toLowerCase());
    
    if (titleMatch && artistMatch && track.previewUrl) {
      return {
        name: track.trackName,
        artist: track.artistName,
        album: track.collectionName,
        previewUrl: track.previewUrl,
        artworkUrl: track.artworkUrl100?.replace('100x100', '300x300'), // Get higher res artwork
        appleUrl: track.trackViewUrl
      };
    }
  }
  
  return null;
}

// Download audio file from URL
async function downloadAudio(url, filePath) {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to download audio: ${response.statusText}`);
  }

  const fileStream = fs.createWriteStream(filePath);
  
  return new Promise((resolve, reject) => {
    response.body.pipe(fileStream);
    response.body.on('error', reject);
    fileStream.on('finish', resolve);
    fileStream.on('error', reject);
  });
}

// Create safe filename from song info
function createSafeFilename(title, artist) {
  const safeName = `${artist} - ${title}`
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toLowerCase();
  
  return `${safeName}.m4a`; // Apple Music previews are typically m4a
}

// Sleep function for rate limiting
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function
async function downloadAppleMusicPreviews() {
  try {
    console.log('🍎 Apple Music Preview Downloader');
    console.log('=================================');
    
    // Initialize dependencies
    await initializeDependencies();
    
    // Create audio directory if it doesn't exist
    const audioDir = path.join(__dirname, '../public/audio');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
      console.log('📁 Created audio directory: public/audio/');
    }
    
    console.log('🔍 Using iTunes Search API (no key required)');

    // Read current songs
    const songsPath = path.join(__dirname, '../public/data/current-top-songs.json');
    
    if (!fs.existsSync(songsPath)) {
      throw new Error(`Songs file not found: ${songsPath}`);
    }

    const songsData = JSON.parse(fs.readFileSync(songsPath, 'utf8'));
    
    console.log(`📦 Found ${songsData.songs.length} songs to process`);
    console.log('');

    // Download previews for each song
    let downloadedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < songsData.songs.length; i++) {
      const song = songsData.songs[i];
      
      console.log(`[${i + 1}/${songsData.songs.length}] Processing "${song.title}" by ${song.artist}`);
      
      try {
        // Search for the track on Apple Music
        console.log(`   🔍 Searching Apple Music...`);
        const appleTrack = await searchAppleMusicTrack(song.title, song.artist);
        
        if (!appleTrack) {
          console.log(`   ⚠️  Not found on Apple Music`);
          skippedCount++;
          continue;
        }

        if (!appleTrack.previewUrl) {
          console.log(`   ⚠️  No preview available`);
          skippedCount++;
          continue;
        }

        console.log(`   ✅ Found: "${appleTrack.name}" by ${appleTrack.artist}`);

        // Create filename and path
        const filename = createSafeFilename(song.title, song.artist);
        const audioPath = path.join(audioDir, filename);
        const relativePath = `/audio/${filename}`;

        // Check if file already exists
        if (fs.existsSync(audioPath)) {
          console.log(`   ✅ Already downloaded - using existing file`);
          songsData.songs[i].preview_url = relativePath;
          songsData.songs[i].apple_url = appleTrack.appleUrl;
          // Update artwork if available
          if (appleTrack.artworkUrl) {
            songsData.songs[i].artwork_url = appleTrack.artworkUrl;
          }
          downloadedCount++;
        } else {
          // Download the audio file
          console.log(`   ⬇️  Downloading preview...`);
          await downloadAudio(appleTrack.previewUrl, audioPath);
          
          // Update song with local path and Apple Music info
          songsData.songs[i].preview_url = relativePath;
          songsData.songs[i].apple_url = appleTrack.appleUrl;
          // Update artwork if available
          if (appleTrack.artworkUrl) {
            songsData.songs[i].artwork_url = appleTrack.artworkUrl;
          }
          
          console.log(`   ✅ Downloaded to: ${filename}`);
          downloadedCount++;
        }
        
        // Rate limiting - be nice to Apple's API
        await sleep(500);
        
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        errorCount++;
      }
    }

    // Write updated data back to file
    console.log('');
    console.log('💾 Updating songs file with local paths...');
    fs.writeFileSync(songsPath, JSON.stringify(songsData, null, 2));
    
    // Summary
    console.log('');
    console.log('🎉 Download Complete!');
    console.log('=====================');
    console.log(`✅ Downloaded: ${downloadedCount} audio files`);
    console.log(`⚠️  Skipped: ${skippedCount} songs`);
    console.log(`❌ Errors: ${errorCount} songs`);
    console.log('');
    
    if (downloadedCount > 0) {
      console.log('📁 Audio files saved to: public/audio/');
      console.log('🍎 Your music widget now uses Apple Music previews!');
      console.log('');
      console.log('💡 Benefits of Apple Music:');
      console.log('   • Better preview availability');
      console.log('   • No API key required');
      console.log('   • High-quality audio');
      console.log('   • More reliable access');
      console.log('');
      console.log('⚠️  Important: Include audio files in your git repo or deployment');
    } else {
      console.log('💡 Tip: Try different song titles or artists if nothing was found');
    }
    
  } catch (error) {
    console.error('');
    console.error('❌ Fatal Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  downloadAppleMusicPreviews();
}

export { downloadAppleMusicPreviews };