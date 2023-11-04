import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Login() {
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
      <div className="flex h-full items-center justify-center py-12">
        <div className="mx-auto w-[350px]">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Enter your email and password to login</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="me@example.com" required type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="Pa$$word123" required type="password" />
            </div>
            <Button className="w-full" type="submit">
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link
              className="underline  text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              href="/register"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
