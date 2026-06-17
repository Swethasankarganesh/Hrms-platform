"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Employee } from "@/lib/types";

const employeeSchema = z.object({
  name: z.string().min(2, "Enter the employee name"),
  email: z.email("Enter a valid work email"),
  role: z.string().min(2, "Enter a role"),
  department: z.string().min(1),
  location: z.string().min(1),
  salary: z.coerce.number().min(100000, "CTC must be at least ₹1,00,000"),
});

type EmployeeFormInput = z.input<typeof employeeSchema>;
type EmployeeInput = z.output<typeof employeeSchema>;

export function EmployeeForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (employee: Omit<Employee, "id" | "status" | "joined" | "score">) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormInput, unknown, EmployeeInput>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { salary: 900000, department: "Engineering", location: "Bengaluru" },
  });

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit((values) => onSubmit(values))}
    >
      <div>
        <span className="eyebrow">Employee profile</span>
        <h2 className="text-2xl font-bold tracking-tight">Add a new employee</h2>
        <p className="mt-1 text-sm text-muted">
          Attendance and payroll profiles are generated automatically.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.name?.message} wide>
          <input {...register("name")} placeholder="Isha Kapoor" />
        </Field>
        <Field label="Work email" error={errors.email?.message}>
          <input {...register("email")} placeholder="isha@company.com" />
        </Field>
        <Field label="Role" error={errors.role?.message}>
          <input {...register("role")} placeholder="Product Manager" />
        </Field>
        <Field label="Department">
          <select {...register("department")}>
            {["Engineering", "Product", "Design", "Finance", "Operations", "People"].map(
              (item) => <option key={item}>{item}</option>,
            )}
          </select>
        </Field>
        <Field label="Location">
          <select {...register("location")}>
            {["Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Pune", "Remote"].map(
              (item) => <option key={item}>{item}</option>,
            )}
          </select>
        </Field>
        <Field label="Annual CTC" error={errors.salary?.message}>
          <input {...register("salary")} type="number" />
        </Field>
      </div>
      <div className="flex justify-end gap-2">
        <button className="btn secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn primary" type="submit">
          Add employee
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  wide,
  children,
}: {
  label: string;
  error?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={wide ? "sm:col-span-2" : ""}>
      <span className="mb-1.5 block text-xs font-semibold text-muted">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
