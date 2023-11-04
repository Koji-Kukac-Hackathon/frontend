'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Inputs = {
  name: string
  email: string
  password: string
  repeatedPassword: string
}

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSubmit = (data: Inputs) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert(JSON.stringify(data))
    }, 2000)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-xl shadow-md dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <p className="text-center text-gray-600 dark:text-gray-400">Create your account to get started.</p>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="John Doe" required {...register('name', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="john@example.com"
              required
              type="email"
              {...register('email', { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" required type="password" {...register('password', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repeat-password">Repeat Password</Label>
            <Input
              id="repeat-password"
              required
              type="password"
              {...register('repeatedPassword', { required: true })}
            />
          </div>
          <Button className="w-full select-none" type="submit" disabled={isLoading}>
            Sign Up
          </Button>
        </form>
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
