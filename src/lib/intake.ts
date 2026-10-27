// The Client intake form's choices and sections (client-intake-form.tsx),
// from the firm's old intake form. Nothing is sent yet.

export type IntakeOption = { value: string; title: string; description?: string };

export const CLIENT_TYPES: IntakeOption[] = [
  { value: "individual", title: "As an individual", description: "For a personal matter." },
  { value: "company", title: "On behalf of a company", description: "For a business you represent." },
];

export const ENGAGEMENTS: IntakeOption[] = [
  { value: "single-case", title: "Single case", description: "One legal matter." },
  { value: "retainer", title: "Retainer", description: "Ongoing legal support." },
  { value: "consultation", title: "Consultation", description: "One-time legal advice." },
];

export const PRACTICE_AREAS: IntakeOption[] = [
  { value: "litigation", title: "Litigation" },
  { value: "arbitration", title: "Arbitration" },
  { value: "companies", title: "Companies" },
  { value: "contracts", title: "Contracts" },
];

export const PAYMENT_METHODS: IntakeOption[] = [
  { value: "cash", title: "Cash", description: "Paid at our office." },
  { value: "bank-transfer", title: "Bank transfer", description: "Paid against an invoice." },
  { value: "cheque", title: "Cheque", description: "Made out to the firm." },
];

export const INTAKE_SECTIONS = [
  {
    id: "intake-personal",
    title: "Personal information",
    text: "As on your national ID or passport, so we can run a conflict check before we speak.",
  },
  {
    id: "intake-company",
    title: "Company information",
    text: "Whether you’re coming to us yourself or for a business.",
  },
  {
    id: "intake-engagement",
    title: "Type of engagement",
    text: "How you’d like to work with us. We can change this together later.",
  },
  {
    id: "intake-practice",
    title: "Practice area",
    text: "Choose every area your matter touches.",
  },
  {
    id: "intake-matter",
    title: "About the matter",
    text: "What happened, who is involved and any dates or deadlines. Attach documents if you have them.",
  },
  {
    id: "intake-payment",
    title: "Fees & payment",
    text: "How you’d prefer to pay. Fees are agreed in your engagement letter.",
  },
] as const;

export type IntakeSectionId = (typeof INTAKE_SECTIONS)[number]["id"];

export const INTAKE_NEXT_STEPS = [
  { title: "Review", text: "A partner reads your request and checks it for conflicts of interest." },
  { title: "Call", text: "We call you within two working days to talk the matter through." },
  {
    title: "Engagement letter",
    text: "If we take the matter on, you receive a letter setting out its scope and fees.",
  },
];
