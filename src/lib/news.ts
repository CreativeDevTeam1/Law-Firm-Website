export type Article = {
  /** The article's page: /news/{slug}. */
  slug: string;
  /** Shown as written, e.g. "16 May 2026". */
  date: string;
  /** The short title on cards. */
  title: string;
  /** The full title at the top of the article's page. */
  headline: string;
  image: string;
  body: string[];
};

const IMAGES = [
  "/images/home-page/news/cinematic-boardroom.png",
  "/images/home-page/news/cinematic-contract-review.png",
  "/images/home-page/news/cinematic-hearing-room.png",
  "/images/home-page/news/cinematic-new-cairo.png",
];

const PLACEHOLDER_PARAGRAPH =
  "Providing comprehensive legal services across a broad spectrum of practice areas, Shady El-Barkoky Law Firm serves individuals, corporations, investors, entrepreneurs, and institutions with dedication, professionalism, and strategic legal insight.";

const SAMPLE_ARTICLES = [
  {
    date: "21 October 2026",
    title: "Building stronger commercial agreements from the outset",
    headline: "Building stronger commercial agreements: the questions businesses should address from the outset",
    body: [
      "A strong commercial agreement does more than record a deal. It gives the parties a shared understanding of their responsibilities, allocates risk, and provides a practical route forward when circumstances change. The most effective drafting therefore begins before the first clause is written, with a clear view of the transaction and the result each party expects to achieve.",
      "The commercial fundamentals should be settled first: what will be delivered, when performance is due, how payment will work, and which conditions must be satisfied. Definitions, schedules, and technical specifications deserve particular attention because uncertainty in these areas can affect every provision that follows.",
      "Risk should then be allocated deliberately. Liability, indemnity, confidentiality, intellectual property, regulatory responsibility, and termination rights should reflect the realities of the relationship rather than standard wording carried over from another transaction. A provision may be legally familiar yet commercially unsuitable for the matter at hand.",
      "The agreement should also anticipate change. Price adjustments, delays, approvals, changes in scope, and events outside either party’s control are easier to manage when the contract establishes a clear process for notice, discussion, escalation, and documentation.",
      "Finally, dispute provisions should be considered as part of the commercial structure, not as an afterthought. The appropriate governing law, forum, escalation process, and interim protections depend on the parties, the assets involved, and where enforcement may eventually be required. Early legal review helps turn agreed business terms into a document that is clear, workable, and capable of protecting the relationship.",
      "This article provides general information only and does not constitute legal advice. Advice should be obtained in relation to the facts and requirements of each transaction.",
    ],
  },
  {
    date: "8 October 2026",
    title: "A practical approach to resolving business disputes",
    headline: "From negotiation to proceedings: a practical approach to resolving business disputes",
    body: [
      "A business dispute rarely begins at the moment a claim is filed. It usually develops through missed obligations, conflicting interpretations, delayed communication, or a gradual loss of trust. The decisions made during this early period can shape the cost, duration, and eventual outcome of the matter.",
      "The first step is to establish the facts. Contracts, correspondence, approvals, payment records, meeting notes, and internal decisions should be collected and reviewed before positions become fixed. This process helps identify the legal issues, the available evidence, and the points on which the parties may still be able to agree.",
      "A sound strategy should account for more than the legal merits. Management time, cash flow, reputation, ongoing commercial relationships, confidentiality, and the practical ability to enforce an outcome may all influence the preferred route. A technically strong claim may still require a measured commercial approach.",
      "Negotiation and structured escalation can preserve value when used at the right time. A focused proposal, supported by evidence and a clear assessment of risk, is often more effective than broad demands. Where direct discussions are insufficient, mediation or another facilitated process may help the parties test possible solutions without surrendering their legal positions.",
      "If formal proceedings become necessary, early preparation remains essential. The forum, procedural timetable, preservation of evidence, interim measures, and enforcement strategy should be considered together. The objective is not simply to begin a case, but to choose a route proportionate to the dispute and aligned with the client’s wider priorities.",
      "This article provides general information only and does not constitute legal advice. The appropriate strategy will depend on the agreement, evidence, parties, and circumstances involved.",
    ],
  },
  {
    date: "24 September 2026",
    title: "What investors should consider before entering a new market",
    headline: "Legal structure, risk, and regulation: what investors should consider before entering a new market",
    body: [
      "Entering a new market is both a commercial decision and a legal project. The choice of structure, local partners, licences, financing, employment model, and contractual framework can affect how quickly the investment begins operating and how effectively it can respond to future change.",
      "The proposed business model should be tested against the regulatory environment at an early stage. Investors need to understand which activities require approval, which restrictions may affect ownership or management, and which authorities will oversee operations. Timelines should reflect the practical sequence of registrations, permits, and sector-specific requirements.",
      "The investment structure should support the intended commercial outcome. Governance rights, funding obligations, profit distribution, reserved matters, transfer restrictions, and exit mechanisms require careful alignment, particularly where the investment involves local shareholders or a joint venture.",
      "Due diligence should focus on issues capable of changing value or feasibility. Corporate records, material contracts, assets, employment arrangements, disputes, regulatory history, data practices, and intellectual property may each reveal obligations that must be resolved, priced, or addressed through contractual protection.",
      "Implementation is as important as entry. Reporting lines, delegated authorities, compliance procedures, template agreements, and processes for engaging employees, suppliers, and customers help translate the legal structure into daily operations. Planning these elements early allows the investment team to make decisions with a clearer understanding of risk and responsibility.",
      "This article provides general information only and does not constitute legal or investment advice. Market-entry requirements should be assessed for the relevant jurisdiction, sector, and transaction.",
    ],
  },
  {
    date: "10 September 2026",
    title: "Managing legal risk during periods of business growth",
    headline: "Managing contracts, governance, and legal risk during periods of rapid business growth",
    body: [
      "Growth changes the legal needs of a business. Contracts increase in number, responsibilities move between people, new employees and suppliers are engaged, and decisions that were once informal begin to carry greater financial and regulatory consequences. Legal systems should develop at the same pace as the organisation.",
      "Contract management is a practical starting point. A business should know which agreements are in force, when they renew, who can approve changes, and where key obligations are recorded. Consistent templates can improve efficiency, but they should be supported by a process for identifying transactions that require tailored review.",
      "Governance should also remain clear as the organisation expands. Delegated authority, board and shareholder approvals, conflicts of interest, signing powers, and the documentation of significant decisions help ensure that growth does not weaken accountability.",
      "People and information create additional areas of exposure. Employment documentation, workplace policies, confidentiality protections, intellectual property ownership, data handling, and access controls should reflect the business as it operates today rather than the smaller organisation it was previously.",
      "Legal risk management works best when it is integrated into decision-making. Periodic reviews, clear escalation routes, and early involvement of legal advisers can identify issues before they interrupt a transaction or develop into a dispute. The purpose is not to slow growth, but to give the business a structure capable of supporting it.",
      "This article provides general information only and does not constitute legal advice. Appropriate measures will depend on the organisation’s activities, structure, workforce, contracts, and regulatory environment.",
    ],
  },
  {
    title: "Preparing a company for investment or acquisition",
    headline: "Preparing a company for investment or acquisition: legal priorities for founders and management",
  },
  {
    title: "Employment policies that support a growing organisation",
    headline: "Clear expectations, stronger teams: employment policies that support a growing organisation",
  },
  {
    title: "Key considerations in commercial real estate transactions",
    headline: "Due diligence and documentation: key considerations in commercial real estate transactions",
  },
  {
    title: "Protecting intellectual property as a business develops",
    headline: "Brands, content, and innovation: protecting intellectual property as a business develops",
  },
  {
    title: "The role of legal due diligence in informed decisions",
    headline: "Identifying risk before commitment: the role of legal due diligence in informed decisions",
  },
  {
    title: "Responding strategically when a commercial relationship breaks down",
    headline: "Preserving options and value when a commercial relationship begins to break down",
  },
  {
    title: "Data, technology, and the changing responsibilities of business",
    headline: "Data, technology, and the changing legal responsibilities of modern businesses",
  },
  {
    title: "Why preventive legal advice matters before problems arise",
    headline: "Beyond dispute management: why preventive legal advice matters before problems arise",
  },
] as const;

// Sample editorial titles until reviewed articles are supplied. The page keeps
// twelve entries so its one-to-four-column layouts remain complete.
export const ARTICLES: Article[] = SAMPLE_ARTICLES.map((article, i) => ({
  slug: `article-${i + 1}`,
  date: "date" in article ? article.date : "16 May 2026",
  title: article.title,
  headline: article.headline,
  image: IMAGES[i % IMAGES.length],
  body: "body" in article ? [...article.body] : Array.from({ length: 6 }, () => PLACEHOLDER_PARAGRAPH),
}));

export const getArticle = (slug: string) => ARTICLES.find((article) => article.slug === slug);

/** Every other article, the ones after it first, so each page shows different ones up front. */
export const relatedArticles = (article: Article) => {
  const i = ARTICLES.indexOf(article);
  return [...ARTICLES.slice(i + 1), ...ARTICLES.slice(0, i)];
};
