import FormField from "./FormField";

export default function PasswordField({ value, onChange, error }: {
  value: string; onChange: (value: string) => void; error: boolean;
}) {
  return <FormField id="unlock-password" label="Password" error={error ? "Wrong password, try again." : undefined}>
    <input id="unlock-password" name="password" type="password" value={value}
      onChange={(event) => onChange(event.target.value)} placeholder="Password to unlock"
      autoComplete="off" aria-invalid={error} aria-describedby={error ? "unlock-password-error" : undefined} />
  </FormField>;
}
