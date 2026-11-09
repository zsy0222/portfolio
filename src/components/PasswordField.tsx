import FormField from "./FormField";

export default function PasswordField({
  value, onChange, error, id = "unlock-password", label = "Password",
  placeholder = "Password to unlock", errorMessage = "Wrong password, try again.",
}: {
  value: string; onChange: (value: string) => void; error: boolean;
  id?: string; label?: string; placeholder?: string; errorMessage?: string;
}) {
  return <FormField id={id} label={label} error={error ? errorMessage : undefined}>
    <input id={id} name="password" type="password" value={value}
      onChange={(event) => onChange(event.target.value)} placeholder={placeholder}
      autoComplete="off" aria-invalid={error} aria-describedby={error ? `${id}-error` : undefined} />
  </FormField>;
}
