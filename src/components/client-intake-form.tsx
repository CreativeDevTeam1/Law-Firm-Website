"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useLenis } from "lenis/react";
import { FormField, FormFile, FormSubmit } from "@/components/form-field";
import LineReveal from "@/components/line-reveal";
import SectionHeading from "@/components/section-heading";
import TextLink from "@/components/text-link";
import { useDividerReveal } from "@/hooks/use-divider-reveal";
import {
  CLIENT_TYPES,
  ENGAGEMENTS,
  INTAKE_NEXT_STEPS,
  INTAKE_SECTIONS,
  PAYMENT_METHODS,
  PRACTICE_AREAS,
  type IntakeOption,
  type IntakeSectionId,
} from "@/lib/intake";

type Sent = { name: string; reference: string };

// The Client intake page, where every "Let's Talk" leads — no Figma frame;
// designed from the old intake form's fields and the site's patterns. The
// Page header, then one form in six numbered sections, each under a divider
// that draws in (as How we hire). From 1024px an index of the sections sticks
// in columns 1–3 while the form scrolls in columns 6–12: it marks the section
// you're in and ticks off each one once its required fields are filled. On
// phones the index is left out and the sections stack. Choices are option
// cards that fill dark when chosen; company details only show for a company.
// Once sent, a thank-you with a reference and the next steps takes its place.
export default function ClientIntakeForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  const [active, setActive] = useState<IntakeSectionId>(INTAKE_SECTIONS[0].id);
  const [done, setDone] = useState<IntakeSectionId[]>([]);
  const [isCompany, setIsCompany] = useState(false);
  const [sent, setSent] = useState<Sent | null>(null);

  useDividerReveal(stepsRef, ".intake-step-divider");

  // A section is done once every field in it is valid. Practice areas need
  // at least one chosen, which the browser can't check for checkboxes, so
  // the first one carries the message.
  const updateDone = useCallback(() => {
    const form = formRef.current;
    if (!form) return;

    const areas = [...form.querySelectorAll<HTMLInputElement>('input[name="practice"]')];
    areas[0]?.setCustomValidity(areas.some((area) => area.checked) ? "" : "Choose at least one practice area.");

    setDone(
      INTAKE_SECTIONS.filter(({ id }) => {
        const fields = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(`#${id} :is(input, textarea)`);
        return [...fields].every((field) => field.validity.valid);
      }).map(({ id }) => id),
    );
  }, []);

  // The company fields come and go with the choice above them.
  useEffect(updateDone, [updateDone, isCompany]);

  // The section crossing the middle of the screen is the one you're in.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id as IntakeSectionId);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    INTAKE_SECTIONS.forEach(({ id }) => {
      const section = form.querySelector(`#${id}`);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [sent]);

  // The index glides to a section, stopping where the index itself sticks.
  const goTo = (event: MouseEvent<HTMLAnchorElement>, id: IntakeSectionId) => {
    if (!lenis || !indexRef.current) return;
    event.preventDefault();
    lenis.scrollTo(`#${id}`, { offset: -parseFloat(getComputedStyle(indexRef.current).top) });
  };

  // TODO: nothing is sent yet. Post the form data (documents included) to
  // the firm once there's somewhere to send it — and keep the ID numbers
  // out of plain email.
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name-en")).trim().split(/\s+/)[0];
    const reference = `SE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setSent({ name, reference });
    lenis?.scrollTo(0, { immediate: true });
  };

  return (
    <section className="intake" aria-labelledby="intake-title">
      {sent ? (
        <IntakeSent {...sent} />
      ) : (
        <div className="page-header intake-header">
          <SectionHeading as="h1" id="intake-title" label="(Client intake)" className="page-heading intake-heading">
            Tell us about yourself and your matter. A partner reads every
            request in confidence and replies within two working days.
          </SectionHeading>
          <LineReveal className="page-intro body" delay={0.1}>
            The form takes about ten minutes. What you share here stays between
            you and the firm, and is used only to assess your matter and check
            for conflicts of interest before we speak.
          </LineReveal>
        </div>
      )}

      {!sent && (
        <form className="intake-form" ref={formRef} onSubmit={submit} onInput={updateDone} onChange={updateDone}>
          <nav className="intake-index" ref={indexRef} aria-label="Form sections">
            <p className="intake-index-label cta-small">(Your request)</p>
            <ol className="intake-index-list">
              {INTAKE_SECTIONS.map(({ id, title }, i) => {
                const isDone = done.includes(id);
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="intake-index-link body"
                      aria-current={active === id ? "step" : undefined}
                      aria-label={isDone ? `${title}, complete` : title}
                      data-done={isDone || undefined}
                      onClick={(event) => goTo(event, id)}
                    >
                      <span className="intake-index-number">{String(i + 1).padStart(2, "0")}</span>
                      <span className="intake-index-title">{title}</span>
                      <span className="intake-index-tick" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ol>
            <div className="intake-progress">
              <span
                className="intake-progress-bar"
                style={{ "--intake-progress": done.length / INTAKE_SECTIONS.length } as CSSProperties}
                aria-hidden="true"
              />
              <p className="intake-progress-text body">
                {done.length} of {INTAKE_SECTIONS.length} complete
              </p>
            </div>
          </nav>

          <div className="intake-steps" ref={stepsRef}>
            <IntakeStep index={0}>
              <div className="form-fields">
                <FormField idPrefix="intake" label="Full name in English" name="name-en" autoComplete="name" required />
                <FormField idPrefix="intake" label="Full name in Arabic" name="name-ar" dir="rtl" lang="ar" required />
                <FormField idPrefix="intake" label="Email" name="email" type="email" autoComplete="email" required />
                <FormField idPrefix="intake" label="Phone" name="phone" type="tel" autoComplete="tel" required />
                <FormField idPrefix="intake" label="National ID / Passport no." name="id-number" required />
                <FormField idPrefix="intake" label="Nationality" name="nationality" required />
                <FormField idPrefix="intake" label="Date of birth" name="birth-date" type="date" optional />
                <FormField idPrefix="intake" label="Occupation" name="occupation" optional />
              </div>
            </IntakeStep>

            <IntakeStep index={1}>
              <OptionCards
                name="client-type"
                labelledBy="intake-company-title"
                options={CLIENT_TYPES}
                onChange={(value) => setIsCompany(value === "company")}
              />
              {isCompany && (
                <div className="form-fields intake-company-fields">
                  <FormField idPrefix="intake" label="Company name in English" name="company-en" required />
                  <FormField
                    idPrefix="intake"
                    label="Company name in Arabic"
                    name="company-ar"
                    dir="rtl"
                    lang="ar"
                    optional
                  />
                  <FormField idPrefix="intake" label="Business activity" name="business-activity" required />
                  <FormField idPrefix="intake" label="Your position" name="position" required />
                  <FormField idPrefix="intake" label="Commercial registry no." name="registry-number" required />
                  <FormField idPrefix="intake" label="Tax ID no." name="tax-id" optional />
                  <FormField idPrefix="intake" label="Company address" name="company-address" required wide />
                  <FormField idPrefix="intake" label="Primary contact person" name="primary-contact" optional wide />
                </div>
              )}
            </IntakeStep>

            <IntakeStep index={2}>
              <OptionCards name="engagement" labelledBy="intake-engagement-title" options={ENGAGEMENTS} />
            </IntakeStep>

            <IntakeStep index={3}>
              <OptionCards
                name="practice"
                labelledBy="intake-practice-title"
                options={PRACTICE_AREAS}
                multiple
                compact
              />
            </IntakeStep>

            <IntakeStep index={4}>
              <div className="form-fields">
                <FormField
                  idPrefix="intake"
                  label="Brief about the matter"
                  name="matter"
                  rows={4}
                  multiline
                  required
                  wide
                />
                <FormFile
                  idPrefix="intake"
                  label="Documents"
                  name="documents"
                  className="intake-documents"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  hint="PDF, Word or images, up to 10MB in all"
                  multiple
                  optional
                />
              </div>
            </IntakeStep>

            <IntakeStep index={5}>
              <OptionCards name="payment" labelledBy="intake-payment-title" options={PAYMENT_METHODS} />
            </IntakeStep>

            <div className="intake-submit">
              <label className="intake-consent">
                <input className="intake-consent-input" type="checkbox" name="consent" required />
                <span className="intake-consent-box" aria-hidden="true" />
                <span className="intake-consent-text body">
                  I confirm the details above are accurate. I understand the firm
                  keeps them confidential, and that sending this form doesn’t by
                  itself make the firm my lawyers.
                </span>
              </label>
              <FormSubmit>Submit request</FormSubmit>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}

type IntakeStepProps = { index: number; children: ReactNode };

// One numbered section: its divider, "01. Personal information" and a line
// on what it's for, then its fields.
function IntakeStep({ index, children }: IntakeStepProps) {
  const { id, title, text } = INTAKE_SECTIONS[index];

  return (
    <section className="intake-step" id={id} aria-labelledby={`${id}-title`}>
      <span className="intake-step-divider" aria-hidden="true" />
      <div className="intake-step-head">
        <h2 id={`${id}-title`} className="intake-step-title header-2-semibold">
          <span className="intake-step-number">{`${String(index + 1).padStart(2, "0")}.`}</span> {title}
        </h2>
        <p className="intake-step-text body-big">{text}</p>
      </div>
      {children}
    </section>
  );
}

type OptionCardsProps = {
  name: string;
  labelledBy: string;
  options: IntakeOption[];
  /** Checkboxes (any number) instead of radio buttons (one, required). */
  multiple?: boolean;
  /** Two across on phones instead of one, for short options. */
  compact?: boolean;
  onChange?: (value: string) => void;
};

// Choices as cards: the real radio button or checkbox stays in each card,
// out of sight, and the card fills dark with a tick once it's chosen.
// The cards keep their own choice, so clicking a chosen card again clears
// it, which radio buttons don't do on their own. Each click (a keypress on
// a focused card counts as one) adds or removes that card.
function OptionCards({ name, labelledBy, options, multiple = false, compact = false, onChange }: OptionCardsProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [chosen, setChosen] = useState<string[]>([]);

  const toggle = (value: string) => {
    const next = chosen.includes(value)
      ? chosen.filter((v) => v !== value)
      : multiple
        ? [...chosen, value]
        : [value];
    setChosen(next);
    onChange?.(next[0] ?? "");
  };

  // Once the cards show the new choice, the form (which ticks off finished
  // sections) is told, as it would be by a click on a plain input.
  useEffect(() => {
    groupRef.current?.dispatchEvent(new Event("input", { bubbles: true }));
  }, [chosen]);

  return (
    <div
      ref={groupRef}
      className={`intake-options${compact ? " intake-options-compact" : ""}`}
      role={multiple ? "group" : "radiogroup"}
      aria-labelledby={labelledBy}
      aria-required={multiple ? undefined : true}
      style={{ "--intake-option-count": options.length } as CSSProperties}
    >
      {options.map((option) => (
        <label className="intake-option" key={option.value}>
          <input
            className="intake-option-input"
            type={multiple ? "checkbox" : "radio"}
            name={name}
            value={option.value}
            required={!multiple}
            checked={chosen.includes(option.value)}
            onClick={() => toggle(option.value)}
            // The click above does the work; a radio's own change is ignored.
            onChange={() => {}}
          />
          <span className="intake-option-tick" aria-hidden="true" />
          <span className="intake-option-title header-3-semibold">{option.title}</span>
          {option.description && <span className="intake-option-text body">{option.description}</span>}
        </label>
      ))}
    </div>
  );
}

// After sending, in the page header's place: a thank-you with "(Request
// received)" set into it, the reference, and what happens next, as How we
// hire's numbered steps.
function IntakeSent({ name, reference }: Sent) {
  return (
    <div className="intake-sent" role="status">
      <div className="page-header">
        <SectionHeading as="h1" id="intake-title" label="(Request received)" className="page-heading intake-sent-heading">
          Thank you, {name}. Your request is with us, and a partner will be in
          touch within two working days.
        </SectionHeading>
        <LineReveal className="page-intro body" delay={0.1}>
          {`Your reference is ${reference}. Keep it to hand if you call or write to us about this matter.`}
        </LineReveal>
      </div>

      <ol className="intake-next">
        {INTAKE_NEXT_STEPS.map((step, i) => (
          <li className="intake-next-step" key={step.title}>
            <span className="intake-next-number header-2-semibold">{`${String(i + 1).padStart(2, "0")}.`}</span>
            <div className="intake-next-content">
              <h2 className="header-3-semibold">{step.title}</h2>
              <p className="intake-next-text body-big">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <TextLink href="/" size="medium" icon="arrow-right" className="intake-sent-link">
        Back to home
      </TextLink>
    </div>
  );
}
