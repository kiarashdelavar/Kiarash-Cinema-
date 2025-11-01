#  Kiarash Cinema – Web Advanced Project

##  Introduction

Kiarash Cinema is a full-stack web application for reserving movie theater seats. It allows users to register, log in, and reserve multiple seats in real-time. Admins can manage movies, seats, and users while enforcing access controls. The system is developed using **Svelte** on the frontend and **Node.js/Express** on the backend, with a RESTful API and secure authentication.

This project builds upon the fundamentals taught in Web Basics (HTML, CSS, JavaScript, REST) and enhances them with client-server interaction, real-time updates, and full-stack development principles.

---

##  Template Overview

This project follows the Web Advanced template, which includes:

- `assignment/`: Assignment specification and functional design
- `client/`: Svelte frontend application
- `server/`: Express backend API
- `documentation/`: Markdown documentation
- `README.md`: Project overview

---

##  Assignment Description

You are required to build a **reservation system**. In this case, the reservable items are **movie theater seats**. The system supports the following features:

- Users can view, select, and reserve seats for a chosen movie, showtime, and building.
- Admins can create, update, and delete movies, showtimes, and buildings.
- Both roles are authenticated using JWT.
- Admins cannot reserve items unless also a user.
- Users can manage their reservations and cancel them if needed.

---

##  Actors

- **User**: Can view movies and available seats, make reservations, and manage personal data.
- **Admin**: Can manage movies, showtimes, and seats, and see user behavior/statistics. Must log in separately as a user to make reservations.

> The login credentials for one **admin** and one **user** are documented in `documentation/users.md`.

---

##  User Stories

| ID     | User Story                                                                 |
|--------|----------------------------------------------------------------------------|
| US-01  | As a user, I want to log in to make a reservation.                        |
| US-02  | As a user, I need a real-time overview of items to avoid booking errors.  |
| US-03  | As a user, I want to see my reservations.                                 |
| US-04  | As a user, I want to manage my personal data.                             |
| US-05  | As a user, I want to reserve more than one item at once.                  |
| US-06  | As a user, I want to cancel a reservation if I don’t need it.             |
| US-07  | As an admin, I want to log in to manage reservable items.                 |
| US-08  | As an admin, I want to see reservations per item.                         |
| US-09  | As an admin, I want to limit how many items a user can reserve.           |
| US-10  | As an admin, I want to deactivate users to ensure security.               |
| US-11  | As an admin, I want items to be reservable by date/time/duration.         |
| US-12  | As a user, I want to reserve for a specific date and time.                |

---

##  Functional Requirements

| ID     | Requirement                                                              | Source     | MoSCoW |
|--------|-------------------------------------------------------------------------|------------|--------|
| FR-01  | There should be a list of reservable items                              | US-02      | MUST   |
| FR-02  | Users should be able to log in                                           | US-01/07   | MUST   |
| FR-03  | User accounts must be manageable                                         | US-04/10   | SHOULD |
| FR-04  | Display a list of reservable items                                       | US-02/03   | MUST   |
| FR-05  | Items must be reservable by a user                                       | US-05      | MUST   |
| FR-06  | Allow cancellations at least 24 hours in advance                         | US-06      | SHOULD |
| FR-07  | It must be possible to search a specific user                            | US-10      | MUST   |
| FR-08  | It must be possible to search a specific item                            | US-08      | MUST   |
| FR-09  | It must be possible to search a specific reservation                     | US-08      | MUST   |
| FR-10  | A user must be able to reserve multiple items at once                    | US-05      | MUST   |
| FR-11  | Changes in reservable items must be reflected immediately                | US-02      | SHOULD |

---

##  Non-Functional Requirements

| ID      | Requirement                                                                 | Source     | MoSCoW |
|---------|------------------------------------------------------------------------------|------------|--------|
| NFR-01  | Items must have a unique name and max reservable amount                     | US-02/05   | MUST   |
| NFR-02  | Items must be reserved for a specific date/time/duration                    | US-11      | MUST   |
| NFR-03  | User accounts consist of email and roles                                    | US-01/07   | MUST   |
| NFR-04  | Items must have at least 3 filterable attributes (not including name)       | -          | MUST   |
| NFR-05  | Inputs should be validated client- and server-side                          | -          | MUST   |
| NFR-06  | Inputs should be sanitized server-side                                      | -          | MUST   |
| NFR-07  | Server-side validation must use regex                                       | -          | MUST   |
| NFR-08  | API must return valid JSON                                                  | -          | MUST   |
| NFR-09  | API must return correct HTTP status codes                                   | -          | MUST   |
| NFR-10  | API must use correct HTTP verbs                                             | -          | MUST   |
| NFR-11  | API must follow REST Level 3                                                | -          | MUST   |
| NFR-12  | API must support filtering with query parameters                            | -          | MUST   |
| NFR-13  | API should support sorting via query parameters                             | -          | SHOULD |
| NFR-14  | API should support limiting via query parameters                            | -          | SHOULD |
| NFR-15  | Both client and server must return clear error messages                     | -          | MUST   |
| NFR-16  | Both frontend and backend follow separation of concerns                     | -          | MUST   |
| NFR-17  | Frontend is built with **Svelte** (not SvelteKit)                           | -          | MUST   |
| NFR-18  | Backend is built using **Node.js + Express**                                | -          | MUST   |
| NFR-19  | Frontend uses reusable components with logical file structure               | -          | MUST   |
| NFR-20  | JWT is used for authorization                                               | -          | MUST   |
| NFR-21  | Role-based authentication must be implemented                               | -          | MUST   |
| NFR-22  | Users may have multiple roles                                               | -          | MUST   |
| NFR-23  | The API must be fully tested with automated tests                           | -          | SHOULD |
| NFR-24  | Use ORM (Sequelize) for DB interactions                                     | -          | MUST   |

---

##  Tech Stack

- **Frontend**: Svelte, Tailwind CSS, Page.js  
- **Backend**: Node.js, Express  
- **Database**: PostgreSQL (via Sequelize ORM)  
- **Authentication**: JWT  
- **Authorization**: Role-based  
- **Real-time updates**: Server-Sent Events (SSE)  
- **Testing**: Vitest, Supertest  
- **Documentation**: JSDoc, Swagger  

---

##  Getting Started

###  Setup Backend

```bash
cd server
npm install
npm run dev
```

###  Setup Frontend

```bash
cd client
npm install
npm run start
```

###  View Swagger API Documentation

Once your backend is running, open your browser and go to:

```
http://localhost:3000/api-docs
```

---

##  Documentation

All written documentation must be placed in the `documentation/` folder. Markdown (`.md`) format is required for all files.

- Do **not** use PDF or Word files.
- Include screenshots, diagrams, or images to improve clarity.
- Make sure to include:
  - Admin and User test credentials
  - ER diagrams or DB schema (if available)
  - Any project-related notes or instructions

Example:

```
documentation/
├── credentials.md
├── api-design.md
├── db-schema.md
└── user-guide.md
```

---

##  Learning Goals

| Competence | Learning Goal                                                                 |
|------------|--------------------------------------------------------------------------------|
| SW/REA/2   | You design, implement and test (automated) REST API's.                        |
| SW/REA/2   | You build a REST server using Node.js.                                        |
| SW/REA/2   | You restrict access and functionality using token-based authentication.       |
| SW/REA/2   | You are aware of common security issues for web applications and avoid them.  |
| SW/REA/2   | You implement user interfaces using the functional reactive paradigm (Svelte).|
| SW/REA/2   | You select and use appropriate front-end data storage for your application.   |

