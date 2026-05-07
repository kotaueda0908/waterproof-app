import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import type { FinanceRecord, FinanceExpense, FinanceAdditionalBudget } from '../../types'

// ─── 表示用フォーマット ───────────────────────────────────────
const fmt = (n: number | null | undefined) =>
  n != null ? `¥${n.toLocaleString()}` : '―'

const parseAmount = (s: string): number | null => {
  const n = parseInt(s.replace(/[^0-9]/g, ''), 10)
  return isNaN(n) ? null : n
}

// ─── 行の型（UI用ローカル状態） ─────────────────────────────
type ExpenseRow = {
  _key: string   // 一意キー（既存は id, 新規は tmp_xxx）
  id?: string
  category: string
  description: string
  amount: string
  expense_date: string
}

type BudgetRow = {
  _key: string
  id?: string
  description: string
  amount: string
  approval_status: string
  budget_date: string
}

const EXPENSE_CATEGORIES = ['材料費', '外注費', '廃棄処分費', 'その他']
const APPROVAL_STATUSES = ['承認済', '未承認', '不要']
const PAYMENT_STATUSES = ['未入金', '一部入金', '完了']

const newExpenseRow = (): ExpenseRow => ({
  _key: `tmp_${Date.now()}_${Math.random()}`,
  category: '材料費',
  description: '',
  amount: '',
  expense_date: '',
})

const newBudgetRow = (): BudgetRow => ({
  _key: `tmp_${Date.now()}_${Math.random()}`,
  description: '',
  amount: '',
  approval_status: '未承認',
  budget_date: '',
})

interface Props {
  id: string | null   // null = 新規
  onBack: () => void
}

