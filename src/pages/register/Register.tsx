import { Formik, Form, Field as FormikField } from "formik"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import * as Yup from "yup"
import { useRef, useState } from "react"
import { ROUTES } from "@/constants/const"
import ViewHide from "../svgAsset"
import { useNavigate } from "react-router-dom"

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    password: Yup.string()
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), undefined], "Passwords must match")
        .required("Confirm Password is required"),
})

function Register() {
    const API_BASE = import.meta.env.VITE_API_BASE_URL as string
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const passwordRef = useRef<HTMLInputElement>(null!)
    const navigate = useNavigate();

    const handleSubmit = async (values: { name: string; email: string; password: string; confirmPassword: string }) => {
        setLoading(true)
        setFormError(null)
        try {
            console.log("Form submitted:", values)
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value);
            });
            let option: any = { method: "POST", body: formData }
            let response = await fetch(API_BASE + "/register", option)
            const responseText = await response.text()
            console.log(responseText)
            if (response.status === 200) {
                navigate(ROUTES.HOME)
            } else {
                setFormError(JSON.parse(responseText).message)
            }
        } catch (error) {
            console.error(error)
            setFormError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-[70vh] border-[0.1rem] rounded-[0.5rem] p-[5rem] shadow-[0_0_20px_20px_#aca7a7]">
            <h2 className="text-xl font-semibold mb-4 text-center">Login to your account</h2>
            <Formik
                initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, isValid, dirty, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                    <Form>
                        <FieldGroup>
                            <Field>
                                <div className="relative mb-6">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                            <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                                            <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                                        </svg>
                                    </div>
                                    <FormikField
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        id="name input-group-1"
                                        name="name"
                                        type="name"
                                        value={values.name}
                                        autocomplete
                                        onBlur={handleBlur}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setFormError(null)
                                            handleChange(e)
                                        }}
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </Field>
                        </FieldGroup>
                        <FieldGroup>
                            <Field>
                                <div className="relative mb-6">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                            <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                                            <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                                        </svg>
                                    </div>
                                    <FormikField
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        id="email input-group-1"
                                        name="email"
                                        type="email"
                                        value={values.email}
                                        autocomplete
                                        onBlur={handleBlur}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setFormError(null)
                                            handleChange(e)
                                        }}
                                        placeholder="m@example.com"
                                    />
                                </div>
                            </Field>
                        </FieldGroup>
                        <FieldGroup>
                            <Field>
                                <div className="relative mb-6">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                        <svg
                                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            aria-hidden="true"
                                        >
                                            <path fillRule="evenodd" d="M10 2a4 4 0 0 0-4 4v2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V6a4 4 0 0 0-4-4ZM8 8V6a2 2 0 1 1 4 0v2H8Z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <FormikField
                                        className="block w-full rounded-md border border-gray-300 bg-gray-50 px-10 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                                        id="password"
                                        name="password"
                                        innerRef={passwordRef}
                                        type={visible ? "text" : "password"}
                                        value={values.password}
                                        onBlur={handleBlur}
                                        autocomplete
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setFormError(null)
                                            handleChange(e)
                                        }}
                                        placeholder="Enter your password"
                                    />
                                    <ViewHide visible={visible} setVisible={setVisible} inputRef={passwordRef} />
                                </div>
                            </Field>
                        </FieldGroup>
                        <FieldGroup>
                            <Field>
                                <div className="relative mb-6">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                        <svg
                                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            aria-hidden="true"
                                        >
                                            <path fillRule="evenodd" d="M10 2a4 4 0 0 0-4 4v2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V6a4 4 0 0 0-4-4ZM8 8V6a2 2 0 1 1 4 0v2H8Z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <FormikField
                                        className="block w-full rounded-md border border-gray-300 bg-gray-50 px-10 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={visible ? "text" : "password"}
                                        value={values.confirmPassword}
                                        onBlur={handleBlur}
                                        autocomplete
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setFormError(null)
                                            handleChange(e)
                                        }}
                                        placeholder="Confirm password"
                                    />
                                    <div className="absolute inset-y-0 start-75 flex items-center ps-3.5 pointer-events-none">
                                        {/* <svg className="shrink-0 size-3.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path className="hs-password-active:hidden" d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                            <path className="hs-password-active:hidden" d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                            <path className="hs-password-active:hidden" d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                            <line className="hs-password-active:hidden" x1="2" x2="22" y1="2" y2="22"></line>
                                            <path className="hidden hs-password-active:block" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                            <circle className="hidden hs-password-active:block" cx="12" cy="12" r="3"></circle>
                                        </svg> */}
                                    </div>
                                </div>
                            </Field>
                        </FieldGroup>
                        {(formError ||
                            (Object.keys(errors).length > 0 && Object.keys(touched).length > 0)) && (
                                <div className="mt-4 text-center text-red-500 text-sm">
                                    {formError
                                        ? formError
                                        : Object.values(errors)[0] as string}
                                </div>
                            )}
                        <div className="mt-6 flex justify-center gap-4">
                            <Button
                                size="sm"
                                variant="outline"
                                type="button"
                                className="flex items-center gap-2"
                                onClick={() => { navigate(ROUTES.HOME) }}
                            >
                                Login
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                type="submit"
                                disabled={!isValid || !dirty || loading}
                                className="flex items-center gap-2"
                            >
                                {loading ? <Spinner /> : "Register"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div >
    )
}

export default Register
