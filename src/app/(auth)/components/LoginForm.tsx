"use client"
import { AuthenticationError, PromiseReturnType } from "blitz"
import Link from "next/link"
import { LabeledTextField } from "src/app/components/LabeledTextField"
import { Form, FORM_ERROR } from "src/app/components/Form"
import login from "../mutations/login"
import { Login } from "../validations"
import { useMutation } from "@blitzjs/rpc"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import type { Route } from "next"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)
  const router = useRouter()
  const next = useSearchParams()?.get("next")
  return (
    <>
      <div className="flex justify-center text-center mt-16">
        <div className="w-1/4 bg-slate-600 py-8 rounded-t-lg">
          <h1 className="text-3xl text-white uppercase font-mono font-bold">Admin Login</h1>
        </div>
      </div>
      <div className="font-bold flex justify-center">
        <div className="w-1/4 p-8 border border-slate-600 rounded-b-lg  flex flex-col justify-center text-center items-center">
          <div>
            <Form
              schema={Login}
              initialValues={{ email: "", password: "" }}
              onSubmit={async (values) => {
                try {
                  await loginMutation(values)
                  router.refresh()
                  if (next) {
                    router.push(next as Route)
                  } else {
                    router.push("/admin/dashboard")
                    router.refresh()
                    console.log("redirecting to dashboard")
                  }
                } catch (error: any) {
                  if (error instanceof AuthenticationError) {
                    return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
                  } else {
                    return {
                      [FORM_ERROR]:
                        "Sorry, we had an unexpected error. Please try again. - " +
                        error.toString(),
                    }
                  }
                }
              }}
            >
              <LabeledTextField name="email" label="Email" placeholder="Email" />
              <LabeledTextField
                name="password"
                label="Password"
                placeholder="Password"
                type="password"
              />
              <div>
                <Link href={"/forgot-password"}>Forgot your password?</Link>
              </div>
              <button className="w-full bg-slate-600 p-4 rounded-md outline-2 shadow-lg hover:bg-slate-500 text-white">
                Login
              </button>
            </Form>
          </div>
        </div>
      </div>

      {/* <div style={{ marginTop: "1rem" }}>
        Or <Link href="/signup">Sign Up</Link>
      </div> */}
    </>
  )
}