export default function FinanceDetail({ id, onBack }: Props) {
  const isNew = id === null

  const [form, setForm] = useState({
    site_name: '',
    contract_amount: '',
    contract_date: '',
    payment_status: '未入金',
    payment_date: '',
    notes: '',
  })
  const [expenses, setExpenses] = useState<ExpenseRow[]>([])
  const [budgets, setBudgets] = useState<BudgetRow[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchRecord = useCallback(async () => {
    if (!id) return
    const [recRes, expRes, budRes] = await Promise.all([
      supabase.from('finance_records').select('*').eq('id', id).single(),
      supabase.from('finance_expenses').select('*').eq('finance_record_id', id).order('created_at'),
      supabase.from('finance_additional_budgets').select('*').eq('finance_record_id', id).order('created_at'),
    ])

    if (recRes.data) {
      const r = recRes.data as FinanceRecord
      setForm({
        site_name: r.site_name,
        contract_amount: r.contract_amount != null ? String(r.contract_amount) : '',
        contract_date: r.contract_date ?? '',
        payment_status: r.payment_status,
        payment_date: r.payment_date ?? '',
        notes: r.notes ?? '',
      })
    }
    if (expRes.data) {
      setExpenses((expRes.data as FinanceExpense[]).map(e => ({
        _key: e.id,
        id: e.id,
        category: e.category ?? '材料費',
        description: e.description ?? '',
        amount: e.amount != null ? String(e.amount) : '',
        expense_date: e.expense_date ?? '',
      })))
    }
    if (budRes.data) {
      setBudgets((budRes.data as FinanceAdditionalBudget[]).map(b => ({
        _key: b.id,
        id: b.id,
        description: b.description ?? '',
        amount: b.amount != null ? String(b.amount) : '',
        approval_status: b.approval_status,
        budget_date: b.budget_date ?? '',
      })))
    }
    setLoading(false)
  }, [id])

  useEffect(() => { fetchRecord() }, [fetchRecord])

  // ─── 自動計算 ─────────────────────────────────────────────
  const contractAmt = parseAmount(form.contract_amount) ?? 0
  const approvedBudget = budgets.reduce((sum, b) => {
    if (b.approval_status === '承認済') return sum + (parseAmount(b.amount) ?? 0)
    return sum
  }, 0)
  const totalRevenue = contractAmt + approvedBudget
  const totalExpense = expenses.reduce((sum, e) => sum + (parseAmount(e.amount) ?? 0), 0)
  const grossProfit = totalRevenue - totalExpense
  const profitRate = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : null

  // ─── 保存 ─────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.site_name.trim()) { setError('物件名を入力してください'); return }
    setError('')
    setSaving(true)

    const payload = {
      site_name: form.site_name.trim(),
      contract_amount: parseAmount(form.contract_amount),
      contract_date: form.contract_date || null,
      payment_status: form.payment_status,
      payment_date: form.payment_date || null,
      notes: form.notes.trim() || null,
    }

    let recordId = id
    if (isNew) {
      const { data } = await supabase.from('finance_records').insert(payload).select('id').single()
      recordId = data?.id ?? null
    } else {
      await supabase.from('finance_records').update(payload).eq('id', id)
    }

    if (!recordId) { setSaving(false); return }

    // 支出: 全削除 → 再挿入
    await supabase.from('finance_expenses').delete().eq('finance_record_id', recordId)
    if (expenses.length > 0) {
      await supabase.from('finance_expenses').insert(
        expenses.map(e => ({
          finance_record_id: recordId,
          category: e.category || null,
          description: e.description.trim() || null,
          amount: parseAmount(e.amount),
          expense_date: e.expense_date || null,
        }))
      )
    }

    // 追加予算: 全削除 → 再挿入
    await supabase.from('finance_additional_budgets').delete().eq('finance_record_id', recordId)
    if (budgets.length > 0) {
      await supabase.from('finance_additional_budgets').insert(
        budgets.map(b => ({
          finance_record_id: recordId,
          description: b.description.trim() || null,
          amount: parseAmount(b.amount),
          approval_status: b.approval_status,
          budget_date: b.budget_date || null,
        }))
      )
    }

    setSaving(false)
    onBack()
  }

  // ─── 削除 ─────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!id) return
    if (!confirm(`「${form.site_name}」を削除しますか？\n支出・追加予算データもすべて削除されます。`)) return
    await supabase.from('finance_records').delete().eq('id', id)
    onBack()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-gray-400 text-sm">読み込み中...</p>
      </div>
    )
  }

  return (
    <div>
      {/* 戻るボタン */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-blue-600 text-sm mb-4 active:opacity-70"
      >
        ‹ 一覧に戻る
      </button>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 border border-red-100">
          {error}
        </div>
      )}

      {/* ─── 基本情報 ─── */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <h3 className="font-bold text-gray-700 text-sm mb-3">基本情報</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              物件名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.site_name}
              onChange={e => setForm(f => ({ ...f, site_name: e.target.value }))}
              placeholder="例: ○○マンション屋上防水"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">受注金額（税込）</label>
              <input
                type="number"
                value={form.contract_amount}
                onChange={e => setForm(f => ({ ...f, contract_amount: e.target.value }))}
                placeholder="0"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">受注日</label>
              <input
                type="date"
                value={form.contract_date}
                onChange={e => setForm(f => ({ ...f, contract_date: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">入金状況</label>
            <div className="flex gap-2">
              {PAYMENT_STATUSES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, payment_status: s }))}
                  className={`flex-1 py-2 text-xs rounded-xl border transition-colors ${
                    form.payment_status === s
                      ? s === '未入金'
                        ? 'bg-red-500 text-white border-red-500 font-medium'
                        : s === '一部入金'
                        ? 'bg-yellow-400 text-white border-yellow-400 font-medium'
                        : 'bg-green-500 text-white border-green-500 font-medium'
                      : 'text-gray-500 border-gray-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">入金日</label>
            <input
              type="date"
              value={form.payment_date}
              onChange={e => setForm(f => ({ ...f, payment_date: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">メモ</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="備考など"
              rows={2}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>
      </section>

      {/* ─── 支出項目 ─── */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-700 text-sm">支出項目</h3>
          <button
            onClick={() => setExpenses(e => [...e, newExpenseRow()])}
            className="text-xs text-blue-600 border border-blue-300 px-2.5 py-1 rounded-lg active:bg-blue-50 font-medium"
          >
            ＋ 追加
          </button>
        </div>

        {expenses.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-3">支出なし</p>
        ) : (
          <div className="space-y-3">
            {expenses.map((e, i) => (
              <div key={e._key} className="border border-gray-100 rounded-xl p-3 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <select
                    value={e.category}
                    onChange={ev => setExpenses(rows => rows.map((r, ri) => ri === i ? { ...r, category: ev.target.value } : r))}
                    className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                  >
                    {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <button
                    onClick={() => setExpenses(rows => rows.filter((_, ri) => ri !== i))}
                    className="text-red-400 text-xs px-2 py-1 rounded-lg active:bg-red-50"
                  >
                    削除
                  </button>
                </div>
                <input
                  type="text"
                  value={e.description}
                  onChange={ev => setExpenses(rows => rows.map((r, ri) => ri === i ? { ...r, description: ev.target.value } : r))}
                  placeholder="内容"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 mb-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={e.amount}
                    onChange={ev => setExpenses(rows => rows.map((r, ri) => ri === i ? { ...r, amount: ev.target.value } : r))}
                    placeholder="金額"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="date"
                    value={e.expense_date}
                    onChange={ev => setExpenses(rows => rows.map((r, ri) => ri === i ? { ...r, expense_date: ev.target.value } : r))}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {expenses.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs text-gray-500 font-medium">支出合計</span>
            <span className="text-sm font-bold text-gray-800">{fmt(totalExpense)}</span>
          </div>
        )}
      </section>

      {/* ─── 追加予算 ─── */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-700 text-sm">追加予算</h3>
          <button
            onClick={() => setBudgets(b => [...b, newBudgetRow()])}
            className="text-xs text-blue-600 border border-blue-300 px-2.5 py-1 rounded-lg active:bg-blue-50 font-medium"
          >
            ＋ 追加
          </button>
        </div>

        {budgets.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-3">追加予算なし</p>
        ) : (
          <div className="space-y-3">
            {budgets.map((b, i) => (
              <div key={b._key} className="border border-gray-100 rounded-xl p-3 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <select
                    value={b.approval_status}
                    onChange={ev => setBudgets(rows => rows.map((r, ri) => ri === i ? { ...r, approval_status: ev.target.value } : r))}
                    className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                  >
                    {APPROVAL_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <button
                    onClick={() => setBudgets(rows => rows.filter((_, ri) => ri !== i))}
                    className="text-red-400 text-xs px-2 py-1 rounded-lg active:bg-red-50"
                  >
                    削除
                  </button>
                </div>
                <input
                  type="text"
                  value={b.description}
                  onChange={ev => setBudgets(rows => rows.map((r, ri) => ri === i ? { ...r, description: ev.target.value } : r))}
                  placeholder="内容"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 mb-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={b.amount}
                    onChange={ev => setBudgets(rows => rows.map((r, ri) => ri === i ? { ...r, amount: ev.target.value } : r))}
                    placeholder="金額"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="date"
                    value={b.budget_date}
                    onChange={ev => setBudgets(rows => rows.map((r, ri) => ri === i ? { ...r, budget_date: ev.target.value } : r))}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── 自動計算サマリー ─── */}
      <section className="bg-blue-600 text-white rounded-2xl shadow-md p-4 mb-4">
        <h3 className="font-bold text-sm text-blue-100 mb-3">収支サマリー</h3>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-blue-200">受注金額</span>
            <span>{fmt(contractAmt || null)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-blue-200">追加予算（承認済）</span>
            <span>{fmt(approvedBudget || null)}</span>
          </div>
          <div className="flex justify-between text-sm font-medium border-t border-blue-500 pt-1.5 mt-1.5">
            <span className="text-blue-100">受注合計</span>
            <span>{fmt(totalRevenue || null)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-blue-200">支出合計</span>
            <span className="text-red-200">
              {totalExpense > 0 ? `−${fmt(totalExpense)}` : '―'}
            </span>
          </div>
          <div className="flex justify-between border-t border-blue-500 pt-1.5 mt-1.5">
            <span className="font-bold">粗利</span>
            <span className={`font-bold text-lg ${grossProfit < 0 ? 'text-red-300' : 'text-white'}`}>
              {totalRevenue > 0 ? fmt(grossProfit) : '―'}
            </span>
          </div>
          {profitRate !== null && (
            <div className="flex justify-between text-sm">
              <span className="text-blue-200">粗利率</span>
              <span className={profitRate < 0 ? 'text-red-300' : 'text-green-200'}>
                {profitRate.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ─── 保存・削除ボタン ─── */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-base disabled:opacity-50 active:bg-blue-700 transition-colors mb-3"
      >
        {saving ? '保存中...' : '保存する'}
      </button>

      {!isNew && (
        <button
          onClick={handleDelete}
          className="w-full py-3 rounded-xl border border-red-300 text-red-500 text-sm font-medium active:bg-red-50 transition-colors mb-6"
        >
          このレコードを削除
        </button>
      )}
    </div>
  )
}
