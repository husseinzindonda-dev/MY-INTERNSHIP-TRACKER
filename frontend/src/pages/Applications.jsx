import { useState, useEffect } from "react"
import ApplicationCard from "../components/ApplicationCard"

const API = import.meta.env.VITE_API_URL

function Applications() {
  const [applications, setApplications] = useState([])
  const [newIds, setNewIds] = useState(new Set())
  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [date, setDate] = useState("")
  const [status, setStatus] = useState("Applied")

  useEffect(() => {
    fetch(`${API}/applications`)
      .then(res => res.json())
      .then(data => setApplications(data))
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (!company || !role) return

    fetch(`${API}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, role, date, status })
    })
      .then(res => res.json())
      .then(newApp => {
        setApplications(prev => [newApp, ...prev])
        setNewIds(prev => new Set([...prev, newApp._id]))
        setTimeout(() => setNewIds(prev => {
          const next = new Set(prev)
          next.delete(newApp._id)
          return next
        }), 600)
      })

    setCompany("")
    setRole("")
    setDate("")
    setStatus("Applied")
  }

  function handleDelete(id) {
    fetch(`${API}/applications/${id}`, { method: "DELETE" })
    setApplications(applications.filter(app => app._id !== id))
  }

  function handleStatusChange(id, newStatus) {
    fetch(`${API}/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    })
    setApplications(applications.map(app =>
      app._id === id ? { ...app, status: newStatus } : app
    ))
  }

  return (
    <div>
      {/* FORM */}
      <section
        style={{ background: '#161616', border: '1px solid #1a1a1a', borderRadius: 16 }}
        className="p-8 mb-10"
      >
        <h2 style={{ fontFamily: 'Syne, sans-serif', color: '#e8e0d0', letterSpacing: '-0.3px' }} className="text-xl font-semibold mb-6">
          Track New Application
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
          <input style={{ background: '#1f1f1f', border: '1px solid #2a2a2a', color: '#e8e0d0' }} className="input-field flex-1 min-w-44 rounded-lg px-4 py-3 text-sm" type="text" placeholder="Company name" value={company} onChange={e => setCompany(e.target.value)} />
          <input style={{ background: '#1f1f1f', border: '1px solid #2a2a2a', color: '#e8e0d0' }} className="input-field flex-1 min-w-44 rounded-lg px-4 py-3 text-sm" type="text" placeholder="Role / Position" value={role} onChange={e => setRole(e.target.value)} />
          <input style={{ background: '#1f1f1f', border: '1px solid #2a2a2a', color: '#e8e0d0' }} className="input-field flex-1 min-w-44 rounded-lg px-4 py-3 text-sm" type="date" value={date} onChange={e => setDate(e.target.value)} />
          <select style={{ background: '#1f1f1f', border: '1px solid #2a2a2a', color: '#e8e0d0' }} className="input-field flex-1 min-w-44 rounded-lg px-4 py-3 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
            <option>Applied</option>
            <option>Interview</option>
            <option>Rejected</option>
            <option>Offer</option>
          </select>
          <button type="submit" style={{ background: '#e8e0d0', color: '#0e0e0e' }} className="btn-primary rounded-lg px-8 py-3 text-sm font-semibold cursor-pointer">
            Add Application
          </button>
        </form>
      </section>

      {/* LIST */}
      <section>
        <h2 style={{ fontFamily: 'Syne, sans-serif', color: '#e8e0d0' }} className="text-xl font-semibold mb-6">
          My Applications{" "}
          <span style={{ color: '#333', fontSize: 14, fontFamily: 'DM Sans' }} className="font-normal">
            — {applications.length} total
          </span>
        </h2>
        <ul className="flex flex-col gap-3">
          {applications.map((app, index) => (
            <ApplicationCard
              key={app._id}
              {...app}
              isNew={newIds.has(app._id)}
              loadIndex={index}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </ul>
      </section>
    </div>
  )
}

export default Applications