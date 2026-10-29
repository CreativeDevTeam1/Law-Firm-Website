"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FocusEvent,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useLenis } from "lenis/react";
import { FormField, FormFile, FormSubmit } from "@/components/forms/form-field";
import LineReveal from "@/components/ui/line-reveal";
import SectionHeading from "@/components/ui/section-heading";
import TextLink from "@/components/ui/text-link";
import { useDividerReveal } from "@/hooks/use-divider-reveal";
import { GLOSSARY, format, plural, type Lang } from "@/lib/glossary";
import { INTAKE_SECTION_IDS, toWesternDigits, type IntakeSectionId, type IntakeText } from "@/lib/intake";

type Sent = { name: string; reference: string };

// The Client intake page, where every "Consult Us" leads — no Figma frame;
// designed from the old intake form's fields and the site's patterns. The
// Page header, then one form in numbered sections, each under a divider
// that draws in (as How we hire). It opens with the client type. Company
// information is always there; choosing "Individual" makes its fields
// optional (they're required otherwise). From 1024px an index of the
// sections sticks in columns 1–3 while the form scrolls in columns 6–12: it
// marks the section you're in and ticks off each one once its required
// fields are filled. On phones the index is left out and the sections
// stack. Choices are option cards that fill dark when chosen. Once sent, a
// thank-you with a reference and the next steps takes its place.
//
// The page reads in English or Arabic, laid out right to left, from a
// switch in the header (?lang=ar opens it in Arabic). Switching keeps
// everything typed and chosen; the headings redraw and the form fades in
// again. In Arabic the English name is optional, as the firm can write it
// out. Fields for Latin text (email, phone, ID numbers, English names) stay
// left to right in either language; free text follows what's typed. All
// the wording is in src/glossary (see glossary.ts).
export default function ClientIntakeForm({ initialLang }: { initialLang: Lang }) {
  const formRef = useRef<HTMLFormElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  const [lang, setLang] = useState(initialLang);
  const [active, setActive] = useState<IntakeSectionId>(INTAKE_SECTION_IDS[0]);
  const [done, setDone] = useState<IntakeSectionId[]>([]);
  const [isIndividual, setIsIndividual] = useState(false);
  const [sent, setSent] = useState<Sent | null>(null);

  const t = GLOSSARY[lang].intake;
  const isArabic = lang === "ar";

  // Company details are needed unless the client said they're an individual.
  const companyRequired = !isIndividual;
  const number = (id: IntakeSectionId) => String(INTAKE_SECTION_IDS.indexOf(id) + 1).padStart(2, "0");

  useDividerReveal(stepsRef, ".intake-step-divider");

  // The address keeps the language, so a reload or a shared link opens the
  // page as it was; replaceState leaves the page (and the form) as it is.
  const switchLang = (next: Lang) => {
    const url = new URL(window.location.href);
    if (next === "ar") url.searchParams.set("lang", "ar");
    else url.searchParams.delete("lang");
    window.history.replaceState(window.history.state, "", url);
    document.title = GLOSSARY[next].intake.pageTitle;
    setLang(next);
  };

  // A section is done once every field in it is valid. Practice areas need
  // at least one chosen, which the browser can't check for checkboxes, so
  // the first one carries the message. Any message set below is cleared
  // first, so the field is checked afresh.
  const updateDone = useCallback(() => {
    const form = formRef.current;
    if (!form) return;

    form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea").forEach((field) => {
      field.setCustomValidity("");
    });
    const areas = [...form.querySelectorAll<HTMLInputElement>('input[name="practice"]')];
    areas[0]?.setCustomValidity(areas.some((area) => area.checked) ? "" : t.errors.practice);

    setDone(
      INTAKE_SECTION_IDS.filter((id) => {
        const fields = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(`#${id} :is(input, textarea)`);
        return [...fields].every((field) => field.validity.valid);
      }),
    );
  }, [t]);

  // Company information's fields stop or start being required with the
  // client type, and the English name with the language.
  useEffect(updateDone, [updateDone, isIndividual]);

  // The browser writes its messages in its own language, not the page's, so
  // each field that fails gets the page's own, as the browser asks for them.
  // ("invalid" doesn't bubble, hence the capture.)
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const { required, choose, email, consent } = t.errors;
    const explain = (event: Event) => {
      const field = event.target as HTMLInputElement | HTMLTextAreaElement;
      const message =
        field.type === "checkbox" ? consent : field.type === "radio" ? choose : field.validity.typeMismatch ? email : required;
      if (!field.validity.customError) field.setCustomValidity(message);
    };

    form.addEventListener("invalid", explain, true);
    return () => form.removeEventListener("invalid", explain, true);
  }, [t, sent]);

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
    INTAKE_SECTION_IDS.forEach((id) => {
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

  // Numbers typed with an Arabic keyboard (٠١٢…) become 0–9 as the client
  // leaves the field, so the firm can search and dial them.
  const westernDigits = (event: FocusEvent<HTMLFormElement>) => {
    const field = event.target;
    if (field instanceof HTMLInputElement && field.dataset.digits !== undefined) {
      field.value = toWesternDigits(field.value);
    }
  };

  // TODO: nothing is sent yet. Post the form data (documents included, and
  // the "lang" field, so the firm replies in the client's language) to the
  // firm once there's somewhere to send it — and keep the ID numbers out of
  // plain email.
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get(isArabic ? "name-ar" : "name-en")).trim().split(/\s+/)[0];
    const reference = `SE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setSent({ name, reference });
    lenis?.scrollTo(0, { immediate: true });
  };

  const fieldText = { idPrefix: "intake", optionalText: t.optional };
  // Latin text: left to right, in the Latin typeface, whatever the page's language.
  const latin = { dir: "ltr", lang: "en" } as const;
  const arabic = { dir: "rtl", lang: "ar" } as const;
  // The two names swap places with the language; keyed, so each keeps
  // what's typed in it as it moves.
  const nameEn = (
    <FormField
      key="name-en"
      {...fieldText}
      {...latin}
      label={t.fields.nameEn}
      name="name-en"
      autoComplete="name"
      required={!isArabic}
      optional={isArabic}
    />
  );
  const nameAr = (
    <FormField key="name-ar" {...fieldText} {...arabic} label={t.fields.nameAr} name="name-ar" required />
  );

  return (
    <section className="intake" aria-labelledby="intake-title" lang={lang} dir={isArabic ? "rtl" : "ltr"}>
      {sent ? (
        <IntakeSent {...sent} lang={lang} t={t} onSwitch={switchLang} />
      ) : (
        <div className="page-header intake-header">
          <LangSwitch lang={lang} t={t} onSwitch={switchLang} />
          {/* Keyed by language, so the headings split and reveal afresh. */}
          <SectionHeading
            key={`heading-${lang}`}
            as="h1"
            id="intake-title"
            label={t.label}
            className="page-heading intake-heading"
          >
            {t.heading}
          </SectionHeading>
          <LineReveal key={`intro-${lang}`} className="page-intro body" delay={0.1}>
            {t.intro}
          </LineReveal>
        </div>
      )}

      {!sent && (
        <form
          className="intake-form"
          ref={formRef}
          onSubmit={submit}
          onInput={updateDone}
          onChange={updateDone}
          onBlur={westernDigits}
        >
          <input type="hidden" name="lang" value={lang} />

          <nav className="intake-index" ref={indexRef} aria-label={t.indexLabel}>
            <p className="intake-index-label cta-small">{t.index}</p>
            <ol className="intake-index-list">
              {INTAKE_SECTION_IDS.map((id) => {
                const { title } = t.sections[id];
                const isDone = done.includes(id);
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="intake-index-link body"
                      aria-current={active === id ? "step" : undefined}
                      aria-label={isDone ? format(t.complete, { title }) : title}
                      data-done={isDone || undefined}
                      onClick={(event) => goTo(event, id)}
                    >
                      <span className="intake-index-number">{number(id)}</span>
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
                style={{ "--intake-progress": done.length / INTAKE_SECTION_IDS.length } as CSSProperties}
                aria-hidden="true"
              />
              <p className="intake-progress-text body">
                {format(t.progress, { done: done.length, all: INTAKE_SECTION_IDS.length })}
              </p>
            </div>
          </nav>

          <div className="intake-steps" ref={stepsRef}>
            <IntakeStep id="intake-client" number={number("intake-client")} t={t}>
              <OptionCards
                name="client-type"
                labelledBy="intake-client-title"
                options={t.clientTypes}
                onChange={(value) => setIsIndividual(value === "individual")}
              />
            </IntakeStep>

            <IntakeStep id="intake-personal" number={number("intake-personal")} t={t}>
              <div className="form-fields">
                {/* The name in the page's language comes first. */}
                {isArabic ? [nameAr, nameEn] : [nameEn, nameAr]}
                <FormField {...fieldText} {...latin} label={t.fields.email} name="email" type="email" autoComplete="email" required />
                <FormField
                  {...fieldText}
                  {...latin}
                  label={t.fields.phone}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  data-digits
                  required
                />
                <FormField {...fieldText} {...latin} label={t.fields.idNumber} name="id-number" data-digits required />
                <FormField {...fieldText} dir="auto" label={t.fields.nationality} name="nationality" required />
                <FormField {...fieldText} {...latin} label={t.fields.birthDate} name="birth-date" type="date" optional />
                <FormField {...fieldText} dir="auto" label={t.fields.occupation} name="occupation" optional />
              </div>
            </IntakeStep>

            <IntakeStep id="intake-company" number={number("intake-company")} t={t}>
              <div className="form-fields">
                <FormField
                  {...fieldText}
                  {...latin}
                  label={t.fields.companyEn}
                  name="company-en"
                  required={companyRequired}
                  optional={!companyRequired}
                />
                <FormField {...fieldText} {...arabic} label={t.fields.companyAr} name="company-ar" optional />
                <FormField
                  {...fieldText}
                  dir="auto"
                  label={t.fields.businessActivity}
                  name="business-activity"
                  required={companyRequired}
                  optional={!companyRequired}
                />
                <FormField
                  {...fieldText}
                  dir="auto"
                  label={t.fields.position}
                  name="position"
                  required={companyRequired}
                  optional={!companyRequired}
                />
                <FormField
                  {...fieldText}
                  {...latin}
                  label={t.fields.registryNumber}
                  name="registry-number"
                  data-digits
                  required={companyRequired}
                  optional={!companyRequired}
                />
                <FormField {...fieldText} {...latin} label={t.fields.taxId} name="tax-id" data-digits optional />
                <FormField
                  {...fieldText}
                  dir="auto"
                  label={t.fields.companyAddress}
                  name="company-address"
                  required={companyRequired}
                  optional={!companyRequired}
                  wide
                />
                <FormField
                  {...fieldText}
                  dir="auto"
                  label={t.fields.primaryContact}
                  name="primary-contact"
                  optional
                  wide
                />
              </div>
            </IntakeStep>

            <IntakeStep id="intake-engagement" number={number("intake-engagement")} t={t}>
              <OptionCards name="engagement" labelledBy="intake-engagement-title" options={t.engagements} />
            </IntakeStep>

            <IntakeStep id="intake-practice" number={number("intake-practice")} t={t}>
              <OptionCards
                name="practice"
                labelledBy="intake-practice-title"
                options={t.practiceAreas}
                multiple
                compact
              />
            </IntakeStep>

            <IntakeStep id="intake-matter" number={number("intake-matter")} t={t}>
              <div className="form-fields">
                <FormField
                  {...fieldText}
                  dir="auto"
                  label={t.fields.matter}
                  name="matter"
                  rows={4}
                  multiline
                  required
                  wide
                />
                <FormFile
                  {...fieldText}
                  label={t.fields.documents}
                  name="documents"
                  className="intake-documents"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  hint={t.documentsHint}
                  text={{ ...t.file, files: (count) => plural(lang, t.file.files, count) }}
                  multiple
                  optional
                />
              </div>
            </IntakeStep>

            <IntakeStep id="intake-payment" number={number("intake-payment")} t={t}>
              <OptionCards name="payment" labelledBy="intake-payment-title" options={t.paymentMethods} />
            </IntakeStep>

            <div className="intake-submit">
              <label className="intake-consent">
                <input className="intake-consent-input" type="checkbox" name="consent" required />
                <span className="intake-consent-box" aria-hidden="true" />
                <span className="intake-consent-text body">{t.consent}</span>
              </label>
              <FormSubmit>{t.submit}</FormSubmit>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}

// Whether the visitor's browser asks for Arabic. Read only in the browser;
// the server (and the first render) assume not.
const subscribeNever = () => () => {};
const prefersArabic = () => navigator.languages.some((language) => language.toLowerCase().startsWith("ar"));

type LangSwitchProps = { lang: Lang; t: IntakeText; onSwitch: (lang: Lang) => void };

// "English" and "العربية", each in its own script, so anyone can find
// theirs. The page's language is dark; the other is grey with the link's
// hover line. A browser set to Arabic marks العربية with a dot until the
// visitor has switched.
function LangSwitch({ lang, t, onSwitch }: LangSwitchProps) {
  const suggestArabic = useSyncExternalStore(subscribeNever, prefersArabic, () => false);

  const options = [
    { value: "en", label: "English" },
    { value: "ar", label: "العربية" },
  ] as const;

  return (
    <div className="intake-lang" role="group" aria-label={t.languages}>
      {options.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          lang={value}
          className="intake-lang-option link-underline cta-small"
          aria-pressed={lang === value}
          data-suggested={(value === "ar" && suggestArabic && lang === "en") || undefined}
          onClick={() => lang !== value && onSwitch(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

type IntakeStepProps = { id: IntakeSectionId; number: string; t: IntakeText; children: ReactNode };

// One numbered section: its divider, "01. Client type" and a line on what
// it's for, then its fields.
function IntakeStep({ id, number, t, children }: IntakeStepProps) {
  const { title, text } = t.sections[id];

  return (
    <section className="intake-step" id={id} aria-labelledby={`${id}-title`}>
      <span className="intake-step-divider" aria-hidden="true" />
      <div className="intake-step-head">
        <h2 id={`${id}-title`} className="intake-step-title header-2-semibold">
          <span className="intake-step-number">{`${number}.`}</span> {title}
        </h2>
        <p className="intake-step-text body-big">{text}</p>
      </div>
      {children}
    </section>
  );
}

// Each choice's value (what the form sends) and its wording.
type Options = Record<string, { title: string; description?: string }>;

type OptionCardsProps = {
  name: string;
  labelledBy: string;
  options: Options;
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
function OptionCards({
  name,
  labelledBy,
  options,
  multiple = false,
  compact = false,
  onChange,
}: OptionCardsProps) {
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
      style={{ "--intake-option-count": Object.keys(options).length } as CSSProperties}
    >
      {Object.entries(options).map(([value, { title, description }]) => (
        <label className="intake-option" key={value}>
          <input
            className="intake-option-input"
            type={multiple ? "checkbox" : "radio"}
            name={name}
            value={value}
            required={!multiple}
            checked={chosen.includes(value)}
            onClick={() => toggle(value)}
            // The click above does the work; a radio's own change is ignored.
            onChange={() => {}}
          />
          <span className="intake-option-tick" aria-hidden="true" />
          <span className="intake-option-title header-3-semibold">{title}</span>
          {description && <span className="intake-option-text body">{description}</span>}
        </label>
      ))}
    </div>
  );
}

type IntakeSentProps = Sent & LangSwitchProps;

// After sending, in the page header's place: a thank-you with "(Request
// received)" set into it, the reference, and what happens next, as How we
// hire's numbered steps.
function IntakeSent({ name, reference, lang, t, onSwitch }: IntakeSentProps) {
  return (
    <div className="intake-sent" role="status">
      <div className="page-header">
        <LangSwitch lang={lang} t={t} onSwitch={onSwitch} />
        <SectionHeading
          key={`sent-heading-${lang}`}
          as="h1"
          id="intake-title"
          label={t.sentLabel}
          className="page-heading intake-sent-heading"
        >
          {format(t.sentHeading, { name })}
        </SectionHeading>
        <LineReveal key={`sent-intro-${lang}`} className="page-intro body" delay={0.1}>
          {format(t.reference, { reference })}
        </LineReveal>
      </div>

      <ol className="intake-next">
        {t.nextSteps.map((step, i) => (
          <li className="intake-next-step" key={i}>
            <span className="intake-next-number header-2-semibold">{`${String(i + 1).padStart(2, "0")}.`}</span>
            <div className="intake-next-content">
              <h2 className="header-3-semibold">{step.title}</h2>
              <p className="intake-next-text body-big">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <TextLink href="/" size="medium" icon="arrow-right" className="intake-sent-link">
        {t.backHome}
      </TextLink>
    </div>
  );
}
