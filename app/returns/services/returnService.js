import {
  API_BASE_URL,
  testApiConnection,
  findWorkingApiUrl,
} from "../../../lib/api-config.js";

// Return API Service
class ReturnService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.workingUrl = null;
    console.log("🔧 ReturnService initialized with baseUrl:", this.baseUrl);
  }

  // Get working URL with fallback
  async getWorkingUrl() {
    if (this.workingUrl) {
      return this.workingUrl;
    }

    const result = await findWorkingApiUrl();
    if (result.success) {
      this.workingUrl = result.url;
      this.baseUrl = result.url;
      return result.url;
    }

    return this.baseUrl;
  }

  // Test backend connection
  async testConnection() {
    const result = await testApiConnection();
    return result.success;
  }

  // Get all returns with pagination and filtering
  async getReturns(page = 1, limit = 10, status = "") {
    try {
      const baseUrl = await this.getWorkingUrl();
      let url = `${baseUrl}/returns/admin/all?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          data: data.data || [],
          pagination: data.pagination || { totalPages: 1 },
        };
      } else {
        throw new Error(data.message || "Failed to load returns");
      }
    } catch (error) {
      console.error("❌ Error loading returns:", error);
      throw error;
    }
  }

  // Get return statistics
  async getStats() {
    try {
      const baseUrl = await this.getWorkingUrl();
      const response = await fetch(`${baseUrl}/returns/admin/all?limit=1000`);
      const data = await response.json();

      if (data.success) {
        const allReturns = data.data || [];
        const stats = {
          total: allReturns.length,
          pending: allReturns.filter((r) => r.returnStatus === "requested")
            .length,
          approved: allReturns.filter((r) => r.returnStatus === "approved")
            .length,
          rejected: allReturns.filter((r) => r.returnStatus === "rejected")
            .length,
          picked_up: allReturns.filter((r) => r.returnStatus === "picked_up")
            .length,
          processing: allReturns.filter((r) => r.returnStatus === "processing")
            .length,
          refunded: allReturns.filter((r) => r.returnStatus === "refunded")
            .length,
          cancelled: allReturns.filter((r) => r.returnStatus === "cancelled")
            .length,
          totalAmount: allReturns.reduce(
            (sum, r) => sum + (r.returnAmount || 0),
            0
          ),
        };
        return { success: true, data: stats };
      } else {
        throw new Error(data.message || "Failed to load stats");
      }
    } catch (error) {
      console.error("❌ Error loading stats:", error);
      throw error;
    }
  }

  // Update return status
  async updateStatus(returnId, status, adminNotes = "", previousStatus = "") {
    try {
      const apiUrl = `${this.baseUrl}/returns/${returnId}/status`;

      const requestBody = {
        status,
        adminNotes:
          adminNotes ||
          `Status changed from ${previousStatus} to ${status} by admin`,
        previousStatus,
        timestamp: new Date().toISOString(),
        returnId,
      };

      console.log("🚀 Making API request:", {
        url: apiUrl,
        method: "PUT",
        body: requestBody,
      });

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 API Response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: apiUrl,
      });

      let data;
      try {
        data = await response.json();
        console.log("📦 Response Data:", data);
      } catch (parseError) {
        console.error("❌ Failed to parse response JSON:", parseError);
        throw new Error(
          `Server returned invalid JSON. Status: ${response.status} ${response.statusText}`
        );
      }

      if (response.ok && data.success) {
        return {
          success: true,
          data: data.data,
          message: data.message,
        };
      } else {
        const errorMessage =
          data.message || `Failed to update status to ${status}`;
        console.error("❌ API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          errorMessage,
          fullResponse: data,
        });
        throw new Error(`${errorMessage} (HTTP ${response.status})`);
      }
    } catch (error) {
      console.error("❌ Error updating return status:", error);
      throw error;
    }
  }

  // Bulk update status
  async bulkUpdateStatus(returnIds, status) {
    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const returnId of returnIds) {
      try {
        await this.updateStatus(returnId, status);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({ returnId, error: error.message });
      }
    }

    return results;
  }
}

export default new ReturnService();
