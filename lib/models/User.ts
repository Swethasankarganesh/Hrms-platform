import mongoose, { Schema, model, models } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "admin" | "hr" | "employee";
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role:     { type: String, enum: ["admin", "hr", "employee"], default: "hr" },
  },
  { timestamps: true },
);

const User = models.User ?? model<IUser>("User", UserSchema);
export default User;
