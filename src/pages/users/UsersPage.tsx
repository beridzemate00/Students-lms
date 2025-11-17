import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import type { Role, User } from "../../types";

const roles: Role[] = ["student", "teacher", "admin"];

const UsersPage: React.FC = () => {
  const { state, addUser, updateUser, deleteUser } = useData();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState<Role>("student");

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setPassword("password123");
    setRole("student");
  };

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password);
    setRole(user.role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    if (editingId) {
      updateUser({ id: editingId, name, email, password, role });
    } else {
      addUser({ name, email, password, role });
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this user?")) return;
    deleteUser(id);
  };

  const title = editingId ? "Edit user" : "Create user";
  const buttonLabel = editingId ? "Save changes" : "Create";

  return (
    <div>
      <h1 className="page-title">Users</h1>
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 className="card-title">{title}</h2>
        <form className="simple-form" onSubmit={handleSubmit}>
          <label className="field-inline">
            <span>Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="field-inline">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="field-inline">
            <span>Password</span>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <label className="field-inline">
            <span>Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
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

      <div className="card">
        <h2 className="card-title">All users</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th style={{ width: "140px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td className="muted-small">{u.email}</td>
                <td>
                  <span className="pill">{u.role}</span>
                </td>
                <td>
                  <div className="actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => startEdit(u)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {state.users.length === 0 && (
              <tr>
                <td colSpan={4} className="muted">
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
