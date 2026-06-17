import { Schema, model, models } from "mongoose";

export interface IEmployee {
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
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    id:         { type: Number, required: true, unique: true },
    name:       { type: String, required: true },
    role:       { type: String, required: true },
    department: { type: String, required: true },
    email:      { type: String, required: true, unique: true },
    status:     { type: String, enum: ["Active", "On leave"], default: "Active" },
    location:   { type: String, required: true },
    joined:     { type: String, required: true },
    salary:     { type: Number, required: true },
    score:      { type: Number, default: 75 },
  },
  { timestamps: true },
);

const Employee = models.Employee ?? model<IEmployee>("Employee", EmployeeSchema);
export default Employee;
