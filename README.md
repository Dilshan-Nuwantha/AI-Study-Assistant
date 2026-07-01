# AI Study Assistant

AI Study Assistant is a full-stack web application designed to help students learn more effectively using AI-powered study tools. The platform includes features such as AI chat, document upload, content summarization, quiz generation, user authentication, and profile management.

## Features

- AI-powered chat assistant for study help and explanations
- Upload study materials and generate summaries
- Quiz generation based on user content
- User authentication and protected routes
- User profile and learning history management
- Responsive modern frontend experience

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- CSS

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Swagger API documentation

### AI Integration
- Google Gemini
- Groq

## Project Structure

```bash
AI-Study-Assistant/
├── backend/          # Express server and API routes
├── frontend/         # React + TypeScript client application
└── README.md         # Project documentation
```

## Prerequisites

Make sure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- MongoDB

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd AI-Study-Assistant
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and add the following environment variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will run on the Vite development server, usually at:

```bash
http://localhost:5173
```

## Usage

- Register or log in to access the app
- Upload study content or start chatting with the AI assistant
- Generate summaries and quizzes for your study materials
- Track your activity through your profile and history

## Contributing

Contributions are welcome. If you'd like to improve the project, feel free to fork the repository and submit a pull request.

## License

This project is currently unlicensed.
