// Author: Shruti Mandaokar
// Tag chips component — clickable interest tags

const ALL_TAGS = [
    { label: "📚 books", value: "books" },
    { label: "🎵 music", value: "music" },
    { label: "🌿 outdoors", value: "outdoors" },
    { label: "☕ coffee", value: "coffee" },
    { label: "🎨 art", value: "art" },
    { label: "🎬 films", value: "films" },
    { label: "✈️ travel", value: "travel" },
    { label: "🍕 food", value: "food" },
    { label: "🧘 wellness", value: "wellness" },
    { label: "🐾 animals", value: "animals" },
    { label: "🎮 gaming", value: "gaming" },
    { label: "📸 photography", value: "photography" },
    { label: "🌙 night owl", value: "night owl" },
    { label: "🌅 early bird", value: "early bird" },
    { label: "💃 dancing", value: "dancing" },
    { label: "🏃 running", value: "running" },
  ];
  
  export default function TagChips({ selected, onChange }) {
    const toggle = (value) => {
      if (selected.includes(value)) {
        onChange(selected.filter((t) => t !== value));
      } else {
        onChange([...selected, value]);
      }
    };
  
    return (
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
      }}>
        {ALL_TAGS.map((tag) => {
          const isSelected = selected.includes(tag.value);
          return (
            <button
              key={tag.value}
              onClick={() => toggle(tag.value)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 13,
                border: `1px solid ${isSelected ? "var(--rose)" : "var(--border)"}`,
                background: isSelected ? "var(--rose-light)" : "var(--white)",
                color: isSelected ? "var(--rose-dark)" : "var(--text-muted)",
                fontWeight: isSelected ? 500 : 400,
                transition: "all 0.15s",
              }}
            >
              {tag.label}
            </button>
          );
        })}
      </div>
    );
  }