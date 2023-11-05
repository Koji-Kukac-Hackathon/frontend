import Link from 'next/link'

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="container py-4 flex gap-4 items-center bg-white dark:bg-gray-800 rounded-b-md">
        <h1 className="text-3xl">
          <Link href="/admin/dashboard">Admin Dashboard</Link>
        </h1>

        <Link className="ml-auto" href="/">
          &larr; to site
        </Link>
      </header>

      <main className="container mt-8">{children}</main>
    </>
  )
}
