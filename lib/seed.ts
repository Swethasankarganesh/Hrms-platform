import type { HrmsState } from "@/lib/types";

export const seedState: HrmsState = {
  employees: [
    { id: 1001, name: "Ananya Singh", role: "Senior Software Engineer", department: "Engineering", email: "ananya@peopleflow.io", status: "Active", location: "Bengaluru", joined: "2023-08-14", salary: 1850000, score: 92 },
    { id: 1002, name: "Priya Menon", role: "Product Designer", department: "Design", email: "priya@peopleflow.io", status: "Active", location: "Mumbai", joined: "2026-06-11", salary: 980000, score: 88 },
    { id: 1003, name: "Rahul Verma", role: "Product Manager", department: "Product", email: "rahul@peopleflow.io", status: "On leave", location: "Delhi", joined: "2024-02-19", salary: 1600000, score: 84 },
    { id: 1004, name: "Meera Joshi", role: "Finance Analyst", department: "Finance", email: "meera@peopleflow.io", status: "Active", location: "Pune", joined: "2022-11-07", salary: 1050000, score: 79 },
    { id: 1005, name: "Karan Shah", role: "Operations Lead", department: "Operations", email: "karan@peopleflow.io", status: "Active", location: "Ahmedabad", joined: "2023-05-22", salary: 1280000, score: 86 },
    { id: 1006, name: "Devika Rao", role: "People Partner", department: "People", email: "devika@peopleflow.io", status: "On leave", location: "Hyderabad", joined: "2021-09-13", salary: 1420000, score: 90 },
    { id: 1007, name: "Nikhil Kumar", role: "Backend Engineer", department: "Engineering", email: "nikhil@peopleflow.io", status: "Active", location: "Bengaluru", joined: "2024-06-03", salary: 1350000, score: 76 },
    { id: 1008, name: "Riya Mehta", role: "QA Engineer", department: "Engineering", email: "riya@peopleflow.io", status: "Active", location: "Remote", joined: "2025-01-20", salary: 920000, score: 82 },
  ],
  attendance: {
    1001: { status: "Present", clockIn: "09:02", clockOut: "18:12", hours: "9h 10m" },
    1002: { status: "Present", clockIn: "09:18", clockOut: "-", hours: "5h 42m" },
    1003: { status: "Leave", clockIn: "-", clockOut: "-", hours: "-" },
    1004: { status: "Late", clockIn: "10:04", clockOut: "-", hours: "4h 56m" },
    1005: { status: "Present", clockIn: "08:51", clockOut: "17:47", hours: "8h 56m" },
    1006: { status: "Leave", clockIn: "-", clockOut: "-", hours: "-" },
    1007: { status: "Present", clockIn: "09:11", clockOut: "-", hours: "5h 49m" },
    1008: { status: "Remote", clockIn: "09:00", clockOut: "-", hours: "6h 00m" },
  },
  leaves: [
    { id: 1, employeeId: 1004, type: "Annual leave", from: "2026-06-14", to: "2026-06-16", days: 3, reason: "Family event", status: "Pending" },
    { id: 2, employeeId: 1005, type: "Personal leave", from: "2026-06-20", to: "2026-06-20", days: 1, reason: "Personal appointment", status: "Pending" },
    { id: 3, employeeId: 1006, type: "Annual leave", from: "2026-06-23", to: "2026-06-27", days: 5, reason: "Vacation", status: "Pending" },
    { id: 4, employeeId: 1003, type: "Sick leave", from: "2026-06-11", to: "2026-06-12", days: 2, reason: "Medical recovery", status: "Approved" },
  ],
  payroll: "Draft",
};
