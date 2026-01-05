# Student Career Counsellor (Final Year Project)

This project is a comprehensive **Student Career Counselling System** designed to assist students in making informed academic and career decisions. It utilizes an **ID3 Decision Tree** algorithm to provide personalized recommendations based on the user's academic performance, interests, and preferences.

The application features a modern, interactive React frontend and a robust Node.js/Express backend.

## 🚀 Features

-   **Intelligent Recommendations**: Uses the ID3 algorithm to analyze user data (GPA, interests, financial preference, etc.) and suggest suitable career paths or academic streams.
-   **Multi-Level Guidance**: Supports different user levels such as **SEE** (Secondary Education Examination), **Plus Two**, and **Bachelor**.
-   **Interactive UI**: Built with **React**, **Framer Motion**, and **Tailwind CSS** for a smooth, responsive, and visually appealing user experience.
-   **Authentication**: Secure user authentication using JSON Web Tokens (JWT).
-   **Data Visualization**: Visualizes results using **Recharts**.

## 🛠 Tech Stack

### Client (Frontend)
-   **React**: UI Library
-   **Vite**: Build tool and development server
-   **Tailwind CSS**: Utility-first CSS framework
-   **Framer Motion**: Animation library
-   **React Router DOM**: Client-side routing
-   **Recharts**: Charting library
-   **Lucide React**: Icons

### Backend (Server)
-   **Node.js**: Runtime environment
-   **Express**: Web application framework
-   **Mongoose**: MongoDB object modeling
-   **ID3 Algorithm**: Custom implementation for decision tree learning
-   **Authentication**: `bcryptjs` for hashing and `jsonwebtoken` for auth

## 📂 Project Structure

-   **`client/`**: Contains the React frontend application.
    -   `src/components`: UI components.
    -   `src/pages`: Application pages.
-   **`backend/`**: Contains the Node.js server and ML logic.
    -   `ml/`: Machine learning modules (`id3.js`) and training data (`trainingdata.txt`).
    -   `models/`: Mongoose schemas.
    -   `app.js`: Main entry point for the server.

## 🏁 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites
-   Node.js (v14+ recommended)
-   MongoDB (Ensure your MongoDB instance is running or use a cloud URI)

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    -   Create a `.env` file in the `backend` directory.
    -   Add necessary variables (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`).
4.  Start the server:
    ```bash
    npm start
    # Or for development with nodemon:
    npm run dev
    ```
    The server typically runs on `http://localhost:3000`.

### 2. Client Setup

1.  Open a new terminal and navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173`.

## 🧠 Machine Learning Integration

The project uses a custom ID3 decision tree implementation located in `backend/ml/id3.js`.
-   **Training**: The model is trained using data provided in `backend/ml/trainingdata.txt` (or other data sources).
-   **Prediction**: The API exposes an endpoint to generate recommendations based on the trained model.
