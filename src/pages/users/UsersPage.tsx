import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import type { Role } from "../../types";

const roles: Role[] = ["student", "teacher", "admin"];

const UsersPage: React.FC = () => {
  const { state, addUser } = useData();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState<Role>("student");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    addUser({ name, email, password, role });
    setName("");
    setEmail("");
    setPassword("password123");
  };

  return (
    <div>
      <h1 className="page-title">Users</h1>
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 className="card-title">Create user</h2>
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
            Create
          </button>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
