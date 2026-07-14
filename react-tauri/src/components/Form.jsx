import StatusMessage from "./StatusMessage";


/**
  * @name Form
  * @description
  * ----
  * 
  * ###### Description
  * - Form is a reusable layout component for pages that require user input.
  * 
  * - Form provides the common structure shared between pages such as {@link LogIn}, {@link AddEntry}, and {@link AddProfile}.
  * 
  * - Form displays a title, input fields, submit button, alternate action button, and status message.
  * 
  * - The specific inputs and submit behaviour are provided by the parent component through props and {@link children}.
  * 
  * ----
  * 
  * ###### Implementation Logic
  * 
  * Form receives input components through **children**.
  * 
  * - Children allows different pages to provide different numbers and types of inputs while keeping the same form layout.
  * 
  * - Form calls **onSubmit()** when the user submits the form.
  * 
  * - Form displays the submit button using *buttonText*.
  * 
  * - Form displays an alternate action button using *alternateButtonText* and *alternateAction*.
  * 
  * - Form displays operation feedback through {@link StatusMessage}.
  * 
  * ----
  * 
  * @param {string} title - Title displayed above the form
  * @param {string} submitButtonText - Text displayed inside the submit button
  * @param {Function} onSubmit - Function called when the form is submitted
  * @param {React.ReactNode} children - Input components and additional form content provided by the parent component
  * @param {string} alternateButtonText - Text displayed inside the alternate action button
  * @param {Function} alternateAction - Function called when the alternate action button is pressed
  * @param {string} statusMessage - Message displayed below the form after an operation
  */


export default function Form({
  title,
  submitButtonText,
  onSubmit,
  children,
  alternateButtonText,
  alternateAction,
  statusMessage
}) {
  return (
    <div className="flex flex-col justify-center items-center gap-1">

      <h1 className="text-sky-300 text-4xl">
        {title}
      </h1>

      <form
        className="flex flex-col gap-2 mt-10"
        onSubmit={onSubmit}
      >

        {children}

        <button
          className="text-sky-300 mr-4 hover:text-sky-700"
          type="submit"
        >
          {submitButtonText}
        </button>

      </form>


      <button
        className="mt-4 mr-4 text-(--text-more-muted) hover:text-(--error-color)"
        onClick={alternateAction}
        type="button"
      >
        {alternateButtonText}
      </button>

      <div className="mt-8 text-xl">
        <StatusMessage message={statusMessage} />
      </div>

      

    </div>
  );
}