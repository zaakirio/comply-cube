# Comply Cube React Typescript Integration

This project integrates the ComplyCube API with a custom verification flow using a React frontend and a TypeScript/Node.js/Express backend. The application handles identity verification, including document upload and live photo.

## Tech Stack

### Frontend
- **React**: For building the user interface
- **TypeScript**: For type safety and better development experience
- **Tailwind CSS**: For utility-first CSS styling
- **ShadCN UI**: For reusable and customizable UI components
- **Vite**: Blazing fast frontend build tool build tool and development server

### Backend
- **Node.js**: JavaScript runtime environment for server-side operations
- **TypeScript**: For type safety and development consistency on the backend
- **Express.js**: A fast and minimal web framework for handling HTTP requests
- **Jest**: For unit and integration testing
- **Helmet**: For securing HTTP headers

## Features
- Identity verification for individuals
- Input validation for phone number, email, and personal details
- Frontend user flow to submit data for verification
- Backend API that integrates with the ComplyCube verification system

## Installation

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`.

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm run start
   ```

The backend will be available at `http://localhost:3001`.


### Environment Variables

Make sure to set the following environment variables in both the frontend and backend:

- **Frontend**: For handling API requests to the backend
  - `REACT_APP_API_URL`: The URL of your backend server (e.g., `http://localhost:3001`)

- **Backend**: For ComplyCube integration
  - `COMPLYCUBE_API_KEY`: Your ComplyCube API key


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

