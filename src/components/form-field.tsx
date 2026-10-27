"use client";

import { useState, type ComponentProps } from "react";

// The site's form fields (see Form fields in globals.css): a label over an
// open field with only a line under it. Optional fields say so after the
// label; required ones are checked by the browser.
//
//   <FormField label="Email" name="email" type="email" required />
//   <FormField label="A note" name="note" multiline optional wide />
//   <FormFile label="CV" name="cv" accept=".pdf" hint="PDF, up to 5MB" required />

type FieldBase = {
  label: string;
  name: string;
  /** Says "(optional)" after the label. */
  optional?: boolean;
  /** Takes the whole row where fields sit two across. */
  wide?: boolean;
  /** Prefix for the field's id, so two forms can't clash. Default "field". */
  idPrefix?: string;
  className?: string;
};

type FormFieldProps = FieldBase &
  Omit<ComponentProps<"input">, "name" | "id" | "className"> & {
    /** A text box instead of a one-line field. */
    multiline?: boolean;
    rows?: number;
  };

export function FormField({
  label,
  name,
  optional = false,
  wide = false,
  idPrefix = "field",
  className = "",
  multiline = false,
  rows = 3,
  type = "text",
  ...props
}: FormFieldProps) {
  const id = `${idPrefix}-${name}`;

  return (
    <div className={fieldClasses(wide, className)}>
      <FieldLabel htmlFor={id} label={label} optional={optional} />
      {multiline ? (
        <textarea
          className="form-input form-textarea body"
          id={id}
          name={name}
          rows={rows}
          required={props.required}
          placeholder={props.placeholder}
        />
      ) : (
        <input className="form-input body" id={id} name={name} type={type} {...props} />
      )}
    </div>
  );
}

type FormFileProps = FieldBase & {
  accept?: string;
  hint?: string;
  multiple?: boolean;
  required?: boolean;
};

// A box to drop files on or click: the real file input covers it, unseen,
// so clicking, dropping, focus and the browser's checks all still work. It
// shows an upload arrow, what to do (or the chosen files) with the hint
// under it, and "Browse" / "Replace"; it darkens while a file is dragged
// over it, and stays dark once one is chosen.
export function FormFile({
  label,
  name,
  optional = false,
  wide = true,
  idPrefix = "field",
  className = "",
  accept,
  hint,
  multiple = false,
  required = false,
}: FormFileProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const id = `${idPrefix}-${name}`;

  const prompt = multiple ? "Drop files here" : "Drop a file here";
  const chosen = files.length === 0 ? prompt : files.length === 1 ? files[0] : `${files.length} files: ${files.join(", ")}`;

  return (
    <div className={fieldClasses(wide, className)}>
      <span className="form-label body" id={`${id}-label`}>
        {label}
        {optional && <span className="form-optional"> (optional)</span>}
      </span>
      <label className="form-file" data-dragging={dragging || undefined} data-chosen={files.length > 0 || undefined}>
        <input
          className="form-file-input"
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          required={required}
          aria-labelledby={`${id}-label`}
          aria-describedby={hint ? `${id}-hint` : undefined}
          onChange={(event) => {
            setFiles([...(event.target.files ?? [])].map((file) => file.name));
            setDragging(false);
          }}
          onDragEnter={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
          onDrop={() => setDragging(false)}
        />
        <span className="form-file-icon" aria-hidden="true">
          <span className="link-arrow link-arrow-up">
            <span className="text-link-icon text-link-icon-arrow-up" />
          </span>
        </span>
        <span className="form-file-text">
          <span className="form-file-name body-big">{chosen}</span>
          {hint && (
            <span className="form-hint body" id={`${id}-hint`}>
              {hint}
            </span>
          )}
        </span>
        <span className="form-file-button text-link link-underline-swap cta-small" aria-hidden="true">
          {files.length ? "Replace" : "Browse"}
        </span>
      </label>
    </div>
  );
}

function FieldLabel({ htmlFor, label, optional }: { htmlFor: string; label: string; optional: boolean }) {
  return (
    <label className="form-label body" htmlFor={htmlFor}>
      {label}
      {optional && <span className="form-optional"> (optional)</span>}
    </label>
  );
}

const fieldClasses = (wide: boolean, className: string) =>
  ["form-field", wide && "form-field-wide", className].filter(Boolean).join(" ");

// The submit button, in the text link's look (see Text link).
export function FormSubmit({ children, className = "" }: { children: string; className?: string }) {
  return (
    <button
      type="submit"
      className={`form-submit text-link text-link-with-icon link-underline-swap cta-medium ${className}`.trim()}
    >
      {children}
      <span className="link-arrow link-arrow-right" aria-hidden="true">
        <span className="text-link-icon text-link-icon-arrow-right" />
      </span>
    </button>
  );
}
