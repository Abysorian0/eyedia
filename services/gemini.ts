// Client-side service to interact with secure Netlify Functions
// API key is now safely stored server-side

export async function enhanceIdea(content: string) {
  try {
    const response = await fetch('/.netlify/functions/gemini-enhance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      console.error('Enhancement API error:', response.status);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("AI Enhancement failed:", error);
    return null;
  }
}

export async function searchWeb(query: string) {
  try {
    const response = await fetch('/.netlify/functions/gemini-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      console.error('Search API error:', response.status);
      return { text: 'Search failed. Please try again.', sources: [] };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Web Search failed:", error);
    return { text: 'Network error. Please check your connection.', sources: [] };
  }
}
