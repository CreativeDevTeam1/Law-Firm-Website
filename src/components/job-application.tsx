"use client";

import { useState, type FormEvent } from "react";

type JobApplicationProps = { roleTitle: string };

// The end of a role's page, where "Apply for this role" leads: "(Apply)"
// under a divider on the left, as the role's lists, and a short form on
// the right — name, email, phone, LinkedIn, a CV and a note. The browser
// checks the required fields; once sent, a thank-you takes the form's place.
export default function JobApplication({ roleTitle }: JobApplicationProps) {
  const [cvName, setCvName] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);

  // TODO: nothing is sent yet. Post the form data (CV included) to the
  // firm's inbox or applicant tracking once there's one to send it to.
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = new FormData(event.currentTarget).get("name");
    setSentTo(String(name).trim().split(/\s+/)[0]);
  };

  return (
    <section className="job-section job-application" id="apply" aria-labelledby="job-application-title">
      <h2 id="job-application-title" className="job-section-label cta-medium">
        (Apply)
      </h2>

      {sentTo === null ? (
        <form className="job-form" onSubmit={submit}>
          <p className="job-form-intro body-big">
            Tell us a little about yourself and attach your CV. We read every
            application and reply within two weeks.
          </p>

          <div className="job-form-fields">
            <Field label="Full name" name="name" autoComplete="name" required />
            <Field label="Email" name="email" type="email" autoComplete="email" required />
            <Field label="Phone" name="phone" type="tel" autoComplete="tel" optional />
            <Field label="LinkedIn profile" name="linkedin" type="url" placeholder="https://" optional />

            <div className="job-form-field job-form-field-wide">
              <span className="job-form-label body" id="job-cv-label">
                CV
              </span>
              <label className="job-form-file">
                <input
                  className="job-form-file-input"
                  type="file"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  required
                  aria-labelledby="job-cv-label"
                  aria-describedby="job-cv-hint"
                  onChange={(event) => setCvName(event.target.files?.[0]?.name ?? "")}
                />
                <span className="job-form-file-name body-big">{cvName || "No file chosen"}</span>
                <span className="job-form-file-button text-link link-underline-swap cta-small">
                  {cvName ? "Replace" : "Attach file"}
                </span>
              </label>
              <span className="job-form-hint body" id="job-cv-hint">
                PDF or Word, up to 5MB
              </span>
            </div>

            <div className="job-form-field job-form-field-wide job-form-field-note">
              <label className="job-form-label body" htmlFor="job-note">
                A note <span className="job-form-optional">(optional)</span>
              </label>
              <textarea className="job-form-input job-form-textarea body-big" id="job-note" name="note" rows={4} />
            </div>
          </div>

          <button
            type="submit"
            className="job-form-submit text-link text-link-with-icon link-underline-swap cta-medium"
          >
            Submit application
            <span className="link-arrow link-arrow-right" aria-hidden="true">
              <span className="text-link-icon text-link-icon-arrow-right" />
            </span>
          </button>
        </form>
      ) : (
        <div className="job-form-sent" role="status">
          <p className="header-2-medium">Thank you, {sentTo}.</p>
          <p className="body-big">
            Your application for {roleTitle} is with us. We’ll be in touch
            within two weeks.
          </p>
        </div>
      )}
    </section>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
};

function Field({ label, name, type = "text", optional = false, ...props }: FieldProps) {
  const id = `job-${name}`;
  return (
    <div className="job-form-field">
      <label className="job-form-label body" htmlFor={id}>
        {label}
        {optional && <span className="job-form-optional"> (optional)</span>}
      </label>
      <input className="job-form-input body-big" id={id} name={name} type={type} {...props} />
    </div>
  );
}
