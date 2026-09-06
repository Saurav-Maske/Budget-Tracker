# Budget Tracker

## Overview
A personal budget tracking application for managing income, expenses, budgets, and financial reports. Users can create an account, record transactions, organize transactions by category, manage budgets, view spending insights, and export a report as a PDF.

## Tech Stack
- **Frontend**: React (via create-react-app)
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JSON Web Tokens and bcryptjs
- **Charts**: Recharts
- **Reports**: jsPDF
- **Package Managers**: 
  - Backend: npm
  - Frontend: npm (via create-react-app)

## Getting Started
Install Node.js, npm, and PostgreSQL before starting the application.

Create a PostgreSQL database for the project and make sure the database server is running. The backend reads its database connection settings from environment variables.

## Installation
1. Clone or download the repository.
2. Open a terminal in the project directory.
3. Install the backend dependencies by running `npm install` from the `backend` directory.
4. Install the frontend dependencies by running `npm install` from the `frontend` directory.
5. Create a `.env` file in the `backend` directory with the following values:
  `DB_USER=your_postgres_user`
  `DB_PASSWORD=your_postgres_password`
  `DB_NAME=your_database_name`
  `DB_HOST=localhost`
  `DB_PORT=5432`
  `JWT_SECRET=your_secret_key`

## Usage
Start the backend from the `backend` directory with `npm start`. The API runs on port 5000 by default.

Start the frontend from the `frontend` directory with `npm start`. The React application runs at `http://localhost:3000`.

Create an account or log in to use the application. Add income and expense transactions, edit or delete existing transactions, create budgets for expense categories, review report charts, and export a financial summary as a PDF.



