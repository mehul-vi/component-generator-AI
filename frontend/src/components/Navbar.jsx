import React, { useState } from 'react'
import { FaUser, FaBars, FaTimes } from 'react-icons/fa'
import { HiSun } from 'react-icons/hi'
import { RiSettings3Fill } from 'react-icons/ri'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useUser,
  useClerk,
  UserButton
} from '@clerk/clerk-react'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
  const { user } = useUser()
  const { signOut } = useClerk()
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-gray-200 dark:border-white/10 transition-colors duration-300">

      <div className="flex items-center justify-between px-6 md:px-16 h-[80px] text-gray-800 dark:text-white transition-colors duration-300">

        {/* Logo */}
        <h3 className="text-[22px] md:text-[26px] font-[800] 
        bg-gradient-to-r from-purple-400 to-pink-500 
        bg-clip-text text-transparent">
          Component
        </h3>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-8">

          {/* Theme Toggle */}
          <div className="relative group flex items-center justify-center">
            <HiSun onClick={toggleTheme} className="text-xl cursor-pointer text-gray-500 hover:text-yellow-500 dark:text-gray-300 dark:hover:text-yellow-400 transition hover:scale-110" />
            <span className="absolute top-10 scale-0 transition-all rounded-md bg-gray-800 dark:bg-white p-2 text-xs text-white dark:text-gray-800 font-medium group-hover:scale-100 whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 z-50">
              {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </span>
          </div>

          {/* Settings */}
          <div className="relative group flex items-center justify-center">
            <RiSettings3Fill onClick={() => document.querySelector('.cl-userButtonTrigger')?.click()} className="text-xl cursor-pointer text-gray-500 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition hover:scale-110" />
            <span className="absolute top-10 scale-0 transition-all rounded-md bg-gray-800 dark:bg-white p-2 text-xs text-white dark:text-gray-800 font-medium group-hover:scale-100 whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 z-50">
              Manage Settings
            </span>
          </div>

          <SignedIn>
            <div className="relative group flex flex-col items-center">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 ring-2 ring-purple-500/40 transition hover:scale-110"
                  }
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Action label="signOut" />
                </UserButton.MenuItems>
              </UserButton>
              <span className="absolute top-12 scale-0 transition-all rounded-md bg-gray-800 dark:bg-white p-2 text-xs text-white dark:text-gray-800 font-medium group-hover:scale-100 whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 z-50">
                Profile Options
              </span>
            </div>
          </SignedIn>

          <SignedOut>
            <div className="relative group flex flex-col items-center">
              <SignInButton mode="modal">
                <div className="flex flex-col items-center cursor-pointer transition hover:scale-110 text-gray-600 dark:text-white">
                  <FaUser className="text-xl" />
                </div>
              </SignInButton>
              <span className="absolute top-10 scale-0 transition-all rounded-md bg-gray-800 dark:bg-white p-2 text-xs text-white dark:text-gray-800 font-medium group-hover:scale-100 whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 z-50">
                Login
              </span>
            </div>
          </SignedOut>

        </div>

        {/* Mobile Menu Button */}
        <div
          className="md:hidden text-xl cursor-pointer text-gray-800 dark:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-black/95 border-t border-gray-200 dark:border-white/10 px-6 py-6 flex flex-col gap-6 text-gray-800 dark:text-white transition-colors duration-300">

          <div
            onClick={() => { toggleTheme(); setMenuOpen(false); }}
            className="flex items-center gap-3 cursor-pointer text-gray-600 hover:text-yellow-500 dark:text-gray-300 dark:hover:text-yellow-400 transition"
          >
            <HiSun className="text-xl" />
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </div>

          <div
            onClick={() => { document.querySelector('.cl-userButtonTrigger')?.click(); setMenuOpen(false); }}
            className="flex items-center gap-3 cursor-pointer text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition"
          >
            <RiSettings3Fill className="text-xl" />
            <span>Settings</span>
          </div>

          <SignedIn>
            <div className="flex items-center gap-3 border-t border-white/10 pt-4 mt-2">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8"
                  }
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Action label="signOut" />
                </UserButton.MenuItems>
              </UserButton>
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                Login
              </button>
            </SignInButton>
          </SignedOut>

        </div>
      )
      }

    </div >
  )
}

export default Navbar