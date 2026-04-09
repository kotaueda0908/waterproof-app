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
