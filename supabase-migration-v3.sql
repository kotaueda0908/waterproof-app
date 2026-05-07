-- ============================================
-- 防水工事管理アプリ v3 マイグレーション（現地調査メモ）
-- Supabase SQL Editor に貼り付けて実行してください
-- ============================================

-- 現地調査メモ 基本情報テーブル
CREATE TABLE survey_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT,
  address TEXT,
  survey_date DATE,
  surveyor TEXT,
  client TEXT,
  building_floors TEXT,
  desired_timing TEXT,
  urgency TEXT,              -- '高' | '中' | '低' | '未設定'
  methods TEXT[],            -- 全体の予定工法
  methods_other TEXT,        -- 「その他」選択時の自由記述
  overall_notes TEXT,
  access_route TEXT,
  power_supply TEXT,
  water_supply TEXT,
  neighbor_consideration TEXT,
  other_remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 現地調査メモ 箇所情報テーブル
CREATE TABLE survey_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_record_id UUID NOT NULL REFERENCES survey_records(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  name TEXT,
  dimensions_note TEXT,
  existing_spec TEXT,
  deterioration TEXT,
  methods TEXT[],
  methods_other TEXT,
  rising_height NUMERIC,     -- 立上り (m)
  expansion_joint NUMERIC,   -- 伸縮目地 (m)
  drain_count INTEGER,       -- ドレン数
  drain_diameter TEXT,       -- 口径 (例: φ70)
  degassing_count INTEGER,   -- 脱気筒数
  fence_count INTEGER,       -- フェンス架台数
  ac_count INTEGER,          -- 室外機数
  other_attachments TEXT,    -- その他付帯
  special_notes TEXT,        -- 特記事項
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS有効化
ALTER TABLE survey_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_locations ENABLE ROW LEVEL SECURITY;

-- ポリシー設定
CREATE POLICY "allow_all" ON survey_records FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON survey_locations FOR ALL TO anon USING (true) WITH CHECK (true);
