
export async function enhanceIdea(content: string) {
  try {
    const response = await fetch('/.netlify/functions/gemini', {
      method: 'POST',
      body: JSON.stringify({ action: 'enhance', payload: { content } }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("AI Enhancement failed:", error);
    return null;
  }
}

export async function searchWeb(query: string) {
  try {
    const response = await fetch('/.netlify/functions/gemini', {
      method: 'POST',
      body: JSON.stringify({ action: 'search', payload: { query } }),
    });

    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Web Search failed:", error);
    return null;
  }
}
