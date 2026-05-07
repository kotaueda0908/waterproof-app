-- ============================================
-- 防水工事管理アプリ v2 マイグレーション
-- Supabase SQL Editor に貼り付けて実行してください
-- ============================================

-- 未定スケジュールテーブル
CREATE TABLE pending_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT,
  client TEXT,
  scale TEXT,        -- '小規模' | '中規模' | '大規模' | '不明'
  priority TEXT,     -- '高' | '中' | '低' | '未設定'
  methods TEXT[],    -- 複数工法
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 金額管理_現場テーブル
CREATE TABLE finance_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT NOT NULL,
  contract_amount BIGINT,
  contract_date DATE,
  payment_status TEXT DEFAULT '未入金',  -- '未入金' | '一部入金' | '完了'
  payment_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 金額管理_支出項目テーブル
CREATE TABLE finance_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  finance_record_id UUID NOT NULL REFERENCES finance_records(id) ON DELETE CASCADE,
  category TEXT,     -- '材料費' | '外注費' | '廃棄処分費' | 'その他'
  description TEXT,
  amount BIGINT,
  expense_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 金額管理_追加予算テーブル
CREATE TABLE finance_additional_budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  finance_record_id UUID NOT NULL REFERENCES finance_records(id) ON DELETE CASCADE,
  description TEXT,
  amount BIGINT,
  approval_status TEXT DEFAULT '未承認',  -- '承認済' | '未承認' | '不要'
  budget_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS有効化
ALTER TABLE pending_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_additional_budgets ENABLE ROW LEVEL SECURITY;

-- ポリシー設定（社内アプリのため匿名ユーザーに全操作許可）
CREATE POLICY "allow_all" ON pending_schedules FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON finance_records FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON finance_expenses FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON finance_additional_budgets FOR ALL TO anon USING (true) WITH CHECK (true);
