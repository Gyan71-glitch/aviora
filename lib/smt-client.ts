/**
 * SMT (SourceMyTrip) API Client
 * Connects to the live SMT backend APIs hosted at smtapi.sourcemytrip.com.
 * Falls back gracefully to mock data if the APIs are unreachable.
 */

const SMT_AUTH_KEY = process.env.SMT_AUTH_KEY || "2540D49A-FCFE-4422-9C4B-FBF2DA50B0BE";
const SMT_COMPANY_CODE = process.env.SMT_COMPANY_CODE || "SMT";
const SMT_CHANNEL = process.env.SMT_CHANNEL || "B2C";

export const SMT_ENDPOINTS = {
  HOTEL: process.env.SMT_HOTEL_API || "https://smtapi.sourcemytrip.com/Live_HotelAPI",
  SIGHTSEEING: process.env.SMT_SIGHTSEEING_API || "https://smtapi.sourcemytrip.com/Live_SeightSeeing",
  TRANSFER: process.env.SMT_TRANSFER_API || "https://smtapi.sourcemytrip.com/Live_TransferAPI",
  PACKAGE: process.env.SMT_PACKAGE_API || "https://smtapi.sourcemytrip.com/Live_PackageAPI",
  UTILITY: process.env.SMT_UTILITY_API || "https://smtapi.sourcemytrip.com/Live_UtilityService",
  FLIGHT: process.env.SMT_FLIGHT_API || "https://smtapi.sourcemytrip.com/Live_FlightAPI",
};

/** Standard SMT Authentication block used in all requests */
export function smtAuth(serviceType: string) {
  return {
    AuthenticationKey: SMT_AUTH_KEY,
    Channel: SMT_CHANNEL,
    OnBehalfBooking: false,
    SubAgent: { Id: 0, UserId: 0, UserName: "", BranchId: 0, SaBranchId: 0 },
    CompanyId: SMT_COMPANY_CODE,
    ServiceType: serviceType,
  };
}

/** Standard SMT currency/locale block */
export function smtCurrencyBlock(currency = "INR") {
  return {
    Comp_Curr: currency,
    Agent_Curr: currency,
    Gross_Curr: currency,
    LangCode: "en",
    Agent_ROE: 0,
    Gross_ROE: 0,
    IP: "10.0.50.1",
    Mode: "system",
    UserAgent: "Mozilla/5.0",
    Nationality: "IN",
    NationalityName: "Indian",
  };
}

/** Make a POST request to SMT API with timeout */
export async function smtPost(
  url: string,
  body: object,
  timeoutMs = 15000
): Promise<{ data: any; ok: boolean; error?: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      return { ok: false, data: null, error: `HTTP ${res.status}` };
    }

    const text = await res.text();
    if (!text || text.trim() === "") {
      return { ok: false, data: null, error: "Empty response from SMT API" };
    }

    const data = JSON.parse(text);
    return { ok: true, data };
  } catch (err: any) {
    clearTimeout(timer);
    const msg = err?.name === "AbortError" ? "SMT API timeout" : err?.message || "SMT API error";
    return { ok: false, data: null, error: msg };
  }
}

/** Make a GET request to SMT Utility API with timeout */
export async function smtGet(
  url: string,
  timeoutMs = 10000
): Promise<{ data: any; ok: boolean; error?: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      return { ok: false, data: null, error: `HTTP ${res.status}` };
    }

    const text = await res.text();
    if (!text || text.trim() === "") {
      return { ok: false, data: null, error: "Empty response from SMT API" };
    }

    const data = JSON.parse(text);
    return { ok: true, data };
  } catch (err: any) {
    clearTimeout(timer);
    const msg = err?.name === "AbortError" ? "SMT API timeout" : err?.message || "SMT API error";
    return { ok: false, data: null, error: msg };
  }
}

/** Log SMT API result status */
export function logSmtResult(service: string, ok: boolean, error?: string) {
  if (ok) {
    console.log(`[SMT ${service}] ✅ Live data fetched`);
  } else {
    console.warn(`[SMT ${service}] ⚠️ Falling back to mock data. Reason: ${error}`);
  }
}
