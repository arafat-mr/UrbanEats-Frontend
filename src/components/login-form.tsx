'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import * as z from "zod"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type Props = React.ComponentProps<"div">

export function LoginForm({ className, ...props }: Props) {
  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Logging in...")
      try {
        const res = await fetch("https://urban-eats-backend.vercel.app/api/auth/sign-in/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
          credentials: "include", // include cookies/session if backend sets any
        })

        const data = await res.json()

        if (!res.ok) {
          toast.error(data?.message || "Login failed", { id: toastId })
          return
        }

        toast.success("Logged in successfully", { id: toastId })
        
        window.location.href = "/" 
      } catch (err) {
        toast.error("Internal server error", { id: toastId })
        console.error(err)
      }
    },
  })

  const handleGoogleLogin = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:3000",
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="login-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.Field name="email">
                {(field) => (
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel>Password</FieldLabel>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              <Field>
                <Button form="login-form" type="submit">
                  Login
                </Button>

                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  type="button"
                  className="mt-2"
                >
                  Login with Google
                </Button>

                <FieldDescription className="text-center mt-2">
                  Don&apos;t have an account? <Link href="/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
