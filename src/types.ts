export type Role = "admin" | "teacher" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  teacherId: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO date
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  status: "pending" | "submitted";
  grade?: number;
  submittedAt?: string;
}
