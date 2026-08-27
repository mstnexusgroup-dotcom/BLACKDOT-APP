'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function ProfilePage() {
  const [supabase] = useState(() => 
    createBrowserClient(
      'https://omrmfxygbckoplrhbkam.supabase.co', 
      'sb_publishable_CUkFX3B0zA_CFCsiAzP7rQ_BNGH5utb'
    )
  )

  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState('')
  const [grade, setGrade] = useState('')

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          let { data } = await supabase.from('profiles').select('full_name, grade').eq('id', user.id).single()
          if (data) {
            setFullname(data.full_name || '')
            setGrade(data.grade || '')
          }
        }
      } catch (e) { console.error(e) } finally { setLoading(false) }
    }
    getProfile()
  }, [supabase])

  async function handleSave() {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return alert('Please Sign In!')

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: fullname,
        grade: grade,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('MST NEXUS: Saved!')
    } catch (err: any) { alert(err.message) } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl border-t-8 border-blue-600">
        <h2 className="text-3xl font-black text-blue-700 mb-8">MY PROFILE</h2>
        
        <div className="space-y-6">
          <input 
            className="w-full p-5 bg-gray-50 rounded-2xl font-bold border-2 border-transparent focus:border-blue-600 outline-none"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <select 
            className="w-full p-5 bg-gray-50 rounded-2xl font-bold border-2 border-transparent focus:border-blue-600 outline-none"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          >
            <option value="">Select Grade</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>

          <button 
            onClick={handleSave}
            className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all"
          >
            {loading ? 'SAVING...' : 'SYNC TO CLOUD'}
          </button>
        </div>
      </div>
      
      <button 
        onClick={() => window.location.href = '/'}
        className="mt-10 text-gray-400 font-black text-xs uppercase tracking-widest"
      >
        ← Back to Dashboard
      </button>
    </div>
  )
}