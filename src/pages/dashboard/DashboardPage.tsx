import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { state } = useData();

  const totalStudents = state.users.filter((u) => u.role === "student").length;
  const totalTeachers = state.users.filter((u) => u.role === "teacher").length;
  const totalCourses = state.courses.length;
  const totalAssignments = state.assignments.length;

  if (!currentUser) return null;

  if (currentUser.role === "admin") {
    return (
      <div className="grid">
        <div className="card metric">
          <div className="metric-label">Students</div>
          <div className="metric-value">{totalStudents}</div>
        </div>
        <div className="card metric">
          <div className="metric-label">Teachers</div>
          <div className="metric-value">{totalTeachers}</div>
        </div>
        <div className="card metric">
          <div className="metric-label">Courses</div>
          <div className="metric-value">{totalCourses}</div>
        </div>
        <div className="card metric">
          <div className="metric-label">Assignments</div>
          <div className="metric-value">{totalAssignments}</div>
        </div>
      </div>
    );
  }

  if (currentUser.role === "teacher") {
    const myCourses = state.courses.filter(
      (c) => c.teacherId === currentUser.id
    );
    return (
      <div>
        <h1 className="page-title">My courses</h1>
        <div className="grid">
          {myCourses.map((c) => (
            <div key={c.id} className="card">
              <h2>{c.title}</h2>
              <p className="muted">{c.description}</p>
              <p className="muted-small">
                Assignments:{" "}
                {state.assignments.filter((a) => a.courseId === c.id).length}
              </p>
            </div>
          ))}
          {myCourses.length === 0 && (
            <p className="muted">No courses assigned to you yet.</p>
          )}
        </div>
      </div>
    );
  }

  const myAssignments = state.assignments;
  return (
    <div>
      <h1 className="page-title">My assignments</h1>
      <div className="grid">
        {myAssignments.map((a) => (
          <div key={a.id} className="card">
            <h2>{a.title}</h2>
            <p className="muted">{a.description}</p>
            {a.dueDate && (
              <p className="muted-small">
                Due: {new Date(a.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
        {myAssignments.length === 0 && (
          <p className="muted">No assignments yet.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
