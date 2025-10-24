// API Configuration with multiple fallback URLs
const FALLBACK_URLS = [
  process.env.NODE_ENV === "production"
    ? "https://e-commerce-backend-ochre-eight.vercel.app/"
    : "http://localhost:3001/",
];
export const getApiUrl = () => {
  // Check if we're in browser environment
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || FALLBACK_URLS[0];
  }

  // Get current hostname
  const hostname = window.location.hostname;

  // If running on localhost, use local API
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return process.env.NEXT_PUBLIC_API_URL || FALLBACK_URLS[0];
  }

  // For deployed environments, try to construct API URL
  // Option 1: Use environment variable if available
  if (
    process.env.NEXT_PUBLIC_API_URL &&
    process.env.NEXT_PUBLIC_API_URL !== "https://your-backend-domain.com"
  ) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Option 2: Try common backend URL patterns
  const protocol = window.location.protocol;

  // Common deployment patterns
  const possibleUrls = [
    `${protocol}//${hostname}:3001`, // Same domain, different port
    `${protocol}//api.${hostname}`, // API subdomain
    `${protocol}//${hostname.replace("www.", "api.")}`, // Replace www with api
    `${protocol}//${hostname}/api`, // API path on same domain
  ];

  return possibleUrls[0]; // Default to same domain with port 3001
};

// Test multiple URLs to find working one
export const findWorkingApiUrl = async () => {
  const urlsToTest = [getApiUrl(), ...FALLBACK_URLS];

  for (const url of urlsToTest) {
    try {
      console.log(`🔍 Testing API URL: ${url}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${url}/health`, {
        signal: controller.signal,
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Found working API URL: ${url}`, data);
        return { success: true, url, data };
      }
    } catch (error) {
      console.log(`❌ Failed to connect to ${url}:`, error.message);
      continue;
    }
  }

  console.error("❌ No working API URL found");
  return {
    success: false,
    url: getApiUrl(),
    error: "No working API URL found",
  };
};

export let API_BASE_URL = getApiUrl();

// Test API connection with fallback
export const testApiConnection = async () => {
  const result = await findWorkingApiUrl();
  if (result.success) {
    API_BASE_URL = result.url;
  }
  return result;
};
