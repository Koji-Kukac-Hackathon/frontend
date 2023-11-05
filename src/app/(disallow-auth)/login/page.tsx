'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import Icon from '@/components/Icon'
import { useSetAuthState } from '@/components/providers/all/AuthProvider.client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { fetchApi } from '@/lib/api'
import { AUTH_TOKEN_COOKIE_NAME } from '@/lib/api/auth.common'
import { AuthUser } from '@/lib/api/types'

const LoginSchema = z.object({
  email: z.string().min(1, {
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
})

export default function Login() {
  const router = useRouter()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const setAuthState = useSetAuthState()

  const loginMutation = useMutation({
    mutationFn: async (data: z.infer<typeof LoginSchema>) => {
      const response = await fetchApi<{ user: AuthUser; token: string }>('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          provider: 'credentials',
        }),
      })

      return response
    },

    onSuccess(response) {
      if (response?.status === 'success') {
        setAuthState(response.data.user)
        document.cookie = `${AUTH_TOKEN_COOKIE_NAME}=${response.data.token}; path=/; max-age=${60 * 60 * 24 * 7}`

        toast({
          title: 'Login success!',
          description: "You're now logged in!",
        })

        router.push('/find')

        return
      }

      toast({
        title: 'Login failed!',
        description: response?.message ?? 'Something went wrong!',
        variant: 'destructive',
      })
    },
  })

  const isLoading = loginMutation.isPending

  function onSubmit(data: z.infer<typeof LoginSchema>) {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    })
  }

  return (
    <div className="w-full h-full flex justify-between ">
      <div className="hidden h-full lg:w-[55%] xl:w-[50%] lg:flex items-center justify-center bg-zinc-100  dark:bg-zinc-900 relative">
        <Link href="/">
          <Icon icon="logo-full" size={500} className="bg-black dark:bg-white" />
        </Link>
      </div>
      <main className="flex w-full lg:w-[45%] xl:w-[50%] px-4 lg:px-0 h-full items-center justify-center py-12 bg-white dark:bg-gray-800">
        <Form {...form}>
          <form className="mx-auto w-[350px]" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Sign in</h1>
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
