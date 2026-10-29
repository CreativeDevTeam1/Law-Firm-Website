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
  /** The word in "(optional)", for a form in another language. */
  optionalText?: string;
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
  optionalText,
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
      <FieldLabel htmlFor={id} label={label} optional={optional} optionalText={optionalText} />
      {multiline ? (
        <textarea
          className="form-input form-textarea body"
          id={id}
          name={name}
          rows={rows}
          required={props.required}
          placeholder={props.placeholder}
          dir={props.dir}
          lang={props.lang}
        />
      ) : (
        <input className="form-input body" id={id} name={name} type={type} {...props} />
      )}
    </div>
  );
}

// The upload's own wording, for a form in another language.
export type FormFileText = {
  dropOne: string;
  dropMany: string;
  files: (count: number) => string;
  browse: string;
  replace: string;
};

const FORM_FILE_TEXT: FormFileText = {
  dropOne: "Drop a file here",
  dropMany: "Drop files here",
  files: (count) => `${count} files`,
  browse: "Browse",
  replace: "Replace",
};

type FormFileProps = FieldBase & {
  accept?: string;
  hint?: string;
  multiple?: boolean;
  required?: boolean;
  text?: FormFileText;
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
  optionalText,
  wide = true,
  idPrefix = "field",
  className = "",
  accept,
  hint,
  multiple = false,
  required = false,
  text = FORM_FILE_TEXT,
}: FormFileProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const id = `${idPrefix}-${name}`;

  const prompt = multiple ? text.dropMany : text.dropOne;
  const chosen =
    files.length === 0 ? prompt : files.length === 1 ? files[0] : `${text.files(files.length)}: ${files.join(", ")}`;

  return (
    <div className={fieldClasses(wide, className)}>
      <span className="form-label body" id={`${id}-label`}>
        {label}
        <OptionalNote optional={optional} text={optionalText} />
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
          {files.length ? text.replace : text.browse}
        </span>
      </label>
    </div>
  );
}

type FieldLabelProps = { htmlFor: string; label: string; optional: boolean; optionalText?: string };

function FieldLabel({ htmlFor, label, optional, optionalText }: FieldLabelProps) {
  return (
    <label className="form-label body" htmlFor={htmlFor}>
      {label}
      <OptionalNote optional={optional} text={optionalText} />
    </label>
  );
}

function OptionalNote({ optional, text = "optional" }: { optional: boolean; text?: string }) {
  return optional && <span className="form-optional">{` (${text})`}</span>;
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
