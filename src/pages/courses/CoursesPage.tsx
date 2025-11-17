import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import type { User } from "../../types";

const CoursesPage: React.FC = () => {
  const { state, addCourse, updateCourse, deleteCourse } = useData();
  const { currentUser } = useAuth();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teacherId, setTeacherId] = useState<string>("");

  const teachers = state.users.filter((u) => u.role === "teacher");

  useEffect(() => {
    if (currentUser?.role === "teacher") {
      setTeacherId(currentUser.id);
    } else if (!teacherId && teachers[0]) {
      setTeacherId(teachers[0].id);
    }
  }, [currentUser, teachers, teacherId]);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    if (currentUser?.role === "teacher") {
      setTeacherId(currentUser.id);
    } else if (teachers[0]) {
      setTeacherId(teachers[0].id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !teacherId) return;

    if (editingId) {
      updateCourse({ id: editingId, title, description, teacherId });
    } else {
      addCourse({ title, description, teacherId });
    }

    resetForm();
  };

  const startEdit = (courseId: string) => {
    const course = state.courses.find((c) => c.id === courseId);
    if (!course) return;
    setEditingId(course.id);
    setTitle(course.title);
    setDescription(course.description || "");
    setTeacherId(course.teacherId);
  };

  const handleDelete = (courseId: string) => {
    if (!window.confirm("Delete this course?")) return;
    deleteCourse(courseId);
  };

  const resolveTeacher = (id: string): User | undefined =>
    state.users.find((u) => u.id === id);

  const visibleCourses =
    currentUser?.role === "teacher"
      ? state.courses.filter((c) => c.teacherId === currentUser.id)
      : state.courses;

  const titleText = editingId ? "Edit course" : "Create course";
  const buttonLabel = editingId ? "Save changes" : "Create";

  const canEdit =
    currentUser && (currentUser.role === "admin" || currentUser.role === "teacher");

  return (
    <div>
      <h1 className="page-title">Courses</h1>

      {canEdit && (
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
              />
            </label>
            <label className="field-inline">
              <span>Teacher</span>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
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
        <div className="grid">
          {visibleCourses.map((c) => {
            const teacher = resolveTeacher(c.teacherId);
            return (
              <div key={c.id} className="card course-card">
                <h3>{c.title}</h3>
                <p className="muted">{c.description}</p>
                <p className="muted-small">
                  Teacher: {teacher ? teacher.name : "Unknown"}
                </p>
                {canEdit && (
                  <div className="actions" style={{ marginTop: "0.5rem" }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => startEdit(c.id)}
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
                )}
              </div>
            );
          })}
          {visibleCourses.length === 0 && (
            <p className="muted">No courses yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
