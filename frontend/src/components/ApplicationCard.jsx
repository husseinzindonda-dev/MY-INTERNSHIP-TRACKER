import { useState } from "react"

const statusColors = {
  "Applied":   { bg: "#1a1f2e", color: "#6b9fff" },
  "Interview": { bg: "#1a2e1e", color: "#6bdf8f" },
  "Rejected":  { bg: "#2e1a1a", color: "#df6b6b" },
  "Offer":     { bg: "#2e2a1a", color: "#dfcc6b" }
}

function ApplicationCard({ _id, company, role, date, status, onDelete, onStatusChange, isNew, loadIndex }) {
  const [exiting, setExiting] = useState(false)
  const colors = statusColors[status] || { bg: "#1f1f1f", color: "#aaa" }

  function handleDelete() {
    setExiting(true)
    setTimeout(() => onDelete(_id), 280)
  }

  const animClass = exiting ? "card-exit" : isNew ? "card-enter" : "card-load"
  const delay = exiting || isNew ? 0 : loadIndex * 80

  return (
    <li
      className={`px-7 py-5 flex justify-between items-center hover:border-gray-600 transition-colors ${animClass}`}
      style={{
        background: '#161616',
        border: '1px solid #222',
        borderRadius: 14,
        animationDelay: `${delay}ms`,
      }}
    >
      {/* LEFT */}
      <div className="flex flex-col gap-1 w-48">
        <span style={{ fontFamily: 'Syne, sans-serif', color: '#e8e0d0', fontSize: 16, fontWeight: 600 }}>{company}</span>
        <span style={{ color: '#555', fontSize: 13 }}>{role}</span>
      </div>

      {/* DATE */}
      <span style={{ color: '#3a3a3a', fontSize: 12 }}>{date}</span>

      {/* STATUS */}
      <select
        value={status}
        onChange={e => onStatusChange(_id, e.target.value)}
        style={{ background: colors.bg, color: colors.color, border: 'none', borderRadius: 20, fontSize: 11, fontWeight: 600, padding: '4px 14px', cursor: 'pointer' }}
      >
        <option>Applied</option>
        <option>Interview</option>
        <option>Rejected</option>
        <option>Offer</option>
      </select>

      {/* DELETE */}
      <button
        onClick={handleDelete}
        className="btn-delete"
        style={{ background: '#1f1f1f', color: '#555', border: '1px solid #2a2a2a', borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer' }}
      >
        Delete
      </button>
    </li>
  )
}

export default ApplicationCard