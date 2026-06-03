// =====================================================
// Author: Shruti Mandaokar
// Component: SongCard
//
// Purpose:
// Displays a song recommendation with:
// - Title, artist, and reasoning
// - Quick links to Spotify and YouTube search
// =====================================================

export default function SongCard({ song }) {

    // =====================================================
    // Build external search URLs
    //
    // We use searchQuery from backend AI response
    // to generate platform-specific search links
    // =====================================================
  
    const spotifyUrl =
      `https://open.spotify.com/search/` +
      encodeURIComponent(song.searchQuery);
  
    const ytUrl =
      `https://www.youtube.com/results?search_query=` +
      encodeURIComponent(song.searchQuery);
  
    return (
      <div
        style={{
          // Card container styling
          background: "var(--white)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
  
          padding: "14px 18px",
  
          // Layout: icon + content + buttons in one row
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
  
        {/* =====================================================
            Music Icon Section
        ===================================================== */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
  
            // Soft accent background
            background: "var(--rose-light)",
  
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
  
            fontSize: 20,
  
            // Prevent icon from shrinking
            flexShrink: 0,
          }}
        >
          🎵
        </div>
  
        {/* =====================================================
            Song Information Section
        ===================================================== */}
        <div style={{ flex: 1, minWidth: 0 }}>
  
          {/* Song title */}
          <p
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: "var(--text)",
              marginBottom: 2,
            }}
          >
            {song.title}
          </p>
  
          {/* Artist name */}
          <p
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              marginBottom: 4,
            }}
          >
            {song.artist}
          </p>
  
          {/* Why this song matches the vibe */}
          <p
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              fontStyle: "italic",
              lineHeight: 1.4,
            }}
          >
            {song.reason}
          </p>
        </div>
  
        {/* =====================================================
            External Links Section
            - Spotify search
            - YouTube search
        ===================================================== */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
  
            // Prevent buttons from shrinking
            flexShrink: 0,
          }}
        >
  
          {/* Spotify Link Button */}
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 11,
              padding: "5px 12px",
              borderRadius: 20,
  
              background: "#1DB954", // Spotify green
              color: "white",
  
              fontWeight: 600,
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Spotify
          </a>
  
          {/* YouTube Link Button */}
          <a
            href={ytUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 11,
              padding: "5px 12px",
              borderRadius: 20,
  
              background: "#FF0000", // YouTube red
              color: "white",
  
              fontWeight: 600,
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            YouTube
          </a>
        </div>
      </div>
    );
  }