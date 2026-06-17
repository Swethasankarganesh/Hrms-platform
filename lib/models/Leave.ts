import { Schema, model, models } from "mongoose";

export interface ILeave {
  id: number;
  employeeId: number;
  type: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Declined";
}

const LeaveSchema = new Schema<ILeave>(
  {
    id:         { type: Number, required: true, unique: true },
    employeeId: { type: Number, required: true },
    type:       { type: String, required: true },
    from:       { type: String, required: true },
    to:         { type: String, required: true },
    days:       { type: Number, required: true },
    reason:     { type: String, default: "" },
    status:     { type: String, enum: ["Pending", "Approved", "Declined"], default: "Pending" },
  },
  { timestamps: true },
);

const Leave = models.Leave ?? model<ILeave>("Leave", LeaveSchema);
export default Leave;
