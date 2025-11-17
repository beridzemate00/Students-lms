# Students LMS – Mini Learning Management System (Frontend-Only)

A lightweight **Learning Management System (LMS)** built with **React + TypeScript + Vite**.  
This project is designed as a **student/portfolio-friendly** LMS: no backend, no database, all data is stored in `localStorage`, but the structure is close to a real app (roles, CRUD, assignments, etc.).

Perfect for:
- showing your **frontend + architecture skills**,
- demoing **role-based dashboards**,
- using as a base for a future fullstack LMS.

---

## ✨ Features

- 🔐 **Role-based auth (fake but realistic)**  
  - `admin`, `teacher`, `student` roles  
  - simple email/password login  
  - session stored in `localStorage`

- 👥 **User management (Admin)**
  - Create / edit / delete users
  - Roles: `student`, `teacher`, `admin`
  - **Student class groups** (e.g. `11B`, `5G`) via `classGroup` field

- 📚 **Course management (Teacher + Admin)**
  - Create / edit / delete courses
  - Each course is assigned to a **teacher**
  - Teachers see **only their own** courses
  - Students see all published courses (read-only)

- 📌 **Assignments management (Teacher + Admin)**
  - Create / edit / delete assignments
  - Assignment belongs to a course
  - Due date (optional, date picker)
  - Teachers see assignments only for their courses

- 📊 **Simple dashboards**
  - Role-aware navigation (admin/teacher/student see different options)
  - Quick overview of users, courses, assignments (counts)

- 💾 **Local-first data**
  - All data is stored in `localStorage` under a single key
  - Safe to refresh; state persists between reloads
  - Easy to “reset” by clearing browser storage

---

## 🧰 Tech Stack

- **React 18**
- **TypeScript**
- **Vite**
- React Router
- React Context API (`AuthContext`, `DataContext`)
- `localStorage` for persistence
- Simple CSS (no UI framework, easy to restyle)

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone git@github.com:beridzemate00/Students-LMS.git
cd Students-LMS
