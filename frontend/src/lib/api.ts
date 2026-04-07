const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface DetectionData {
  object: string;
  distance: number;
  confidence: number;
}

export interface AlertResponse {
  alert: "SAFE" | "WARNING" | "DANGER";
}

export const fetchCurrentAlert = async (): Promise<AlertResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/alert`);
    if (!response.ok) throw new Error("Failed to fetch alert");
    return await response.json();
  } catch (error) {
    console.error("Error fetching alert:", error);
    return { alert: "SAFE" }; // Default to safe on error
  }
};

export const postDetection = async (data: DetectionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/detect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error posting detection:", error);
    throw error;
  }
};
