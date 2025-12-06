import { GoogleGenAI } from "@google/genai";
import { Product, Sale, Brand, SaleItem, StoreProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDashboardInsights = async (
  products: Product[],
  sales: Sale[],
  brands: Brand[]
): Promise<string> => {
  if (!process.env.API_KEY) return "API Key not configured. Unable to generate AI insights.";

  const lowStockItems = products.filter(p => p.stock < 10).map(p => `${p.name} (${p.brandId}) - Stock: ${p.stock}`);
  const salesSummary = sales.slice(-10).map(s => `Total: $${s.totalAmount}`).join(", ");
  const topBrands = brands.map(b => b.name).join(", ");

  const prompt = `
    You are a retail inventory analyst. Analyze the following data snapshot:
    - Active Brands: ${topBrands}
    - Recent Sales Values: ${salesSummary}
    - Low Stock Alerts: ${lowStockItems.join('; ')}

    Provide a concise 3-bullet point executive summary for the store manager.
    Focus on reorder urgency, sales momentum, and a general operational tip.
    Keep it professional and brief.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to generate insights at this time.";
  }
};

export const generateSettlementEmail = async (
  brandName: string,
  totalSales: number,
  commission: number,
  netPayout: number,
  date: string,
  items: SaleItem[],
  commissionRate: number,
  storeProfile: StoreProfile
): Promise<string> => {
  if (!process.env.API_KEY) return "API Key missing.";

  // Prepare item data for the model to group
  const itemsData = items.map(i => `Product: ${i.productName} - ${i.size} | Qty: ${i.quantity} | Price: ${i.sellingPrice}`).join('\n');

  const prompt = `
    Generate a formal Invoice strictly following the template below. 
    Use the provided data to fill in the [brackets].
    
    Data Provided:
    - Brand Name: ${brandName}
    - Date: ${date}
    - Items List: 
    ${itemsData}
    - Total Sales: ${totalSales}
    - Commission Rate: ${commissionRate}%
    - Commission Amount: ${commission}
    - Net Payout: ${netPayout}
    
    Store Details:
    - Name: ${storeProfile.name}
    - Address: ${storeProfile.address}
    - Phone: ${storeProfile.phone}
    - Email: ${storeProfile.email}
    - GST: ${storeProfile.gst}

    Instructions:
    1. Group identical items (Same Name and Size) in the table and sum their Quantity and Amount.
    2. Output EXACTLY in the format below. Do not add conversational text like "Here is your invoice".
    3. Use Markdown for the Table.

    TEMPLATE STARTS HERE:

    ${storeProfile.name}
    ${storeProfile.address}
    Phone: ${storeProfile.phone}
    GST: ${storeProfile.gst}
    Email: ${storeProfile.email} ↗

    ***

    INVOICE

    To: ${brandName}
    Date: ${date}

    ***

    Item Details

    | Description | Price | Qty | Amount |
    | :--- | :--- | :--- | :--- |
    [Generate Rows Here based on Items List]

    ***

    Summary

    Total: ${totalSales}/-
    Commission (${commissionRate}%): ${commission}/-
    Payout: ${netPayout}/-

    ***

    Notes

    This is a system-generated invoice and does not require a physical signature.

    Store Admin
    ${storeProfile.name}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Draft generation failed.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating invoice draft.";
  }
};