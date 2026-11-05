import { toWesternDigits } from "@/lib/intake";

// Only this server route knows the CMS key; it is never included in browser code.
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  // Next may normalize request.url's hostname; Host is the visitor's actual site.
  let sameOrigin = origin === null;
  try {
    if (origin)
      sameOrigin = new URL(origin).host === request.headers.get("host");
  } catch {
    /* Malformed origins fail closed. */
  }
  if (!sameOrigin) return Response.json({ error: "invalid" }, { status: 403 });
  if (Number(request.headers.get("content-length")) > 262_144) {
    return Response.json({ error: "too_large" }, { status: 413 });
  }
  const cmsOrigin = process.env.CMS_API_ORIGIN;
  const key = process.env.CMS_INTAKE_API_KEY;
  if (!cmsOrigin || !key) {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  const text = (name: string) => String(data.get(name) ?? "").trim();
  // Until pending-document storage is connected, refuse files rather than lose them.
  if (
    data
      .getAll("documents")
      .some((file) => file instanceof File && file.size > 0)
  ) {
    return Response.json({ error: "documents_unavailable" }, { status: 422 });
  }
  if (text("website"))
    return Response.json({ error: "invalid" }, { status: 400 });
  for (const [name, value] of data) {
    if (
      typeof value === "string" &&
      value.length > (name === "matter" ? 4000 : 1000)
    ) {
      return Response.json({ error: "invalid" }, { status: 400 });
    }
  }
  const clientType = text("client-type");
  const engagements: Record<string, string> = {
    "single-case": "single_case",
    consultation: "consultation",
    retainer: "retainer",
  };
  const payments: Record<string, string> = {
    cash: "cash",
    "bank-transfer": "bank_transfer",
    cheque: "cheque",
  };
  const engagement = engagements[text("engagement")];
  const paymentMethod = payments[text("payment")];
  const practiceMap: Record<string, string> = {
    litigation: "litigation",
    arbitration: "arbitration",
    companies: "corporate",
    contracts: "contract",
  };
  const choices = data.getAll("practice").map(String);
  const practiceAreas = [...new Set(choices.map((area) => practiceMap[area]))];
  const email = text("email");
  const phone = toWesternDigits(text("phone"));
  const language = text("lang");
  const birthDate = text("birth-date");
  if (
    !["individual", "company"].includes(clientType) ||
    !engagement ||
    !paymentMethod ||
    !["ar", "en"].includes(language) ||
    (clientType === "individual" && !text("name-ar")) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !/^\+?[\d ()-]{7,30}$/.test(phone) ||
    (clientType === "individual" &&
      (!text("id-number") || !text("nationality"))) ||
    !text("matter") ||
    text("consent") !== "on" ||
    choices.length === 0 ||
    practiceAreas.some((area) => !area) ||
    (birthDate &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) ||
        !Number.isFinite(Date.parse(birthDate)) ||
        Date.parse(birthDate) >= Date.now())) ||
    (clientType === "company" && !text("company-ar") && !text("company-en"))
  ) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  try {
    const response = await fetch(
      new URL("/api/public/client-intake", cmsOrigin),
      {
        method: "POST",
        headers: { "content-type": "application/json", "X-Intake-Key": key },
        cache: "no-store",
        signal: AbortSignal.timeout(20_000),
        body: JSON.stringify({
          individual:
            clientType === "individual"
              ? {
                  nameAr: text("name-ar"),
                  nameEn: text("name-en") || null,
                  idNumber: toWesternDigits(text("id-number")),
                  nationality: text("nationality"),
                  dateOfBirth: birthDate || null,
                  occupation: text("occupation") || null,
                }
              : null,
          company:
            clientType === "company"
              ? {
                  nameAr: text("company-ar") || null,
                  nameEn: text("company-en") || null,
                  commercialRegistry:
                    toWesternDigits(text("registry-number")) || null,
                  address: text("company-address") || null,
                  primaryContact: text("primary-contact") || text("name-ar"),
                  businessActivity: text("business-activity") || null,
                  position: text("position") || null,
                  taxId: toWesternDigits(text("tax-id")) || null,
                }
              : null,
          engagement,
          practiceAreas,
          brief: text("matter"),
          paymentMethod,
          email,
          phone,
          language,
        }),
      },
    );
    if (!response.ok) {
      return Response.json(
        {
          error:
            response.status === 429
              ? "rate_limited"
              : response.status === 400
                ? "invalid"
                : "unavailable",
        },
        {
          status:
            response.status === 429 ? 429 : response.status === 400 ? 400 : 503,
        },
      );
    }
    const receipt: unknown = await response.json();
    if (
      !receipt ||
      typeof receipt !== "object" ||
      !("reference" in receipt) ||
      typeof receipt.reference !== "string" ||
      !receipt.reference
    ) {
      return Response.json({ error: "unavailable" }, { status: 502 });
    }
    return Response.json({ reference: receipt.reference }, { status: 202 });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }
}
