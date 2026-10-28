"use client";

import { useState, type FormEvent } from "react";
import { FormField, FormFile, FormSubmit } from "@/components/forms/form-field";

type JobApplicationProps = { roleTitle: string };

// The end of a role's page, where "Apply for this role" leads: "(Apply)"
// under a divider on the left, as the role's lists, and a short form on
// the right — name, email, phone, LinkedIn, a CV and a note (form-field.tsx).
// The browser checks the required fields; once sent, a thank-you takes the
// form's place.
export default function JobApplication({ roleTitle }: JobApplicationProps) {
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

          <div className="form-fields">
            <FormField idPrefix="job" label="Full name" name="name" autoComplete="name" required />
            <FormField idPrefix="job" label="Email" name="email" type="email" autoComplete="email" required />
            <FormField idPrefix="job" label="Phone" name="phone" type="tel" autoComplete="tel" optional />
            <FormField
              idPrefix="job"
              label="LinkedIn profile"
              name="linkedin"
              type="url"
              placeholder="https://"
              optional
            />
            <FormFile
              idPrefix="job"
              label="CV"
              name="cv"
              accept=".pdf,.doc,.docx"
              hint="PDF or Word, up to 5MB"
              required
            />
            <FormField
              idPrefix="job"
              label="A note"
              name="note"
              className="job-form-field-note"
              multiline
              optional
              wide
            />
          </div>

          <FormSubmit>Submit application</FormSubmit>
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
