// Import the page where users generate new vibe matches
import GeneratePage from "./pages/GeneratePage.jsx";

// Import the page used for viewing a shared vibe result
import SharePage from "./pages/SharePage.jsx";

export default function App() {
  // Get the current URL path from the browser
  // Example:
  // "/" → home page
  // "/share/123" → shared result page
  const path = window.location.pathname;

  // Check whether the URL matches the pattern:
  // /share/:id
  //
  // Examples:
  // "/share/123"     → match
  // "/share/abc123"  → match
  // "/"              → no match
  const shareMatch = path.match(/^\/share\/(.+)$/);

  // If the URL contains a share ID,
  // render the SharePage component
  if (shareMatch) {
    return (
      <SharePage
        // Extract the ID from the URL
        // Example: "/share/123" → id = "123"
        id={shareMatch[1]}
      />
    );
  }

  // Default route:
  // Show the vibe generation page
  return <GeneratePage />;
}