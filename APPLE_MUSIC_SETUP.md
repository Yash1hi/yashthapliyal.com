# 🍎 Apple Music Preview Setup Guide

Apple Music provides much better preview availability than Spotify! This guide will help you download 30-second audio previews as static files for your music widget.

## ✅ Advantages Over Spotify

- **🎵 Better Preview Availability**: Most songs have 30-second previews
- **🔑 No API Key Required**: Uses public iTunes Search API
- **🏆 Higher Success Rate**: Popular songs actually work!
- **🎧 High Quality**: AAC/M4A audio format
- **🚀 Simple Setup**: No developer account needed

## Quick Start

### Step 1: Install Dependencies

```bash
npm install node-fetch
```

*(No API credentials needed!)*

### Step 2: Download Audio Previews

```bash
npm run download-apple-music-previews
```

### Step 3: Enjoy Audio!

Your music widget now has working audio previews! 🎉

## What the Script Does

1. ✅ Reads your `public/data/current-top-songs.json` file
2. ✅ Searches Apple Music using iTunes Search API
3. ✅ Downloads 30-second M4A previews to `public/audio/`
4. ✅ Updates songs JSON with local file paths and Apple Music URLs
5. ✅ Updates artwork with high-quality Apple Music images

## Sample Output

```
🍎 Apple Music Preview Downloader
=================================
🔍 Using iTunes Search API (no key required)
📦 Found 3 songs to process

[1/3] Processing "Anti-Hero" by Taylor Swift
   🔍 Searching Apple Music...
   ✅ Found: "Anti-Hero" by Taylor Swift
   ⬇️  Downloading preview...
   ✅ Downloaded to: taylor-swift---anti-hero.m4a

[2/3] Processing "Flowers" by Miley Cyrus
   🔍 Searching Apple Music...
   ✅ Found: "Flowers" by Miley Cyrus
   ⬇️  Downloading preview...
   ✅ Downloaded to: miley-cyrus---flowers.m4a

[3/3] Processing "As It Was" by Harry Styles
   🔍 Searching Apple Music...
   ✅ Found: "As It Was" by Harry Styles
   ⬇️  Downloading preview...
   ✅ Downloaded to: harry-styles---as-it-was.m4a

💾 Updating songs file with local paths...

🎉 Download Complete!
=====================
✅ Downloaded: 3 audio files
⚠️  Skipped: 0 songs
❌ Errors: 0 songs

📁 Audio files saved to: public/audio/
🍎 Your music widget now uses Apple Music previews!

💡 Benefits of Apple Music:
   • Better preview availability
   • No API key required
   • High-quality audio
   • More reliable access
```

## File Structure After Download

```
public/audio/
├── taylor-swift---anti-hero.m4a        (30-second preview)
├── miley-cyrus---flowers.m4a           (30-second preview)
└── harry-styles---as-it-was.m4a        (30-second preview)
```

Your songs JSON gets updated with:
```json
{
  "preview_url": "/audio/taylor-swift---anti-hero.m4a",
  "apple_url": "https://music.apple.com/us/album/anti-hero/...",
  "artwork_url": "https://is1-ssl.mzstatic.com/image/thumb/Music122/..."
}
```

## How It Works

### Smart Song Matching
- Searches Apple Music by artist + song title
- Finds best match using fuzzy matching
- Prioritizes exact title and artist matches

### Audio Format
- Downloads high-quality M4A files (Apple's preferred format)
- 30-second previews (standard length)
- Works with HTML5 audio in all modern browsers

### Updated Features
- External link button now prefers Apple Music over Spotify
- Play button opens Apple Music if no preview available
- High-quality artwork from Apple Music

## Troubleshooting

### "Song not found on Apple Music"
- Try slightly different song titles
- Some songs may not be available in your region
- Independent/unreleased tracks might not be indexed

### "No preview available"
- Very rare with Apple Music (much better than Spotify)
- Usually means the song is region-restricted
- Try different songs or wait for wider release

### File Format Support
- M4A files work in all modern browsers
- Smaller file sizes than MP3 with better quality
- Native format for Apple devices

## Migration from Spotify

If you were using Spotify before:

1. **Keep existing setup**: Apple Music script works alongside Spotify
2. **Better results**: Run Apple Music script on same songs
3. **Automatic preference**: External links now prefer Apple Music
4. **Artwork upgrade**: Gets higher quality album art

## Next Steps

After running the script:
1. ✅ Audio files stored locally in `public/audio/`
2. ✅ Songs JSON updated with Apple Music data
3. ✅ Music widget plays previews instantly
4. ✅ External links open Apple Music first
5. 🔄 Re-run script when you update songs

## Why Apple Music Works Better

**Technical Advantages:**
- **Public API**: iTunes Search API is public and free
- **Better Licensing**: Apple has more permissive preview licensing
- **Global Availability**: Works in more countries
- **Quality**: Higher quality audio and artwork
- **Reliability**: More consistent availability

**vs Spotify:**
- ❌ Spotify: Most songs have no previews due to licensing
- ✅ Apple Music: Most songs have 30-second previews
- ❌ Spotify: Requires developer account and API keys
- ✅ Apple Music: No registration or keys needed

Enjoy your working audio previews! 🍎🎧