// Simple API health check utility
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const checkAPIHealth = async () => {
  try {
    console.log("Checking API health at:", API_URL);

    const response = await fetch(`${API_URL}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("API Health Check Response Status:", response.status);
    console.log("API Health Check Response Headers:", response.headers);

    const contentType = response.headers.get("content-type");
    console.log("Content-Type:", contentType);

    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("Non-JSON response from API health check:", textResponse);
      return {
        success: false,
        error:
          "API server is not responding with JSON. It might be down or misconfigured.",
        response: textResponse,
      };
    }

    const result = await response.json();
    console.log("API Health Check Result:", result);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("API Health Check Error:", error);
    return {
      success: false,
      error: error.message,
      details:
        "Cannot connect to API server. Please ensure it is running on port 3001.",
    };
  }
};

export default checkAPIHealth;
