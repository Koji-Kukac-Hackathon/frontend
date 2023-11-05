'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { fetchApi } from '@/lib/api'
import { AuthUser } from '@/lib/api/types'

const RegisterSchema = z
  .object({
    name: z.string().min(1, {
      message: 'Name is required',
    }),

    email: z
      .string()
      .min(3, {
        message: 'Email is required',
      })
      .email('This is not a valid email.'),

    password: z.string().min(8, {
      message: 'Password should contain 8 characters or more',
    }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export default function Register() {
  const router = useRouter()

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof RegisterSchema>) => {
      const response = await fetchApi<{ user: AuthUser }>('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      return response
    },

    onSuccess(data) {
      if (data?.status === 'success') {
        toast({
          title: 'Register success!',
          description: "You're now logged in!",
        })

        router.push('/login')
        return
      }

      toast({
        title: 'Register failed!',
        description: data?.message ?? 'Something went wrong!',
        variant: 'destructive',
      })
    },
  })

  const isLoading = registerMutation.isPending

  function onSubmit(data: z.infer<typeof RegisterSchema>) {
    registerMutation.mutate(data)
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="w-full max-w-md p-8 space-y-4  rounded-xl shadow-md bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <p className="text-center text-gray-600 dark:text-gray-400">Create your account to get started.</p>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="confirmPassword">Repeat Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Pa$$word123" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full select-none" type="submit" disabled={isLoading}>
              Sign Up
            </Button>
          </form>
        </Form>
        <p className="text-center select-none">
          Already have an account?{' '}
          <Link
            className="underline text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            href="/login"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
