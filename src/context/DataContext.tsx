import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode
} from "react";
import type { Assignment, Course, Submission, User, Role } from "../types";

interface DataState {
  users: User[];
  courses: Course[];
  assignments: Assignment[];
  submissions: Submission[];
}

type DataAction =
  | { type: "SET_STATE"; payload: DataState }
  | { type: "ADD_USER"; payload: User }
  | { type: "ADD_COURSE"; payload: Course }
  | { type: "ADD_ASSIGNMENT"; payload: Assignment }
  | { type: "ADD_SUBMISSION"; payload: Submission };

interface AddUserInput {
  name: string;
  email: string;
  role: Role;
  password: string;
}

interface AddCourseInput {
  title: string;
  description?: string;
  teacherId: string;
}

interface AddAssignmentInput {
  courseId: string;
  title: string;
  description?: string;
  dueDate?: string;
}

interface AddSubmissionInput {
  assignmentId: string;
  studentId: string;
  content?: string; // placeholder for future
}

interface DataContextValue {
  state: DataState;
  addUser: (input: AddUserInput) => User;
  addCourse: (input: AddCourseInput) => Course;
  addAssignment: (input: AddAssignmentInput) => Assignment;
  addSubmission: (input: AddSubmissionInput) => Submission;
}

const STORAGE_KEY = "students_lms_data_v1";

const DataContext = createContext<DataContextValue | undefined>(undefined);

const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const seedState: DataState = {
  users: [
    {
      id: "u-admin",
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin"
    },
    {
      id: "u-teacher",
      name: "Jane Teacher",
      email: "teacher@example.com",
      password: "password123",
      role: "teacher"
    },
    {
      id: "u-student",
      name: "John Student",
      email: "student@example.com",
      password: "password123",
      role: "student"
    }
  ],
  courses: [
    {
      id: "c-js",
      title: "Intro to JavaScript",
      description: "Basics of JavaScript for the web.",
      teacherId: "u-teacher"
    },
    {
      id: "c-math",
      title: "Algebra I",
      description: "Core algebra concepts.",
      teacherId: "u-teacher"
    }
  ],
  assignments: [
    {
      id: "a-1",
      courseId: "c-js",
      title: "Variables & Types",
      description: "Practice with let, const, and data types.",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "a-2",
      courseId: "c-math",
      title: "Linear Equations",
      description: "Solve basic linear equations.",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  submissions: []
};

const loadInitialState = (): DataState => {
  if (typeof window === "undefined") return seedState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState;
    const parsed = JSON.parse(raw) as DataState;
    if (!parsed.users || !parsed.courses) return seedState;
    return parsed;
  } catch {
    return seedState;
  }
};

const reducer = (state: DataState, action: DataAction): DataState => {
  switch (action.type) {
    case "SET_STATE":
      return action.payload;
    case "ADD_USER":
      return { ...state, users: [...state.users, action.payload] };
    case "ADD_COURSE":
      return { ...state, courses: [...state.courses, action.payload] };
    case "ADD_ASSIGNMENT":
      return { ...state, assignments: [...state.assignments, action.payload] };
    case "ADD_SUBMISSION":
      return { ...state, submissions: [...state.submissions, action.payload] };
    default:
      return state;
  }
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addUser = (input: AddUserInput): User => {
    const user: User = { id: createId(), ...input };
    dispatch({ type: "ADD_USER", payload: user });
    return user;
  };

  const addCourse = (input: AddCourseInput): Course => {
    const course: Course = { id: createId(), ...input };
    dispatch({ type: "ADD_COURSE", payload: course });
    return course;
  };

  const addAssignment = (input: AddAssignmentInput): Assignment => {
    const assignment: Assignment = { id: createId(), ...input };
    dispatch({ type: "ADD_ASSIGNMENT", payload: assignment });
    return assignment;
  };

  const addSubmission = (input: AddSubmissionInput): Submission => {
    const submission: Submission = {
      id: createId(),
      assignmentId: input.assignmentId,
      studentId: input.studentId,
      status: "submitted",
      submittedAt: new Date().toISOString()
    };
    dispatch({ type: "ADD_SUBMISSION", payload: submission });
    return submission;
  };

  const value: DataContextValue = {
    state,
    addUser,
    addCourse,
    addAssignment,
    addSubmission
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};
