import { Formik, Form, Field as FormikField } from "formik"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import * as Yup from "yup"
import { useRef, useState } from "react"
import ViewHide from "../svgAsset"
import API_BASE_URL from "@/config"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/constants/const"

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().required("Password is required"),
})

function LoginForm() {
    const [loading, setLoading] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [visible, setVisible] = useState(false)
    const passwordRef = useRef<HTMLInputElement>(null!)
    const navigate = useNavigate()
    const handleSubmit = async (values: { email: string; password: string, remember: string }) => {
        setLoading(true)
        setFormError(null)
        try {
            console.log("Form submitted:", values)
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value);
            });
            let option: any = { method: "POST", body: formData }
            let response = await fetch(`${API_BASE_URL}/login`, option)
            const responseText = await response.text()
            console.log(responseText)
            if (response.status === 200) {
                const { accessToken } = JSON.parse(responseText)
                console.log("Login successful, token:", accessToken)
                await localStorage.setItem("token", accessToken)
                navigate(ROUTES.MOVIES)
            } else {
                setFormError((JSON.parse(responseText))?.message)
            }
        } catch (error) {
            console.error(error)
            setFormError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-[70vh] border rounded-lg p-[5rem] shadow-[0_0_20px_20px_#aca7a7]">
            <h2 className="text-xl font-semibold mb-4 text-center">Login to your account</h2>
            <Formik
                initialValues={{ email: "", password: "", remember: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, isValid, dirty, errors, touched, handleChange, handleBlur }) => (
                    <Form>
                        <FieldGroup>
                            <Field>
                                <div className="relative mb-6">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                        <svg
                                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 16"
                                        >
                                            <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                                            <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                                        </svg>
                                    </div>
                                    <FormikField
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        name="email"
                                        type="email"
                                        value={values.email}
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
                                            <path
                                                fillRule="evenodd"
                                                d="M10 2a4 4 0 0 0-4 4v2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V6a4 4 0 0 0-4-4ZM8 8V6a2 2 0 1 1 4 0v2H8Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <FormikField
                                        innerRef={passwordRef}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        name="password"
                                        type={visible ? "text" : "password"}
                                        value={values.password}
                                        onBlur={handleBlur}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setFormError(null)
                                            handleChange(e)
                                        }}
                                        placeholder="Enter your password"
                                    />
                                    <ViewHide
                                        visible={visible}
                                        setVisible={setVisible}
                                        inputRef={passwordRef}
                                    />
                                </div>
                            </Field>
                        </FieldGroup>
                        <FieldGroup>
                            <Field>
                                <div className="flex items-center mb-6 ml-40">
                                    <FormikField
                                        type="checkbox"
                                        id="remember"
                                        name="remember"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        checked={values.remember}
                                        onBlur={handleBlur}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setFormError(null)
                                            handleChange(e)
                                        }}
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                        Remember me
                                    </label>
                                </div>
                            </Field>
                        </FieldGroup>
                        {(formError ||
                            (Object.keys(errors).length > 0 && Object.keys(touched).length > 0)) && (
                                <div className="mt-4 text-center text-red-500 text-sm">
                                    {formError || (Object.values(errors)[0] as string)}
                                </div>
                            )}
                        <div className="mt-6 flex justify-center gap-4">
                            <Button
                                size="sm"
                                variant="outline"
                                type="submit"
                                disabled={!isValid || !dirty || loading}
                                className="flex items-center gap-2"
                            >
                                {loading ? <Spinner /> : "Login"}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                type="button"
                                className="flex items-center gap-2"
                                onClick={()=>{navigate(ROUTES.REGISTER)}}
                            >
                                Register
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default LoginForm
