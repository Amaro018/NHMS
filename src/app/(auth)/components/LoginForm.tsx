"use client"
import { AuthenticationError, PromiseReturnType } from "blitz"
import Link from "next/link"
import Image from "next/image"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header band */}
          <div className="bg-slate-700 px-8 py-6 flex flex-col items-center gap-3">
            <Image src="/logo3.png" alt="NHMS Logo" width={64} height={64} className="rounded-lg" />
            <div className="text-center">
              <h1 className="text-white text-xl font-bold tracking-wide">NHMS</h1>
              <p className="text-slate-300 text-xs mt-0.5">Nagsiya Health Monitoring System</p>
            </div>
          </div>

          {/* Form body */}
          <div className="px-8 py-8">
            <h2 className="text-slate-700 text-lg font-semibold mb-6">Sign in to your account</h2>

            <Form
              schema={Login}
              initialValues={{ email: "", password: "" }}
              onSubmit={async (values) => {
                try {
                  await loginMutation(values)
                  router.refresh()
                  router.push(next ? (next as Route) : "/admin")
                } catch (error: any) {
                  if (error instanceof AuthenticationError) {
                    return { [FORM_ERROR]: "Invalid email or password." }
                  }
                  return {
                    [FORM_ERROR]: "An unexpected error occurred. Please try again.",
                  }
                }
              }}
            >
              <LabeledTextField
                name="email"
                label="Email address"
                placeholder="admin@example.com"
                type="email"
              />
              <LabeledTextField
                name="password"
                label="Password"
                placeholder="••••••••"
                type="password"
              />

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2 shadow-sm"
              >
                Sign In
              </button>
            </Form>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          &copy; {new Date().getFullYear()} Brgy. Nagsiya &mdash; NHMS
        </p>
      </div>
    </div>
  )
}
