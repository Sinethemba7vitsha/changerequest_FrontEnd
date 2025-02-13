ChangeRequest Frontend

Overview

ChangeRequest Frontend is a web application built with Vue.js that provides an intuitive interface for managing change requests. The frontend interacts with a backend service to create, update, and track change requests efficiently.

Features

Create new change requests

View and update existing change requests

Responsive UI using HTML, CSS, and Vue.js

Seamless interaction with the backend API

Technologies Used

Vue.js - JavaScript framework for building UI components

HTML - Structuring the web pages

CSS - Styling and layout design

JavaScript - Logic implementation and API communication

Installation

Clone the repository:

git clone https://github.com/your-username/changerequest_frontend.git
cd changerequest_frontend

Install dependencies:

npm install

Start the development server:

npm run serve

Open your browser and visit http://localhost:8080/

Project Structure

changerequest_frontend/
│── public/          # Static assets
│── src/
│   ├── components/  # Vue components
│   ├── views/       # Page views
│   ├── router/      # Vue Router setup
│   ├── store/       # Vuex store (if used)
│   ├── assets/      # Images, styles
│   ├── App.vue      # Root Vue component
│   ├── main.js      # Application entry point
│── package.json     # Project dependencies and scripts
│── README.md        # Project documentation

API Integration

This frontend application communicates with a backend API. Ensure the backend is running and update the API base URL in the configuration file if necessary.

Deployment

To build for production:

npm run build

This will generate a dist/ folder containing the optimized build files. Deploy these files to a web server or cloud platform.

Contribution

Feel free to contribute by submitting pull requests or opening issues for feature suggestions and bug reports.


![image](https://github.com/user-attachments/assets/b22ab002-14d3-4757-b8f3-fe597a07d34c)
