import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Applications from "./pages/Applications"
import Skills from "./pages/Skills"
import Profile from "./components/Profile"
import MatchScorer from "./components/MatchScorer"
import { useState } from "react"

function NavLink({ to, children }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      style={{
        color: isActive ? '#e8e0d0' : '#444',
        fontSize: 13,
        letterSpacing: '0.5px',
        textDecoration: 'none',
        borderBottom: isActive ? '1px solid #e8e0d0' : '1px solid transparent',
        paddingBottom: 2,
        transition: 'all 0.2s'
      }}
      className="uppercase"
    >
      {children}
    </Link>
  )
}

function Layout() {
  const [userProfile, setUserProfile] = useState("")

  return (
    <div className="min-h-screen text-gray-100" style={{ background: '#0e0e0e' }}>

      {/* HEADER */}
      <header style={{ borderBottom: '1px solid #1a1a1a' }} className="px-10 py-5 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div style={{ background: '#e8e0d0', width: 8, height: 8, borderRadius: '50%' }}></div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', color: '#e8e0d0', letterSpacing: '-0.5px' }} className="text-lg font-bold">
            Internship Tracker
          </h1>
        </div>
        <nav className="flex gap-8">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/applications">Applications</NavLink>
          <NavLink to="/skills">Skills</NavLink>
        </nav>
      </header>

      {/* PAGE CONTENT */}
      <main className="max-w-4xl mx-auto mt-12 px-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/skills" element={
            <div>
              <Profile onProfileSaved={setUserProfile} />
              <MatchScorer userProfile={userProfile} />
              <Skills />
            </div>
          } />
        </Routes>
      </main>

    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App