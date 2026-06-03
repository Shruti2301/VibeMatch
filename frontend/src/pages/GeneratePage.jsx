// =====================================================
// Author: Shruti Mandaokar
// Page: GeneratePage
//
// Purpose:
// Main UI page for VibeMatch application.
//
// Flow:
// 1. User fills out a form describing a person
// 2. Data is sent to backend AI (/api/generate)
// 3. AI returns:
//    - Opening messages
//    - Song recommendations
//    - Overall vibe
// 4. Results are rendered in a structured UI
// =====================================================

import { useState } from "react";

// Reusable UI components
import TagChips from "../components/TagChips.jsx";
import MessageCard from "../components/MessageCard.jsx";
import SongCard from "../components/SongCard.jsx";

export default function GeneratePage() {

  // =====================================================
  // Form State
  //
  // Stores all user inputs for vibe generation
  // =====================================================
  const [form, setForm] = useState({
    name: "",                 // Person's name
    description: "",          // Main description (required input)
    interests: "",            // Extra context / shared interests
    connectionType: "romantic", // romantic or friendship
    profileLink: "",          // Optional profile URL
    tags: [],                 // Selected vibe tags
  });

  // Loading state while waiting for AI response
  const [loading, setLoading] = useState(false);

  // Stores generated AI result
  const [result, setResult] = useState(null);

  // Stores validation or API error messages
  const [error, setError] = useState("");

  // =====================================================
  // Generic form field updater
  //
  // Usage:
  // onChange={set("name")}
  // onChange={set("description")}
  // =====================================================
  const set = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target.value,
    }));

  // Update selected tags from TagChips component
  const setTags = (tags) =>
    setForm((f) => ({
      ...f,
      tags,
    }));

  // =====================================================
  // Generate AI response
  //
  // Steps:
  // 1. Validate required fields
  // 2. Call backend API
  // 3. Parse response
  // 4. Store result
  // 5. Scroll to results section
  // =====================================================
  const generate = async () => {

    // Validate required input
    if (!form.description.trim()) {
      setError("Tell me a little about them first 🌸");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {

      // Call backend AI generation endpoint
      const res = await fetch("/api/generate", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });

      const raw = await res.text();
      let data;
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(
          "Can't reach the backend — make sure it's running on port 3001 🌸"
        );
      }

      // Handle API errors
      if (!res.ok) throw new Error(data.error || "Something went wrong 🌸");

      // Save generated result
      setResult(data);

      // Smooth scroll to results section after rendering
      setTimeout(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);

    } catch (e) {

      // Show user-friendly error message
      setError(e.message || "Something went wrong. Try again 🌸");

    } finally {

      // Stop loading state regardless of success/failure
      setLoading(false);
    }
  };

  // Shareable URL for generated vibe
  const shareUrl = result?.id
    ? `${window.location.origin}/share/${result.id}`
    : window.location.origin;

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
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <p style={{ fontSize: 28, marginBottom: 8 }}>🌸</p>

        <h1
          style={{
            fontSize: 28,
            fontWeight: 400,
            letterSpacing: "-0.5px",
            color: "var(--text)",
            marginBottom: 8,
          }}
        >
          VibeMatch
        </h1>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 14,
            fontStyle: "italic",
          }}
        >
          describe someone — get the perfect message + songs to send them
        </p>
      </div>

      {/* =====================================================
          Form Card Container
      ===================================================== */}
      <div
        style={{
          maxWidth: 560,
          margin: "0 auto",
          background: "var(--white)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "28px 32px",
          boxShadow: "var(--shadow)",
        }}
      >

        {/* =====================================================
            Connection Type Toggle
        ===================================================== */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
            background: "var(--cream)",
            padding: 4,
            borderRadius: 12,
          }}
        >
          {["romantic", "friendship"].map((type) => (
            <button
              key={type}
              onClick={() =>
                setForm((f) => ({ ...f, connectionType: type }))
              }
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,

                background:
                  form.connectionType === type
                    ? "var(--white)"
                    : "transparent",

                color:
                  form.connectionType === type
                    ? "var(--rose-dark)"
                    : "var(--text-muted)",

                border:
                  form.connectionType === type
                    ? "1px solid var(--blush)"
                    : "none",

                boxShadow:
                  form.connectionType === type
                    ? "var(--shadow)"
                    : "none",
              }}
            >
              {type === "romantic"
                ? "💕 romantic"
                : "🤝 friendship"}
            </button>
          ))}
        </div>

        {/* =====================================================
            Input: Name
        ===================================================== */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>their name</label>
          <input
            placeholder="Alex..."
            value={form.name}
            onChange={set("name")}
          />
        </div>

        {/* =====================================================
            Input: Description (Required)
        ===================================================== */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>tell me about them *</label>
          <textarea
            placeholder="They make the best playlists..."
            value={form.description}
            onChange={set("description")}
          />
        </div>

        {/* =====================================================
            Tag Selection Component
        ===================================================== */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>their vibe</label>
          <TagChips selected={form.tags} onChange={setTags} />
        </div>

        {/* =====================================================
            Profile Link (Optional)
        ===================================================== */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>profile link (optional)</label>
          <input
            placeholder="https://instagram.com/..."
            value={form.profileLink}
            onChange={set("profileLink")}
          />
        </div>

        {/* =====================================================
            Extra Context Input
        ===================================================== */}
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>anything else? (optional)</label>
          <input
            placeholder="shared love for rainy days..."
            value={form.interests}
            onChange={set("interests")}
          />
        </div>

        {/* Error message display */}
        {error && <p style={errorStyle}>{error}</p>}

        {/* =====================================================
            Generate Button
        ===================================================== */}
        <button onClick={generate} disabled={loading} style={buttonStyle}>
          {loading
            ? "reading the vibe... 🌸"
            : "generate messages + songs ✨"}
        </button>
      </div>

      {/* =====================================================
          Results Section
      ===================================================== */}
      {result && (
        <div
          id="results"
          style={{
            maxWidth: 560,
            margin: "40px auto 0",
            display: "flex",
            flexDirection: "column",
            gap: 32,
          }}
        >

          {/* Overall vibe display */}
          <div style={vibeBannerStyle}>
            <p style={vibeLabelStyle}>their energy is</p>
            <p style={vibeTextStyle}>{result.overallVibe}</p>
          </div>

          {/* Messages Section */}
          <div>
            <p style={sectionLabel}>opening messages</p>
            <div style={stack}>
              {result.messages?.map((msg, i) => (
                <MessageCard key={i} msg={msg} shareUrl={shareUrl} />
              ))}
            </div>
          </div>

          {/* Songs Section */}
          <div>
            <p style={sectionLabel}>songs to send their way 🎵</p>
            <div style={stack}>
              {result.songVibes?.map((song, i) => (
                <SongCard key={i} song={song} />
              ))}
            </div>
          </div>

          {/* Share Section */}
          {result.id && (
            <div style={shareBox}>
              <p style={shareText}>
                share this whole vibe with someone 🔗
              </p>

              <p style={shareUrlStyle}>{shareUrl}</p>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(shareUrl)
                }
                style={smallButton}
              >
                copy share link
              </button>
            </div>
          )}

          {/* Reset button */}
          <button
            onClick={() => {
              setResult(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={resetButton}
          >
            try someone else 🌸
          </button>
        </div>
      )}
    </div>
  );
}

// =====================================================
// Reusable styles (kept conceptually clean)
// =====================================================
const labelStyle = {
  fontSize: 12,
  fontWeight: 500,
  color: "var(--text-muted)",
  display: "block",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const errorStyle = {
  fontSize: 13,
  color: "var(--rose)",
  marginBottom: 16,
  fontStyle: "italic",
};

const buttonStyle = {
  width: "100%",
  padding: "13px 0",
  borderRadius: 12,
  background: "var(--rose)",
  color: "white",
  fontSize: 15,
  fontWeight: 500,
};

const vibeBannerStyle = {
  textAlign: "center",
  padding: "20px",
  background: "var(--rose-light)",
  borderRadius: "var(--radius)",
  border: "1px solid var(--blush)",
};

const vibeLabelStyle = {
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--rose-dark)",
  marginBottom: 6,
};

const vibeTextStyle = {
  fontSize: 22,
  fontWeight: 400,
  fontStyle: "italic",
};

const sectionLabel = {
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--text-muted)",
  marginBottom: 14,
};

const stack = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const shareBox = {
  textAlign: "center",
  padding: "16px",
  background: "var(--cream-dark)",
  borderRadius: "var(--radius)",
  border: "1px solid var(--border)",
};

const shareText = {
  fontSize: 12,
  color: "var(--text-muted)",
  marginBottom: 8,
  fontStyle: "italic",
};

const shareUrlStyle = {
  fontSize: 12,
  color: "var(--rose-dark)",
  wordBreak: "break-all",
  marginBottom: 12,
};

const smallButton = {
  padding: "7px 20px",
  borderRadius: 20,
  background: "var(--rose)",
  color: "white",
  fontSize: 12,
  fontWeight: 500,
};

const resetButton = {
  padding: "10px 0",
  borderRadius: 12,
  background: "transparent",
  color: "var(--text-muted)",
  fontSize: 13,
  border: "1px solid var(--border)",
  fontStyle: "italic",
};