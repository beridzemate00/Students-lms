import React, { useMemo, useState } from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import type { Assignment, Course } from "../../types";

const formatDate = (iso?: string) => {
  if (!iso) return "No due date";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "No due date";
  return d.toLocaleDateString();
};

const dateToInput = (iso?: string) => {
  if (!iso) return "";
  return iso.slice(0, 10);
};

const AssignmentsPage: React.FC = () => {
  const { state, addAssignment, updateAssignment, deleteAssignment } = useData();
  const { currentUser } = useAuth();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDateInput, setDueDateInput] = useState("");

  if (!currentUser) return null;

  const isTeacher = currentUser.role === "teacher";
  const isAdmin = currentUser.role === "admin";
  const canManage = isTeacher || isAdmin;

  const myCourses: Course[] = useMemo(() => {
    if (isTeacher) {
      return state.courses.filter((c) => c.teacherId === currentUser.id);
    }
    return state.courses;
  }, [state.courses, isTeacher, currentUser]);

  const courseOptions = myCourses;
  const defaultCourseId = courseOptions[0]?.id ?? "";

  React.useEffect(() => {
    if (!courseId && defaultCourseId) {
      setCourseId(defaultCourseId);
    }
  }, [courseId, defaultCourseId]);

  const visibleAssignments: Assignment[] = useMemo(() => {
    if (isTeacher) {
      const ids = new Set(myCourses.map((c) => c.id));
      return state.assignments.filter((a) => ids.has(a.courseId));
    }
    if (currentUser.role === "student") {
      // пока просто все задания, можно позже фильтровать по "моим курсам"
      return state.assignments;
    }
    // admin
    return state.assignments;
  }, [state.assignments, myCourses, isTeacher, currentUser]);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setDueDateInput("");
    setCourseId(defaultCourseId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !title) return;

    const dueDate = dueDateInput
      ? new Date(dueDateInput).toISOString()
      : undefined;

    if (editingId) {
      updateAssignment({
        id: editingId,
        courseId,
        title,
        description,
        dueDate
      });
    } else {
      addAssignment({ courseId, title, description, dueDate });
    }

    resetForm();
  };

  const startEdit = (assignment: Assignment) => {
    setEditingId(assignment.id);
    setCourseId(assignment.courseId);
    setTitle(assignment.title);
    setDescription(assignment.description ?? "");
    setDueDateInput(dateToInput(assignment.dueDate));
  };

  const handleDelete = (assignmentId: string) => {
    if (!window.confirm("Delete this assignment?")) return;
    deleteAssignment(assignmentId);
  };

  const titleText = editingId ? "Edit assignment" : "Create assignment";
  const buttonLabel = editingId ? "Save changes" : "Create";

  const resolveCourse = (id: string): Course | undefined =>
    state.courses.find((c) => c.id === id);

  return (
    <div>
      <h1 className="page-title">Assignments</h1>

      {canManage && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 className="card-title">{titleText}</h2>
          {courseOptions.length === 0 ? (
            <p className="muted">
              You have no courses yet. Create a course first.
            </p>
          ) : (
            <form className="simple-form" onSubmit={handleSubmit}>
              <label className="field-inline">
                <span>Course</span>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                >
                  {courseOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-inline">
                <span>Title</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </label>
              <label className="field-inline">
                <span>Description</span>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
              <label className="field-inline">
                <span>Due date</span>
                <input
                  type="date"
                  value={dueDateInput}
                  onChange={(e) => setDueDateInput(e.target.value)}
                />
              </label>
              <button className="btn-primary" type="submit">
                {buttonLabel}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </form>
          )}
        </div>
      )}

      <div className="card">
        <h2 className="card-title">All assignments</h2>
        <div className="grid">
          {visibleAssignments.map((a) => {
            const course = resolveCourse(a.courseId);
            return (
              <div key={a.id} className="card course-card">
                <h3>{a.title}</h3>
                <p className="muted">{a.description}</p>
                <p className="muted-small">
                  Course: {course ? course.title : "Unknown course"}
                </p>
                <p className="muted-small">Due: {formatDate(a.dueDate)}</p>

                {canManage && (
                  <div className="actions" style={{ marginTop: "0.5rem" }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => startEdit(a)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleDelete(a.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {visibleAssignments.length === 0 && (
            <p className="muted">No assignments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentsPage;
