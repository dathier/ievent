export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const url = `${baseUrl}/api${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `API call failed: ${response.status} ${response.statusText}`
      );
      console.error(`Endpoint: ${url}`);
      const errorBody = await response.text();
      console.error(`Response body: ${errorBody}`);
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
