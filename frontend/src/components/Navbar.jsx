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
  useAuth
} from '@clerk/clerk-react'

const Navbar = () => {
  const { user } = useUser()
  const { signOut } = useClerk()
  const { getToken } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  // 🔥 DEBUG TOKEN FUNCTION
  const printToken = async () => {
    const token = await getToken()
    console.log("CLERK TOKEN:", token)
  }

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-black/70 border-b border-white/10">

      <div className="flex items-center justify-between px-6 md:px-16 h-[80px] text-white">

        {/* Logo */}
        <h3 className="text-[22px] md:text-[26px] font-[800] 
        bg-gradient-to-r from-purple-400 to-pink-500 
        bg-clip-text text-transparent">
          Component
        </h3>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-8">

          <HiSun className="text-xl cursor-pointer hover:text-yellow-400 transition hover:scale-110" />
          <RiSettings3Fill className="text-xl cursor-pointer hover:text-purple-400 transition hover:scale-110" />

          {/* 🔥 Debug Button (Temporary) */}
          <SignedIn>
            <button
              onClick={printToken}
              className="text-xs text-gray-400 hover:text-white"
            >
              Token
            </button>
          </SignedIn>

          {/* User Section */}
          <div className="relative group flex flex-col items-center">

            <SignedIn>
              <img
                src={user?.imageUrl}
                alt="profile"
                className="w-9 h-9 rounded-full object-cover cursor-pointer transition hover:scale-110 ring-2 ring-purple-500/40"
              />

              <button
                onClick={() => signOut()}
                className="absolute top-full mt-2 text-xs opacity-0 
                group-hover:opacity-100 transition-all duration-200 
                bg-black/80 px-3 py-1 rounded-md 
                border border-red-500/30 text-red-400"
              >
                Logout
              </button>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <div className="flex flex-col items-center cursor-pointer transition hover:scale-110">
                  <FaUser className="text-xl" />
                </div>
              </SignInButton>
            </SignedOut>

          </div>
        </div>

        {/* Mobile Menu Button */}
        <div
          className="md:hidden text-xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/10 px-6 py-6 flex flex-col gap-6 text-white">

          <HiSun className="text-xl cursor-pointer hover:text-yellow-400 transition" />
          <RiSettings3Fill className="text-xl cursor-pointer hover:text-purple-400 transition" />

          <SignedIn>
            <button
              onClick={printToken}
              className="text-gray-400 text-sm"
            >
              Print Token
            </button>

            <div className="flex items-center gap-3">
              <img
                src={user?.imageUrl}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <button
                onClick={() => signOut()}
                className="text-red-400 text-sm"
              >
                Logout
              </button>
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-purple-400 text-sm">
                Login
              </button>
            </SignInButton>
          </SignedOut>

        </div>
      )}

    </div>
  )
}

export default Navbar