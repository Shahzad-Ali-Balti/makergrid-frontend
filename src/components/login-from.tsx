import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
// import placeholderImage from "@/assets/MakerGrid_Blue_Background.jpg"
// import placeholderImage from "@/public/assets/logo.jpg";
import placeholderImage from '@assets/MakerGrid_Blue_Background.jpg'
import * as motion from "motion/react-client"
import { z } from "zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useLocation } from "wouter"
import axiosInstance from "@/lib/axiosInstance"
import { useAuth } from "@/hooks/use-auth"
import ShieldButton from '@/components/ShieldButton';
import { Loader2 } from "lucide-react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const FormSchema = z.object({
  username: z.string().min(3, {
    message: "Please enter a valid username.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const [, setLocation] = useLocation()

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async data => {
    try {
      setIsLoading(true)
      const res = await axiosInstance.post("/api/accounts/login/", data, {
        withCredentials: true,
      })

      const accessToken = res.data.access
      const user = res.data.user
      console.log('user' , user)

      login(user, accessToken)
      setTimeout(() => {
        setLocation("/dashboard")
      }, 50)

      toast({ title: "Login successful!" })
    } catch (e) {
      console.error(e)
      setIsLoading(false)
      toast({
        title: "Login failed.",
        description: "Please check your credentials.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: "anticipate" }}
    >
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden border-none rounded border-[2px]">
          <CardContent className="grid p-0 md:grid-cols-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome</h1>
                    <p className="text-balance text-muted-foreground">
                      Login to your MakerGrid account
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
                        Logging In
                      </div>
                    ) : (
                      "Login"
                    )}
                  </ShieldButton>





                  <div className="text-center text-sm">
                    Create a new account?{" "}
                    <a href="/register" className="underline underline-offset-4 text-[--gold-default]">
                      Register now
                    </a>
                  </div>
                </div>
              </form>
            </Form>
            <div className="relative hidden bg-muted md:block">
              <img
                src={placeholderImage}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground hover:[&_a]:text-primary">
          By clicking continue, you agree to our{" "}
          <a href="#" className="text-[--gold-default] hover:underline transition-all duration-150">Terms of Service</a> and <a href="#" className="text-[--gold-default] hover:underline transition-all duration-150">Privacy Policy</a>.
        </div>
      </div>
    </motion.div >
  )
}
