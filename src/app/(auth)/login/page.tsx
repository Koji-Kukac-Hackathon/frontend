'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'

const LoginSchema = z.object({
  email: z.string().min(1, {
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
})

export default function Login() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)

  function onSubmit(data: z.infer<typeof LoginSchema>) {
    setIsLoading(true)
    setTimeout(() => {
      toast({
        title: 'You submitted the following values:',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="w-full h-full lg:grid lg:min-h-[600px] lg:grid-cols-2 ">
      <div className="hidden bg-zinc-100 lg:block dark:bg-zinc-800">
        <img
          alt="Car Logo"
          className="h-full w-full object-cover"
          height="512"
          src="/placeholder.svg"
          style={{
            aspectRatio: '512/512',
            objectFit: 'cover',
          }}
          width="512"
        />
      </div>
      <main className="flex h-full items-center justify-center py-12">
        <Form {...form}>
          <form className="mx-auto w-[350px]" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-zinc-500 dark:text-zinc-400">Enter your email and password to login.</p>
              <br />
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="me@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Pa$$word123" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full select-none" type="submit" disabled={isLoading}>
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm select-none">
              Don't have an account?{' '}
              <Link
                className="underline  text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                href="/register"
              >
                Sign up
              </Link>
            </div>
          </form>
        </Form>
      </main>
    </div>
  )
}
