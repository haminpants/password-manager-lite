import { InputShake } from "./InputShake";

/**
  * @name InputText
  * @description
  * ----
  * 
  * ###### Description
  * - InputText is a reusable text input component used throughout the application.
  * 
  * - InputText combines a label, an HTML input element, and {@link InputShake} into a single component.
  * 
  * - InputText supports different input types such as text, username, and password.
  * 
  * - When provided, error messages and animation triggers are forwarded to InputShake.
  * 
  * ----
  * 
  * @param {string} label - Text displayed above the input field
  * @param {string} [type="text"] - HTML input type
  * @param {string} value - Current value of the input
  * @param {Function} onChange - Function called when the input value changes
  * @param {string} autoComplete - HTML autocomplete value for the input
  * @param {string} message - Error message displayed by InputShake
  * @param {number} triggerError - Value used to trigger the shake animation
  * 
  * @returns {JSX.Element} A labeled input field wrapped with InputShake
  */
export default function InputShakeText({
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  message,
  triggerError
}) {
  return (
    <>
      {label && (
        <label>
          {label}
        </label>
      )}

      <InputShake
        message={message}
        triggerError={triggerError}
      >
        <input
          className="border border-grey px-1"
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
        />
      </InputShake>
    </>
  );
}