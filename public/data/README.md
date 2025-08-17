# Top Songs Data

This directory contains JSON files for the "Top Songs of the Week" feature.

## File Structure

- `current-top-songs.json` - Currently displayed songs
- `songs-history/` - Archive of previous weeks' songs

## Updating Songs

To update the current week's songs:

1. Edit `current-top-songs.json`
2. Add your new songs to the `songs` array
3. Update the `weekOf` date to the current week
4. The widget will automatically refresh

## Song Object Format

```json
{
  "id": "unique-id",
  "title": "Song Title",
  "artist": "Artist Name", 
  "album": "Album Name",
  "artwork_url": "https://image-url.com/artwork.jpg",
  "spotify_url": "https://open.spotify.com/track/...",
  "youtube_url": "https://www.youtube.com/watch?v=...",
  "preview_url": null,
  "date_added": "2025-08-17"
}
```

## Archiving

When you update to a new week:
1. Copy the current `current-top-songs.json` to `songs-history/YYYY-week-NN.json`
2. Update `current-top-songs.json` with new songs

## Audio Playback

- If `preview_url` is provided, the play button will play a 30-second audio preview
- If `preview_url` is `null`, the play button will open the Spotify/YouTube link instead
- To get Spotify preview URLs, use the Spotify Web API (requires API key)
- Preview URLs should be direct MP3 links

## Notes

- `preview_url` can be used for 30-second audio previews (optional)
- At least one of `spotify_url` or `youtube_url` should be provided
- `artwork_url` should be a publicly accessible image URL
- All fields except `preview_url` are required