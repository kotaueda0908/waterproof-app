export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { password } = req.body ?? {}
  const correct = process.env.FINANCE_PASSWORD

  if (!correct) {
    return res.status(500).json({ error: 'サーバー設定エラー: FINANCE_PASSWORD が未設定です' })
  }

  if (password === correct) {
    return res.status(200).json({ ok: true })
  }

  return res.status(401).json({ error: 'パスワードが違います' })
}
