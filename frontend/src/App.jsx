import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, RedirectToSignIn } from '@clerk/clerk-react'

import Home from './pages/Home'

function Dashboard() {
  return <h2>Dashboard (Protected)</h2>
}

function App() {
  return (
    <BrowserRouter>

      {/* Header
      <header style={{ display: "flex", gap: "10px", padding: "20px" }}>
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </header> */}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>

              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App