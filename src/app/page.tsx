'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import { Button } from '@/components/ui/button'

export default function Home() {
  const router = useRouter()

  function handleStartNow() {
    router.push('/login')
  }

  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      <main className="flex w-full h-auto gap-8 justify-between items-center py-8 md:py-16 lg:py-24 px-8 md:px-16 lg:px-24">
        <section key="1" className="w-full h-full lg:w-[60%]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Find and Reserve Parking Spots with Ease
              </h2>
              <br />
              <p className="max-w-[600px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400">
                Our platform allows you to find the closest parking spots near your destination. You can reserve in
                advance, filter by price, distance, and parking spot type.
              </p>
            </div>
            <ul className="grid gap-2 py-4">
              <li>
                <svg
                  className=" mr-2 inline-block h-4 w-4"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Find the closest parking spots near your destination.
              </li>
              <li>
                <svg
                  className=" mr-2 inline-block h-4 w-4"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Reserve parking spots in advance.
              </li>
              <li>
                <svg
                  className=" mr-2 inline-block h-4 w-4"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Filter by price, distance, and parking spot type.
              </li>
            </ul>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                onClick={() => handleStartNow()}
                className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
              >
                Start Now
              </Button>
              <Button className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-white dark:bg-gray-800 px-8 text-sm font-medium shadow-sm transition-colors text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-800  dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-300">
                Learn More
              </Button>
            </div>
          </div>
        </section>
        <div className=" hidden lg:block">
          <Image
            src="/assets/images/karta.jpeg"
            className="rounded-xl shadow-xl"
            height={100}
            width={400}
            alt="Screenshot of our app"
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
