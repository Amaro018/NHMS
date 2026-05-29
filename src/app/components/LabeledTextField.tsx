import { forwardRef, PropsWithoutRef } from "react"
import { useField, useFormikContext, ErrorMessage } from "formik"

export interface LabeledTextFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  name: string
  label: string
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ name, label, outerProps, ...props }, ref) => {
    const [input] = useField(name)
    const { isSubmitting } = useFormikContext()

    return (
      <div className="flex flex-col gap-1 w-full" {...outerProps}>
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <input
          {...input}
          {...props}
          ref={ref}
          disabled={isSubmitting}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:opacity-50 transition"
        />
        <ErrorMessage name={name}>
          {(msg) => (
            <span role="alert" className="text-red-500 text-xs mt-0.5">
              {msg}
            </span>
          )}
        </ErrorMessage>
      </div>
    )
  }
)

LabeledTextField.displayName = "LabeledTextField"

export default LabeledTextField
