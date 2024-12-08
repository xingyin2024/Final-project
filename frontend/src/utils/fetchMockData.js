export const fetchMockData = async (key) => {
  try {
    const response = await fetch(`/${key}.json`); // Fetch JSON from public folder
    return await response.json();
  } catch (error) {
    console.error("Error fetching mock data:", error);
    return [];
  }
};
