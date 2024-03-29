import { Button } from "@chakra-ui/button"
import { Box } from "@chakra-ui/layout"
import { createContext, ReactNode, PropsWithoutRef } from "react"
import { Form as FinalForm, FormProps as FinalFormProps } from "react-final-form"
import * as z from "zod"
export { FORM_ERROR } from "final-form"

export interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  /** All your form fields */
  children?: ReactNode
  /** Text to display in the submit button */
  submitText?: string
  schema?: S
  onSubmit: FinalFormProps<z.infer<S>>["onSubmit"]
  initialValues?: FinalFormProps<z.infer<S>>["initialValues"]
}

export const FormContext = createContext<{
  submitting: boolean
  submitError?: string
}>({
  submitting: false,
})

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  ...props
}: FormProps<S>) {
  return (
    <FinalForm
      initialValues={initialValues}
      validate={(values) => {
        if (!schema) return
        try {
          schema.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, submitError }) => {
        return (
          <form onSubmit={handleSubmit} className="form" {...props}>
            {/* Form fields supplied as children are rendered here */}
            <FormContext.Provider value={{ submitting, submitError }}>
              {children}
            </FormContext.Provider>

            {submitText ? (
              <Button type="submit" disabled={submitting}>
                {submitText}
              </Button>
            ) : null}

            {submitText && submitError ? (
              <Box role="alert" style={{ color: "red" }}>
                {submitError}
              </Box>
            ) : null}

            {/* eslint-disable-next-line react/no-unknown-property */}
            <style global jsx>{`
              .form > * + * {
                margin-top: 1rem;
              }
            `}</style>
          </form>
        )
      }}
    />
  )
}

export default Form
