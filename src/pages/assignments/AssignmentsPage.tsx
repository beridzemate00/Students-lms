import React, { useEffect, useMemo, useState } from "react";
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

  if (!currentUser) return null;

  const isTeacher = currentUser.role === "teacher";
  const isAdmin = currentUser.role === "admin";
  const canManage = isTeacher || isAdmin;

  const myCourses: Course[] = useMemo(
    () =>
      isTeacher
        ? state.courses.filter((c) => c.teacherId === currentUser.id)
        : state.courses,
    [state.courses, isTeacher, currentUser]
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string>(myCourses[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDateInput, setDueDateInput] = useState("");

  useEffect(() => {
    // если выбранного курса нет в списке — берём первый доступный
    if (!courseId && myCourses[0]) {
      setCourseId(myCourses[0].id);
    }
  }, [courseId, myCourses]);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setDueDateInput("");
    if (myCourses[0]) {
      setCourseId(myCourses[0].id);
    }
  };

  const startEdit = (a: Assignment) => {
    setEditingId(a.id);
    setCourseId(a.courseId);
    setTitle(a.title);
    setDescription(a.description || "");
    setDueDateInput(dateToInput(a.dueDate));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseId) return;

    const payload = {
      courseId,
      title,
      description,
      dueDate: dueDateInput ? new Date(dueDateInput).toISOString() : undefined
    };

    if (editingId) {
      updateAssignment(editingId, payload);
    } else {
      addAssignment(payload);
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this assignment?")) return;
    deleteAssignment(id);
    if (editingId === id) {
      resetForm();
    }
  };

  const getCourseTitle = (id: string) =>
    state.courses.find((c) => c.id === id)?.title || "Unknown course";

  const visibleAssignments: Assignment[] = isTeacher
    ? state.assignments.filter((a) =>
        myCourses.some((c) => c.id === a.courseId)
      )
    : state.assignments;

  const titleText = editingId ? "Edit assignment" : "Create assignment";
  const buttonLabel = editingId ? "Save changes" : "Create";

  return (
    <div>
      <h1 className="page-title">Assignments</h1>

      {canManage && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 className="card-title">{titleText}</h2>
          <form className="simple-form" onSubmit={handleSubmit}>
            <label className="field-inline">
              <span>Course</span>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                {myCourses.map((c) => (
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
                placeholder="optional"
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
        </div>
      )}

      <div className="card">
        <h2 className="card-title">All assignments</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Course</th>
              <th>Due date</th>
              {canManage && <th style={{ width: "180px" }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {visibleAssignments.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{getCourseTitle(a.courseId)}</td>
                <td>{formatDate(a.dueDate)}</td>
                {canManage && (
                  <td>
                    <div className="actions">
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
                  </td>
                )}
              </tr>
            ))}
            {visibleAssignments.length === 0 && (
              <tr>
                <td colSpan={canManage ? 4 : 3} className="muted">
                  No assignments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentsPage;
