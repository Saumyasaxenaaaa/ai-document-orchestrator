import React, { useState } from 'react'
import axios from 'axios'

export default function App() {
  const [file, setFile] = useState(null)
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const apiUrl = import.meta.env.VITE_API_URL || ''

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) return alert('Select a file')
    setLoading(true)
    const fd = new FormData()
    fd.append('document', file)
    fd.append('question', question)

    try {
      const resp = await axios.post(`${apiUrl}/api/upload`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(resp.data)
    } catch (err) {
      setResult({ error: err.response?.data || err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header className="hero">
        <div className="brand">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect width="24" height="24" rx="6" fill="#6C63FF" />
            <path d="M6 12h12M6 7h12M6 17h12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <h1>AI Document Orchestrator</h1>
            <p className="subtitle">Ask questions of PDFs and documents using an AI backend</p>
          </div>
        </div>
      </header>

      <main className="card">
        <form className="form" onSubmit={handleSubmit}>
          <label className="file-label">
            <input type="file" onChange={e => setFile(e.target.files[0])} />
            <span>{file ? file.name : 'Choose a document...'}</span>
          </label>

          <label className="field">
            <span className="field-label">Question</span>
            <input className="text-input" value={question} onChange={e => setQuestion(e.target.value)} placeholder="e.g. Summarize the document" />
          </label>

          <div className="actions">
            <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Processing...' : 'Submit'}</button>
            <button type="button" className="btn" onClick={() => { setFile(null); setQuestion(''); setResult(null) }}>Reset</button>
          </div>
        </form>

        {result && (
          <section className="result-card">
            <h3>Result</h3>
            <pre className="result-pre">{JSON.stringify(result, null, 2)}</pre>
          </section>
        )}
      </main>

    </div>
  )
}
