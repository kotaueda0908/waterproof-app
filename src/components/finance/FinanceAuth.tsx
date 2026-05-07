import { useState } from 'react'
import { financeAuth } from '../../lib/financeAuth'

interface Props {
  onSuccess: () => void
}

export default function FinanceAuth({ onSuccess }: Props) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!password) return
    setLoading(true)
    setError('')
    const result = await financeAuth.verify(password)
    if (result.ok) {
      financeAuth.setAuthenticated()
      onSuccess()
    } else {
      setError(result.error ?? 'パスワードが違います')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-full max-w-xs">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔒</div>
          <h2 className="text-base font-bold text-gray-800">金額管理</h2>
          <p className="text-sm text-gray-400 mt-1">パスワードを入力してください</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 text-center border border-red-100">
            {error}
          </div>
        )}

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="パスワード"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 mb-4 text-center tracking-widest"
          autoFocus
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !password}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-base disabled:opacity-50 active:bg-blue-700 transition-colors"
        >
          {loading ? '確認中...' : '入力'}
        </button>
      </div>
    </div>
  )
}
