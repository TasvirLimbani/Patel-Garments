export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface SalaryComponent {
  basic: number;
  hra: number;
  da: number;
  allowances: number;
  deductions: number;
  totalSalary: number;
}

export interface Salary {
  employee_id: string;
  employee_name: string;
  month_year: string;
  year: string;
  month: string;
  total_piece: string;
  total_salary: string;
  total_paid: string;
  total_advance: string;
  payable: string;
}

export interface Entry {
  id: string;
  employeeId: string;
  checkInTime: string;
  checkOutTime: string | null;
  date: string;
  workHours: number;
  status: 'present' | 'absent' | 'half-day';
}

export interface Advance {
  id: string;
  employeeId: string;
  amount: number;
  requestDate: string;
  approvalDate: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  reason: string;
  remainingBalance: number;
}

// Mock Employees
export const employees: Employee[] = [
  {
    id: '1',
    name: 'Alice Smith',
    position: 'Engineer',
    department: 'Engineering',
    email: 'alice@company.com',
    phone: '+1-555-0101',
    joinDate: '2022-01-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Bob Johnson',
    position: 'Designer',
    department: 'Design',
    email: 'bob@company.com',
    phone: '+1-555-0102',
    joinDate: '2021-06-20',
    status: 'active',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    position: 'Doctor',
    department: 'Healthcare',
    email: 'charlie@company.com',
    phone: '+1-555-0103',
    joinDate: '2020-03-10',
    status: 'active',
  },
  {
    id: '4',
    name: 'Diana Prince',
    position: 'Artist',
    department: 'Creative',
    email: 'diana@company.com',
    phone: '+1-555-0104',
    joinDate: '2023-02-01',
    status: 'active',
  },
  {
    id: '5',
    name: 'Eve Adams',
    position: 'Manager',
    department: 'Management',
    email: 'eve@company.com',
    phone: '+1-555-0105',
    joinDate: '2019-08-15',
    status: 'active',
  },
  {
    id: '6',
    name: 'Frank White',
    position: 'Developer',
    department: 'Engineering',
    email: 'frank@company.com',
    phone: '+1-555-0106',
    joinDate: '2022-11-01',
    status: 'active',
  },
];

// Mock Salaries
export const salaries: Salary[] = [
  {
            "employee_id": "1",
            "employee_name": "Hamza ali",
            "month_year": "2026-04",
            "year": "2026",
            "month": "4",
            "total_piece": "500",
            "total_salary": "12835.00",
            "total_paid": "9000.00",
            "total_advance": "8665.00",
            "payable": "-4830.00"
        },
        {
            "employee_id": "8",
            "employee_name": "pankil r vaghani",
            "month_year": "2026-04",
            "year": "2026",
            "month": "4",
            "total_piece": "47",
            "total_salary": "288.40",
            "total_paid": "400.00",
            "total_advance": "488.40",
            "payable": "-600.00"
        },
        {
            "employee_id": "3",
            "employee_name": "Tasveer ",
            "month_year": "2026-04",
            "year": "2026",
            "month": "4",
            "total_piece": "100",
            "total_salary": "1275.00",
            "total_paid": "1400.00",
            "total_advance": "125.00",
            "payable": "-250.00"
        }
];

// Mock Entries (Work logs)
export const entries: Entry[] = [
  {
    id: '1',
    employeeId: '1',
    date: '2024-04-01',
    checkInTime: '09:00',
    checkOutTime: '17:30',
    workHours: 8.5,
    status: 'present',
  },
  {
    id: '2',
    employeeId: '1',
    date: '2024-04-02',
    checkInTime: '09:15',
    checkOutTime: '17:45',
    workHours: 8.5,
    status: 'present',
  },
  {
    id: '3',
    employeeId: '2',
    date: '2024-04-01',
    checkInTime: '10:00',
    checkOutTime: '18:00',
    workHours: 8,
    status: 'present',
  },
  {
    id: '4',
    employeeId: '3',
    date: '2024-04-01',
    checkInTime: '08:30',
    checkOutTime: null,
    workHours: 0,
    status: 'present',
  },
];

// Mock Advances
export const advances: Advance[] = [
  {
    id: '1',
    employeeId: '1',
    amount: 10000,
    requestDate: '2024-03-15',
    approvalDate: '2024-03-16',
    status: 'approved',
    reason: 'Medical expense',
    remainingBalance: 5000,
  },
  {
    id: '2',
    employeeId: '2',
    amount: 15000,
    requestDate: '2024-03-20',
    approvalDate: null,
    status: 'pending',
    reason: 'Personal needs',
    remainingBalance: 15000,
  },
  {
    id: '3',
    employeeId: '3',
    amount: 20000,
    requestDate: '2024-02-10',
    approvalDate: '2024-02-12',
    status: 'paid',
    reason: 'Emergency funds',
    remainingBalance: 0,
  },
];
