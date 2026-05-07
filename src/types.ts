export interface Employee {
  id: string
  name: string
  is_active: boolean
  created_at: string
}

export interface Schedule {
  id: string
  site_name: string
  address: string | null
  method: string | null
  date: string        // YYYY-MM-DD
  assignee: string | null
  notes: string | null
  created_at: string
}

export interface Attendance {
  id: string
  employee_id: string
  date: string
  created_at: string
}

export interface AttendanceWithEmployee extends Attendance {
  employees: Employee
}

export interface WakeCheck {
  id: string
  employee_id: string
  checked_at: string
  date: string
}

export interface WakeCheckWithEmployee extends WakeCheck {
  employees: Employee
}

// ─── 未定スケジュール ───────────────────────────────────────────
export interface PendingSchedule {
  id: string
  site_name: string | null
  client: string | null
  scale: string | null     // '小規模' | '中規模' | '大規模' | '不明'
  priority: string | null  // '高' | '中' | '低' | '未設定'
  methods: string[] | null
  notes: string | null
  created_at: string
}

// ─── 金額管理 ──────────────────────────────────────────────────
export interface FinanceRecord {
  id: string
  site_name: string
  contract_amount: number | null
  contract_date: string | null   // YYYY-MM-DD
  payment_status: string         // '未入金' | '一部入金' | '完了'
  payment_date: string | null
  notes: string | null
  created_at: string
}

export interface FinanceExpense {
  id: string
  finance_record_id: string
  category: string | null  // '材料費' | '外注費' | '廃棄処分費' | 'その他'
  description: string | null
  amount: number | null
  expense_date: string | null
  created_at: string
}

export interface FinanceAdditionalBudget {
  id: string
  finance_record_id: string
  description: string | null
  amount: number | null
  approval_status: string  // '承認済' | '未承認' | '不要'
  budget_date: string | null
  created_at: string
}

// ─── 現地調査メモ ──────────────────────────────────────────────
export interface SurveyRecord {
  id: string
  site_name: string | null
  address: string | null
  survey_date: string | null      // YYYY-MM-DD
  surveyor: string | null
  client: string | null
  building_floors: string | null
  desired_timing: string | null
  urgency: string | null          // '高' | '中' | '低' | '未設定'
  methods: string[] | null
  methods_other: string | null
  overall_notes: string | null
  access_route: string | null
  power_supply: string | null
  water_supply: string | null
  neighbor_consideration: string | null
  other_remarks: string | null
  created_at: string
}

export interface SurveyLocation {
  id: string
  survey_record_id: string
  sort_order: number
  name: string | null
  dimensions_note: string | null
  existing_spec: string | null
  deterioration: string | null
  methods: string[] | null
  methods_other: string | null
  rising_height: number | null
  expansion_joint: number | null
  drain_count: number | null
  drain_diameter: string | null
  degassing_count: number | null
  fence_count: number | null
  ac_count: number | null
  other_attachments: string | null
  special_notes: string | null
  created_at: string
}
