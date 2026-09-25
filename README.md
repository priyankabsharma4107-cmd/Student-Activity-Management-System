# 🎓 Student Activity Management System

> A modern web-based platform that helps students manage, track, and showcase their academic and extracurricular activities from one place.

---

## 📌 About the Project

The **Student Activity Management System** is a full-stack web application designed to make student activity management **simple, organized, and accessible**.

Students participate in various academic and extracurricular activities throughout their college journey. However, information related to registrations, participation, certificates, and achievements can often become scattered across different platforms, documents, or records.

This project brings these important student activity records together into **one personalized student portal**.

Students can explore campus activities, register for activities, view their participation records, access certificates and achievements, and understand their overall activity progress through analytics.

The system also includes **NOVA — Campus Activity Assistant**, a built-in chat-based assistant that allows students to quickly access their student-specific activity information from the portal and database.

---

## 🎯 Project Vision

> **One portal. One student profile. One place for every achievement.**

The goal of this project is to create a centralized digital environment where students can easily manage their college activity journey without having to depend on multiple separate systems.

---

## ✨ Key Features

### 🔐 Student Authentication

* Student registration and login
* Individual student accounts
* Personalized student data
* Logout functionality

### 📊 Personalized Dashboard

* Activity overview
* Upcoming activities
* Participation summary
* Certificates and achievements
* Activity analytics

### 📅 Activities

Students can explore available campus activities with details such as:

* Activity name
* Category
* Date
* Venue
* Available capacity

### 📝 Activity Registration

* Register for available activities
* View registered activities
* Track registration status

### 🎯 Participation

Students can view their participation records, including:

* Attendance status
* Participation role
* Associated activity

### 🏆 Certificates

A dedicated section where students can view their earned certificates and related details.

### 🌟 Achievements

Students can maintain and showcase their achievements, including:

* Achievement title
* Description
* Achievement date

### 📈 Analytics

The Analytics section provides a visual overview of the student's activity information.

It helps students view:

* Activity participation
* Registration information
* Participation progress
* Overall activity statistics

The analytics section presents student activity data in a clear and easy-to-understand format.

### ✦ NOVA — Campus Activity Assistant

**NOVA is the built-in campus activity assistant of the Student Portal.**

**It helps students quickly access their student-specific information, including:**

* **📅 My activities**
* **⏰ Upcoming activities**
* **📝 My registrations**
* **🎯 My participation**
* **🏆 My certificates**
* **🌟 My achievements**

**NOVA retrieves relevant information from the student portal and database, allowing students to get activity-related information quickly through a simple chat interface.**

#### 💬 Example Queries

**Students can interact with NOVA to access information related to their activity records.**

```text
Student → "Show my registrations"
          ↓
        NOVA
          ↓
   Student Database
          ↓
 Registration Information
```

**NOVA is designed to make accessing student activity information faster, simpler, and more interactive.**

---

## 🖥️ Student Portal

**The Student Portal provides a clean and organized dashboard experience.**

### Main Sections

```text
Student Portal
│
├── 📊 Dashboard
│
├── 📅 Activities
│
├── 📝 Registrations
│
├── 🏆 Certificates
│
├── 🌟 Achievements
│
├── 📈 Analytics
│
├── ✦ NOVA
│
└── 👤 Profile
```

---

## 🏗️ System Workflow

**The overall system follows a simple student-centered workflow:**

```text
                    ┌─────────────────┐
                    │     Student     │
                    └────────┬────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Login / Registration│
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Student Dashboard   │
                  └──────────┬──────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
   Activities          Registrations        Participation
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        Certificates   Achievements    Analytics
              │              │              │
              └──────────────┼──────────────┘
                             │
                             ▼
                    ✦ NOVA Assistant
                             │
                             ▼
                  Student-Specific Data
```

---

## 🗄️ Database Structure

The system uses **MySQL** to store and manage student activity data.

The database contains the following main tables:

