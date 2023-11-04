import Link from 'next/link'

import Icon from './Icon'

import { ThemeToggle } from '@/components/ui/ThemeToggler'

export default function Header() {
  return (
    <header className="w-full px-4 lg:px-6 h-20 flex items-center border-b shadow-sm  z-10 bg-white dark:bg-gray-800">
      <Icon icon="logo" size={96} className="bg-black dark:bg-white" />
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link className="text-md font-medium hover:underline underline-offset-4" href="#">
          Features
        </Link>
        <Link className="text-md font-medium hover:underline underline-offset-4" href="#">
          Pricing
        </Link>
        <Link className="text-md font-medium hover:underline underline-offset-4" href="#">
          Contact
        </Link>
      </nav>
      {/* ADD langugage toggler*/}
      {/* <div className="ml-4 lg:ml-6">
        <ThemeToggle />
      </div> */}
      <div className="ml-2 lg:ml-4">
        <ThemeToggle />
      </div>
    </header>
  )
}
