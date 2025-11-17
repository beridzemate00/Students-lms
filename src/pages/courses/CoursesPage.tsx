import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import type { Course } from "../../types";

const CoursesPage: React.FC = () => {
  const { state, addCourse, updateCourse, deleteCourse } = useData();
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const isTeacher = currentUser.role === "teacher";
  const isAdmin = currentUser.role === "admin";
  const canManage = isTeacher || isAdmin;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teacherId, setTeacherId] = useState<string>("");

  const teachers = state.users.filter((u) => u.role === "teacher");

  useEffect(() => {
    if (isTeacher) {
      setTeacherId(currentUser.id);
    } else if (!teacherId && teachers[0]) {
      setTeacherId(teachers[0].id);
    }
  }, [isTeacher, currentUser, teachers, teacherId]);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    if (isTeacher) {
      setTeacherId(currentUser.id);
    } else if (teachers[0]) {
      setTeacherId(teachers[0].id);
    }
  };

  const startEdit = (course: Course) => {
    setEditingId(course.id);
    setTitle(course.title);
    setDescription(course.description || "");
    setTeacherId(course.teacherId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !teacherId) return;

    const payload = { title, description, teacherId };

    if (editingId) {
      updateCourse(editingId, payload);
    } else {
      addCourse(payload);
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this course?")) return;
    deleteCourse(id);
    if (editingId === id) resetForm();
  };

  const titleText = editingId ? "Edit course" : "Create course";
  const buttonLabel = editingId ? "Save changes" : "Create";

  const visibleCourses =
    isTeacher
      ? state.courses.filter((c) => c.teacherId === currentUser.id)
      : state.courses;

  const getTeacherName = (id: string) =>
    state.users.find((u) => u.id === id)?.name || "Unknown";

  return (
    <div>
      <h1 className="page-title">Courses</h1>

      {canManage && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 className="card-title">{titleText}</h2>
          <form className="simple-form" onSubmit={handleSubmit}>
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
              <span>Teacher</span>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                disabled={isTeacher}
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
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
        <h2 className="card-title">All courses</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Teacher</th>
              <th>Description</th>
              {canManage && <th style={{ width: "180px" }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {visibleCourses.map((c) => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td>{getTeacherName(c.teacherId)}</td>
                <td className="muted-small">{c.description}</td>
                {canManage && (
                  <td>
                    <div className="actions">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => startEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => handleDelete(c.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {visibleCourses.length === 0 && (
              <tr>
                <td colSpan={canManage ? 4 : 3} className="muted">
                  No courses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoursesPage;
