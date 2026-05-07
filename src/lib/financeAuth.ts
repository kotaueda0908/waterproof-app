/**
 * 金額管理 認証モジュール
 * 将来アカウント方式に移行する際はこのモジュール内の実装を差し替える。
 * 外部インターフェース（isAuthenticated / setAuthenticated / clear / verify）は維持すること。
 */

const SESSION_KEY = 'finance_auth_v1'

export const financeAuth = {
  /** sessionStorage に認証済みフラグがあるか */
  isAuthenticated(): boolean {
    try {
      return sessionStorage.getItem(SESSION_KEY) === 'true'
    } catch {
      return false
    }
  },

  /** 認証成功時に呼ぶ（sessionStorage に保存） */
  setAuthenticated(): void {
    try {
      sessionStorage.setItem(SESSION_KEY, 'true')
    } catch {}
  },

  /** ログアウト（ブラウザを閉じても自動でクリアされるが明示的に呼ぶことも可） */
  clear(): void {
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch {}
  },

  /** サーバーサイドでパスワードを検証する */
  async verify(password: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (res.ok) return { ok: true }
      return { ok: false, error: data.error ?? 'エラーが発生しました' }
    } catch {
      return { ok: false, error: 'ネットワークエラーが発生しました' }
    }
  },
}
