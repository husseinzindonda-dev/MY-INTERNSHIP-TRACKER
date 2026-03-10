import { useState } from "react"

function MatchScorer({userProfile}) {
  const [jobDescription, setJobDescription] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleMatch() {
    if (!jobDescription || !userProfile) return
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("https://internship-tracker-backend-yvgs.onrender.com/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, userProfile })
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const scoreColor =
    result?.score >= 70 ? "#6bdf8f" :
    result?.score >= 40 ? "#dfcc6b" : "#df6b6b"

  return (
    <section
      style={{ background: '#161616', border: '1px solid #1a1a1a', borderRadius: 16 }}
      className="p-8 mb-10"
    >
      <h2 style={{ fontFamily: 'Syne, sans-serif', color: '#e8e0d0', letterSpacing: '-0.3px' }} className="text-xl font-semibold mb-2">
        Match Scorer
      </h2>
      <p style={{ color: '#444', fontSize: 13 }} className="mb-6">
        Paste a job description and your profile to get a predicted match score
      </p>

      <div className="flex flex-col gap-4">

        {/* JOB DESCRIPTION */}
        <div className="flex flex-col gap-2">
          <label style={{ color: '#555', fontSize: 12, letterSpacing: '0.5px' }} className="uppercase">
            Job Description
          </label>
          <textarea
            className="input-field rounded-lg px-4 py-3 text-sm resize-none"
            style={{ background: '#1f1f1f', border: '1px solid #2a2a2a', color: '#e8e0d0', minHeight: 120 }}
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
          />
        </div>

        {!userProfile && (
            <p style={{ color: '#df6b6b', fontSize: 12 }}>
                ⚠ No profile found — add your profile above first
            </p>
        )}
        {/* BUTTON */}
        <button
          onClick={handleMatch}
          disabled={loading}
          className="btn-primary rounded-lg px-8 py-3 text-sm font-semibold cursor-pointer self-start"
          style={{ background: '#e8e0d0', color: '#0e0e0e', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Analyzing..." : "Analyze Match →"}
        </button>
      </div>

      {/* RESULTS */}
      {result && (
        <div
          className="mt-8 card-enter"
          style={{ borderTop: '1px solid #1a1a1a', paddingTop: 28 }}
        >

          {/* SCORE */}
          <div className="flex items-center gap-6 mb-6">
            <div
              style={{ width: 80, height: 80, borderRadius: '50%', border: `3px solid ${scoreColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <span style={{ fontFamily: 'Syne, sans-serif', color: scoreColor, fontSize: 22, fontWeight: 700 }}>
                {result.score}
              </span>
            </div>
            <p style={{ color: '#888', fontSize: 14, lineHeight: 1.6 }}>{result.summary}</p>
          </div>

          {/* STRENGTHS & GAPS */}
          <div className="flex gap-6 mb-6">

            <div className="flex-1">
              <p style={{ color: '#6bdf8f', fontSize: 11, fontWeight: 600, letterSpacing: '0.5px' }} className="uppercase mb-3">
                Strengths
              </p>
              <ul className="flex flex-col gap-2">
                {result.strengths.map((s, i) => (
                  <li key={i} style={{ color: '#666', fontSize: 13, paddingLeft: 12, borderLeft: '2px solid #1a2e1e' }}>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1">
              <p style={{ color: '#df6b6b', fontSize: 11, fontWeight: 600, letterSpacing: '0.5px' }} className="uppercase mb-3">
                Gaps
              </p>
              <ul className="flex flex-col gap-2">
                {result.gaps.map((g, i) => (
                  <li key={i} style={{ color: '#666', fontSize: 13, paddingLeft: 12, borderLeft: '2px solid #2e1a1a' }}>
                    {g}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* ADVICE */}
          <div
            style={{ background: '#1f1f1f', border: '1px solid #2a2a2a', borderRadius: 10, padding: '14px 18px' }}
          >
            <p style={{ color: '#dfcc6b', fontSize: 11, fontWeight: 600, letterSpacing: '0.5px' }} className="uppercase mb-2">
              Top Advice
            </p>
            <p style={{ color: '#888', fontSize: 13, lineHeight: 1.6 }}>{result.advice}</p>
          </div>

        </div>
      )}

    </section>
  )
}

export default MatchScorer