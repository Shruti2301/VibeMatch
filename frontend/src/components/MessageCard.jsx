// =====================================================
// Author: Shruti Mandaokar
// Component: MessageCard
//
// Purpose:
// Displays a generated message card with:
// - Vibe-specific styling
// - Copy message functionality
// - Share link functionality
// - Native browser/device sharing support
// =====================================================

import { useState } from "react";

// Vibe-based color themes used to style each message card
const VIBE_STYLES = {
  warm: {
    bg: "#FDF0F1",
    border: "#EEC8CC",
    text: "#8B4A52",
    label: "warm",
  },
  witty: {
    bg: "#F5F0FD",
    border: "#D8C8EE",
    text: "#5A4A8B",
    label: "witty",
  },
  curious: {
    bg: "#F0F5F0",
    border: "#C8DEC8",
    text: "#3A6B3A",
    label: "curious",
  },
};

// =====================================================
// MessageCard Component
//
// Props:
// msg      -> Generated message object
// shareUrl -> Unique shareable URL
//
// Example:
// {
//   vibe: "warm",
//   emoji: "🌸",
//   message: "Hello there...",
//   why: "Creates a genuine first impression."
// }
// =====================================================
export default function MessageCard({ msg, shareUrl }) {

  // Tracks whether the message was copied
  const [copied, setCopied] = useState(false);

  // Tracks whether the share link was copied
  const [sharedLink, setSharedLink] = useState(false);

  // Select style based on message vibe
  // Fallback to warm theme if vibe doesn't exist
  const style = VIBE_STYLES[msg.vibe] || VIBE_STYLES.warm;

  // =====================================================
  // Copy generated message to clipboard
  // =====================================================
  const copyMessage = () => {

    // Copy text to clipboard
    navigator.clipboard.writeText(msg.message);

    // Show success state
    setCopied(true);

    // Reset button text after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  // =====================================================
  // Copy shareable link to clipboard
  // =====================================================
  const copyLink = () => {

    // Copy URL to clipboard
    navigator.clipboard.writeText(shareUrl);

    // Show success state
    setSharedLink(true);

    // Reset after 2 seconds
    setTimeout(() => setSharedLink(false), 2000);
  };

  // =====================================================
  // Native Share API
  //
  // If supported:
  // Opens mobile/browser share sheet
  //
  // Otherwise:
  // Copies the link automatically
  // =====================================================
  const shareNative = () => {
    if (navigator.share) {

      navigator.share({
        title: "A message for you 🌸",
        text: msg.message,
        url: shareUrl,
      });

    } else {

      // Fallback for unsupported browsers
      copyLink();
    }
  };

  return (
    <div
      style={{
        // Card background color based on vibe
        background: style.bg,

        // Card border
        border: `1px solid ${style.border}`,

        // Rounded corners
        borderRadius: "var(--radius)",

        // Internal spacing
        padding: "20px 22px",

        // Left accent border for visual identity
        borderLeft: `3px solid ${style.text}`,
      }}
    >

      {/* ==========================================
          Vibe Badge
          Displays vibe emoji and label
      ========================================== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 12px",
            borderRadius: 20,

            background: "white",
            color: style.text,

            border: `1px solid ${style.border}`,

            // Display badge text in uppercase
            textTransform: "uppercase",

            // Increase spacing between letters
            letterSpacing: "0.08em",
          }}
        >
          {msg.emoji} {style.label}
        </span>
      </div>

      {/* ==========================================
          Generated Message
      ========================================== */}
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.75,
          color: "var(--text)",
          marginBottom: 12,

          // Display message as a quote
          fontStyle: "italic",
        }}
      >
        "{msg.message}"
      </p>

      {/* ==========================================
          Explanation
          Why this generated message works
      ========================================== */}
      <p
        style={{
          fontSize: 12,
          color: "var(--text-muted)",
          marginBottom: 16,
        }}
      >
        {msg.why}
      </p>

      {/* ==========================================
          Action Buttons
      ========================================== */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >

        {/* Copy Message Button */}
        <button
          onClick={copyMessage}
          style={{
            fontSize: 12,
            padding: "6px 16px",
            borderRadius: 20,

            // Change appearance after successful copy
            background: copied
              ? "var(--rose)"
              : "white",

            color: copied
              ? "white"
              : "var(--rose-dark)",

            border: "1px solid var(--blush)",
            fontWeight: 500,
          }}
        >
          {copied
            ? "✓ copied!"
            : "copy message"}
        </button>

        {/* Share Button */}
        <button
          onClick={shareNative}
          style={{
            fontSize: 12,
            padding: "6px 16px",
            borderRadius: 20,

            // Visual success state after copying link
            background: sharedLink
              ? "var(--rose)"
              : "white",

            color: sharedLink
              ? "white"
              : "var(--text-muted)",

            border: "1px solid var(--border)",
            fontWeight: 500,
          }}
        >
          {sharedLink
            ? "✓ link copied!"
            : "share link 🔗"}
        </button>

      </div>
    </div>
  );
}