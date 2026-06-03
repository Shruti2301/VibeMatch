// =====================================================
// Author: Shruti Mandaokar
// Page: SharePage
//
// Purpose:
// Public-facing shareable page for VibeMatch results.
//
// Anyone with a link (/share/:id) can:
// - View generated vibe messages
// - See song recommendations
// - Copy individual messages
// - Navigate back to create their own
// =====================================================

import { useState, useEffect } from "react";
import SongCard from "../components/SongCard.jsx";

export default function SharePage({ id }) {

  // Stores fetched shared vibe data
  const [data, setData] = useState(null);

  // Loading state while fetching from backend
  const [loading, setLoading] = useState(true);

  // Error state if share link is invalid or fails
  const [error, setError] = useState("");

  // =====================================================
  // Fetch shared vibe data on page load
  // =====================================================
  useEffect(() => {
    const load = async () => {
      try {

        // Call backend API to fetch shared result by ID
        const res = await fetch(`/api/share/${id}`);
        const raw = await res.text();
        let json;
        try {
          json = raw ? JSON.parse(raw) : {};
        } catch {
          throw new Error("Backend unavailable");
        }

        // Handle API errors
        if (!res.ok) throw new Error(json.error);

        // Store fetched data
        setData(json);

      } catch {

        // Show user-friendly error message
        setError("This vibe couldn't be found 🌸");

      } finally {

        // Stop loading indicator regardless of outcome
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // =====================================================
  // Loading State UI
  // =====================================================
  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--cream)",
          color: "var(--text-muted)",
          fontStyle: "italic",
        }}
      >
        loading the vibe... 🌸
      </div>
    );

  // =====================================================
  // Error State UI
  // =====================================================
  if (error)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--cream)",
          color: "var(--text-muted)",
          fontStyle: "italic",
        }}
      >
        {error}
      </div>
    );

  // Extract result object from API response
  const result = data?.result;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--cream)",
        padding: "40px 20px",
      }}
    >

      {/* =====================================================
          Header Section
      ===================================================== */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <p style={{ fontSize: 28, marginBottom: 8 }}>🌸</p>

        <h1
          style={{
            fontSize: 22,
            fontWeight: 400,
            color: "var(--text)",
            marginBottom: 6,
          }}
        >
          someone made this for you
        </h1>

        <p
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            fontStyle: "italic",
          }}
        >
          via VibeMatch
        </p>
      </div>

      {/* =====================================================
          Main Content Container
      ===================================================== */}
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >

        {/* =====================================================
            Overall Vibe Section
        ===================================================== */}
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            background: "var(--rose-light)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--blush)",
          }}
        >
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--rose-dark)",
              marginBottom: 6,
            }}
          >
            your energy is
          </p>

          <p
            style={{
              fontSize: 22,
              fontStyle: "italic",
              color: "var(--text)",
            }}
          >
            {result?.overallVibe}
          </p>
        </div>

        {/* =====================================================
            Messages Section
        ===================================================== */}
        <div>
          <p
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
              marginBottom: 14,
            }}
          >
            a message for you
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {result?.messages?.map((msg, i) => (
              <div
                key={i}
                style={{
                  background: "var(--white)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "20px 22px",
                  borderLeft: "3px solid var(--rose)",
                }}
              >

                {/* Vibe label */}
                <p
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--rose-dark)",
                    marginBottom: 10,
                  }}
                >
                  {msg.emoji} {msg.vibe}
                </p>

                {/* Message text */}
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.75,
                    fontStyle: "italic",
                    color: "var(--text)",
                    marginBottom: 8,
                  }}
                >
                  "{msg.message}"
                </p>

                {/* Copy message button */}
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(msg.message)
                  }
                  style={{
                    fontSize: 11,
                    padding: "5px 14px",
                    borderRadius: 20,
                    background: "var(--rose-light)",
                    color: "var(--rose-dark)",
                    border: "1px solid var(--blush)",
                    fontWeight: 500,
                  }}
                >
                  copy
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* =====================================================
            Songs Section
        ===================================================== */}
        {result?.songVibes?.length > 0 && (
          <div>
            <p
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-muted)",
                marginBottom: 14,
              }}
            >
              songs picked for you 🎵
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {result.songVibes.map((song, i) => (
                <SongCard key={i} song={song} />
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            Call to Action Section
        ===================================================== */}
        <div
          style={{
            textAlign: "center",
            paddingTop: 16,
            borderTop: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              fontStyle: "italic",
              marginBottom: 12,
            }}
          >
            want to make one for someone? 🌸
          </p>

          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "9px 24px",
              borderRadius: 20,
              background: "var(--rose)",
              color: "white",
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            try VibeMatch
          </a>
        </div>
      </div>
    </div>
  );
}