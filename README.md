## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js**: Version 18.20.7 or higher
- **npm**: Version 10.8.2 or higher
- **Git**: For cloning the repository

### 1. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

#### Start the Backend Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

The backend server will start on `http://localhost:3001`

### 2. Frontend Setup

Open a new terminal and navigate to the client directory:

```bash
cd client
npm install
```

#### Start the Frontend Development Server

```bash
npm run dev
```

The frontend application will start on `http://localhost:5173`

### Frontend (client/)

```bash
npm run dev          # Start development server
npm run build        # Build for production
```

### Backend (server/)

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server
```
