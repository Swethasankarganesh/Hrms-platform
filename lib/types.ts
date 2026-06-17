export type PageId =
  | "overview"
  | "people"
  | "attendance"
  | "leave"
  | "payroll"
  | "performance"
  | "reports"
  | "ai"
  | "settings";

export type Employee = {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  status: "Active" | "On leave";
  location: string;
  joined: string;
  salary: number;
  score: number;
};

export type AttendanceStatus =
  | "Present"
  | "Remote"
  | "Late"
  | "Absent"
  | "Leave";

export type AttendanceRecord = {
  status: AttendanceStatus;
  clockIn: string;
  clockOut: string;
  hours: string;
};

export type LeaveRequest = {
  id: number;
  employeeId: number;
  type: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Declined";
};

export type HrmsState = {
  employees: Employee[];
  attendance: Record<number, AttendanceRecord>;
  leaves: LeaveRequest[];
  payroll: "Draft" | "Processed";
};