| Table           | Purpose                                        |
| --------------- | ---------------------------------------------- |
| `students`      | Stores student account and profile information |
| `activities`    | Stores available campus activity details       |
| `registrations` | Stores student activity registrations          |
| `participation` | Stores attendance and participation records    |
| `certificates`  | Stores student certificate details             |
| `achievements`  | Stores student achievement records             |

### 🔗 Database Relationship

```text
Students
   │
   ├──────── Registrations ──────── Activities
   │
   ├──────── Participation ──────── Activities
   │
   ├──────── Certificates
   │
   └──────── Achievements
```

---

## 🛠️ Technologies Used

### 🎨 Frontend

* CSS3
* JavaScript

### ⚙️ Backend

* Flask

### 🗄️ Database

* MySQL

### 🤖 Assistant

* NOVA — Campus Activity Assistant

---

## 📂 Project Structure

```text
Student-Activity-Management-System/
│
├── backend/
│   ├── app.py
│   └── app_backup.py
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── script.js
│   └── style.css
│
├── static/
│
├── .gitignore
├── README.md
└── requirements.txt
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/priyankabsharma4107-cmd/Student-Activity-Management-System.git
```

### 2. Navigate to the Project

```bash
cd Student-Activity-Management-System
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure MySQL

Create the required database in MySQL:

```text
student_activity_db
```

Configure the database connection in:

```text
backend/app.py
```

according to your local MySQL credentials.

### 5. Run the Application

```bash
python backend/app.py
```

Open the application in your browser:

```text
http://127.0.0.1:5000
```

---

## 🔑 Core Modules

| Module                | Description                                            |
| --------------------- | ------------------------------------------------------ |
| **🔐 Authentication** | Handles student registration and login                 |
| **📊 Dashboard**      | Provides a personalized overview of student activities |
| **📅 Activities**     | Displays available campus activities                   |
| **📝 Registration**   | Manages activity registrations                         |
| **🎯 Participation**  | Tracks attendance and participation                    |
| **🏆 Certificates**   | Displays earned certificates                           |
| **🌟 Achievements**   | Manages student achievements                           |
| **📈 Analytics**      | Visualizes student activity data                       |
| **✦ NOVA**            | Provides quick access to student activity information  |

---

## 🎯 Project Objectives

* Create a centralized platform for student activities
* Reduce manual management of activity records
* Make activity registration easier for students
* Maintain participation and achievement records
* Provide a centralized certificate section
* Visualize student activity progress
* Provide quick information through NOVA
* Improve the overall student activity management experience

---

## 👥 Target Users

The primary users of the system are:

* 🎓 Students
* 🧑‍🏫 Faculty / Coordinators
* 🏫 Educational Institutions

---

## 🌟 Why This Project?

Students participate in many academic and extracurricular activities throughout their college journey. However, their registrations, participation records, certificates, and achievements can often become scattered across different platforms or documents.

The **Student Activity Management System** brings these records together into one organized platform, making it easier for students to **manage, track, and showcase their college activities**.

The integration of **NOVA** further allows students to quickly access their activity-related information through a simple chat interface.

---

## 📌 Project Status

### ✅ Working Student Portal

The current system includes:

* Student authentication
* Activity management
* Activity registrations
* Participation records
* Certificates
* Achievements
* Analytics
* NOVA — Campus Activity Assistant

---

## 💡 Project Highlights

```text
┌───────────────────────────────────────────────┐
│       STUDENT ACTIVITY MANAGEMENT SYSTEM      │
├───────────────────────────────────────────────┤
│                                               │
│   🔐 Authentication                           │
│   📊 Personalized Dashboard                   │
│   📅 Activity Management                      │
│   📝 Activity Registration                    │
│   🎯 Participation Tracking                   │
│   🏆 Certificate Management                   │
│   🌟 Achievement Tracking                     │
│   📈 Activity Analytics                       │
│   ✦ NOVA Campus Activity Assistant            │
│                                               │
└───────────────────────────────────────────────┘
```

---

## 👩‍💻 Developer

**Priyanka Sharma**

Bachelor of Computer Applications with Artificial Intelligence

Pillai University, School of Computing

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub!
