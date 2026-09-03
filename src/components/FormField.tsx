import type { ReactNode } from "react";

export default function FormField({ id, label, error, children }: {
  id: string; label: string; error?: string; children: ReactNode;
}) {
  return (
    <div className="ui-field" data-invalid={Boolean(error)}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <p id={`${id}-error`} className="ui-field-error" role="alert">{error}</p>}
    </div>
  );
}
