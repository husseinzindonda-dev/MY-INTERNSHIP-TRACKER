import { useState, useEffect } from "react"

const API = import.meta.env.VITE_API_URL

function Profile({ onProfileSaved }) {
  const [bio, setBio] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [saved, setSaved] = useState(false)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`${API}/profile`)
      .then(res => res.json())
      .then(data => {
        if (data.bio) {
          setBio(data.bio)
          onProfileSaved(data.bio)
        }
      })
  }, [])

  async function handleParseResume() {
    if (!resumeText) return
    setLoading(true)
    try {
      const res = await fetch(`${API}/parse-resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText })
      })
      const data = await res.json()
      if (data.bio) {
        setBio(data.bio)
        onProfileSaved(data.bio)
        setResumeText("")
        setOpen(true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleSave() {
    fetch(`${API}/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio })
    }).then(() => {
      setSaved(true)
      onProfileSaved(bio)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <section
      style={{ background: '#161616', border: '1px solid #1a1a1a', borderRadius: 16 }}
      className="p-8 mb-10"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', color: '#e8e0d0', letterSpacing: '-0.3px' }} className="text-xl font-semibold">
            My Profile
          </h2>
          <p style={{ color: '#444', fontSize: 13 }} className="mt-1">
            {bio ? "Profile saved — used automatically for match scoring" : "Paste your resume and AI will generate your profile"}
          </p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          style={{ background: '#1f1f1f', color: '#888', border: '1px solid #2a2a2a', borderRadius: 8, padding: '6px 16px', fontSize: 12, cursor: 'pointer' }}
          className="btn-delete"
        >
          {open ? "Collapse ↑" : "Edit ↓"}
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <label style={{ color: '#555', fontSize: 12, letterSpacing: '0.5px' }} className="uppercase">
          Paste Resume Text
        </label>
        <textarea
          className="input-field rounded-lg px-4 py-3 text-sm resize-none"
          style={{ background: '#1f1f1f', border: '1px solid #2a2a2a', color: '#e8e0d0', minHeight: 140 }}
          placeholder="Paste your full resume text here — AI will extract your profile automatically..."
          value={resumeText}
          onChange={e => setResumeText(e.target.value)}
        />
        <button
          onClick={handleParseResume}
          disabled={loading || !resumeText}
          className="btn-primary rounded-lg px-8 py-3 text-sm font-semibold cursor-pointer self-start"
          style={{ background: '#e8e0d0', color: '#0e0e0e', opacity: loading || !resumeText ? 0.5 : 1 }}
        >
          {loading ? "Generating profile..." : "Generate Profile with AI →"}
        </button>
      </div>

      {open && bio && (
        <div className="mt-6 flex flex-col gap-4 card-enter" style={{ borderTop: '1px solid #1a1a1a', paddingTop: 24 }}>
          <label style={{ color: '#555', fontSize: 12, letterSpacing: '0.5px' }} className="uppercase">
            Your Generated Profile — edit if needed
          </label>
          <textarea
            className="input-field rounded-lg px-4 py-3 text-sm resize-none"
            style={{ background: '#1f1f1f', border: '1px solid #2a2a2a', color: '#e8e0d0', minHeight: 140 }}
            value={bio}
            onChange={e => setBio(e.target.value)}
          />
          <button
            onClick={handleSave}
            className="btn-primary rounded-lg px-8 py-3 text-sm font-semibold cursor-pointer self-start"
            style={{ background: saved ? '#1a2e1e' : '#e8e0d0', color: saved ? '#6bdf8f' : '#0e0e0e' }}
          >
            {saved ? "✓ Saved" : "Save Profile"}
          </button>
        </div>
      )}
    </section>
  )
}
