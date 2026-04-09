-- ============================================
-- 防水工事管理アプリ - Supabaseテーブル設計
-- Supabase SQL Editorにそのまま貼り付けて実行
-- ============================================

-- 従業員テーブル
CREATE TABLE employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 現場予定テーブル
CREATE TABLE schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT NOT NULL,
  address TEXT,
  method TEXT,
  date DATE NOT NULL,
  assignee TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 出勤記録テーブル（1人1日1レコード）
CREATE TABLE attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, date)
);

-- 起床確認テーブル（1人1日1レコード）
CREATE TABLE wake_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(employee_id, date)
);

-- RLS有効化
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE wake_checks ENABLE ROW LEVEL SECURITY;

-- 社内アプリのため全操作を匿名ユーザーに許可
CREATE POLICY "allow_all" ON employees FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON schedules FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON attendance FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON wake_checks FOR ALL TO anon USING (true) WITH CHECK (true);
