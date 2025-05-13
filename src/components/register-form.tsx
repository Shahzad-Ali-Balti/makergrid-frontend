import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import placeholderImage from "@/assets/MakerGrid_Blue_Background.jpg"
import { z } from "zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import ShieldButton from '@/components/ShieldButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Loader2 } from "lucide-react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import axiosInstance from "@/lib/axiosInstance"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useLocation } from "wouter"
import * as motion from "motion/react-client"

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const { toast } = useToast()
  const [, setLocation] = useLocation()

  const [showOtpInput, setShowOtpInput] = useState(false)
  const [emailForOtp, setEmailForOtp] = useState("")
  const [otp, setOtp] = useState("")

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    setIsLoading(true)
    try {
      const res = await axiosInstance.post("/api/accounts/signup/", data)
      setIsLoading(false)
      if (res.data?.success) {
        setEmailForOtp(data.email)
        setShowOtpInput(true)
      } else {
        toast({
          title: "Unexpected response.",
          description: "Please check your email or try again.",
          variant: "destructive",
        })
      }
    } catch (e) {
      setIsLoading(false)
      toast({
        title: "An error occurred.",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleOtpSubmit = async () => {
    setIsVerifyingOtp(true)
    try {
      const res = await axiosInstance.post("/api/accounts/verify-otp/", {
        email: emailForOtp,
        otp,
      })

      if (res.data?.success) {
        toast({
          title: "Account verified!",
          description: "Redirecting you to login...",
        })
        setTimeout(() => setLocation("/login"), 3000)
      }
    } catch (e: any) {
      toast({
        title: "OTP verification failed.",
        description: e.response?.data?.detail || "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: "anticipate" }}
    >
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="p-4 md:p-6"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Get started</h1>
                    <p className="text-balance text-muted-foreground">
                      Create a new account to get started.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="john_doe" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="m@example.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <ShieldButton
                    type="submit"
                    className="w-full text-[--gold-default]"
                    variant="secondary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Registering
                      </div>
                    ) : (
                      "Register"
                    )}
                  </ShieldButton>

                  <div className="text-center text-sm ">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="underline underline-offset-4 text-[--gold-default]"
                    >
                      Sign in
                    </a>
                  </div>
                </div>
              </form>
            </Form>
            <div className="relative hidden bg-muted md:block ">
              <img
                src={placeholderImage}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </CardContent>
        </Card>

        {/* OTP Dialog */}
        {showOtpInput && (
          <Dialog open={showOtpInput} onOpenChange={setShowOtpInput}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Verify OTP</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4 mt-2">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSeparator />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <ShieldButton onClick={handleOtpSubmit} className="w-full" disabled={isVerifyingOtp}>
                  {isVerifyingOtp ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying
                    </div>
                  ) : (
                    "Verify OTP"
                  )}
                </ShieldButton>

              </div>
            </DialogContent>
          </Dialog>
        )}

        <div className="text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <a
            href="#"
            className="text-[--gold-default] hover:underline transition-all duration-150"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-[--gold-default] hover:underline transition-all duration-150"
          >
            Privacy Policy
          </a>.
        </div>
      </div>
    </motion.div>
  )
}
