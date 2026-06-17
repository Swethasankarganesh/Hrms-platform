import { Schema, model, models } from "mongoose";

export interface IAttendanceRecord {
  employeeId: number;
  status: "Present" | "Remote" | "Late" | "Absent" | "Leave";
  clockIn: string;
  clockOut: string;
  hours: string;
  date: string; // YYYY-MM-DD
}

const AttendanceSchema = new Schema<IAttendanceRecord>(
  {
    employeeId: { type: Number, required: true },
    status:     { type: String, enum: ["Present", "Remote", "Late", "Absent", "Leave"], required: true },
    clockIn:    { type: String, default: "-" },
    clockOut:   { type: String, default: "-" },
    hours:      { type: String, default: "-" },
    date:       { type: String, required: true },
  },
  { timestamps: true },
);

AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance = models.Attendance ?? model<IAttendanceRecord>("Attendance", AttendanceSchema);
export default Attendance;

/* ── Payroll status ─────────────────────────────────────────── */

export interface IPayroll {
  month: string; // "2026-06"
  status: "Draft" | "Processed";
}

const PayrollSchema = new Schema<IPayroll>(
  {
    month:  { type: String, required: true, unique: true },
    status: { type: String, enum: ["Draft", "Processed"], default: "Draft" },
  },
  { timestamps: true },
);

export const Payroll = models.Payroll ?? model<IPayroll>("Payroll", PayrollSchema);
