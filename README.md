# StudyNotion Online Education Platform (MERN App) [Website Link](https://study-notion-rouge-nu.vercel.app/)

![Main-Page](./src/assets/ReadmeFile/mainpage.png)

## Project Description

StudyNotion is a fully functional ed-tech platform that enables users to create, consume, and rate educational content. The platform is built using the MERN stack, which includes ReactJS, NodeJS, MongoDB, and ExpressJS. StudyNotion aims to provide:

- A seamless and interactive learning experience for students, making education more accessible and engaging.
- A platform for instructors to showcase their expertise and connect with learners across the globe.

## Table of Contents

- [System Architecture](#system-architecture)
- [Front-end](#front-end)
- [Back-end](#back-end)
- [Database Schema](#database-schema)
- [API Design](#api-design)
- [Deployment](#deployment)
- [Testing](#testing)
- [Future Enhancements](#future-enhancements)

## System Architecture

The StudyNotion ed-tech platform consists of three main components: the front end, the back end, and the database. The platform follows a client-server architecture, with the front end serving as the client and the back end and database serving as the server.

### Architecture Diagram

![Architecture Diagram](./src/assets/ReadmeFile/architecture.png)

## Front-end

The front end of the platform is built using ReactJS, which allows for the creation of dynamic and responsive user interfaces. The front end communicates with the back end using RESTful API calls.

### Pages

#### For Students:

- **Homepage**: Brief introduction to the platform, links to the course list and user details.
- **Course List**: List of all courses available on the platform, along with descriptions and ratings.
- **Wishlist**: Displays all courses a student has added to their wishlist.
- **Cart Checkout**: Allows the user to complete course purchases.
- **Course Content**: Course content for a particular course, including videos and other related material.
- **User Details**: Details about the student's account, including name, email, and other relevant information.
- **User Edit Details**: Allows the student to edit their account details.

#### For Instructors:

- **Dashboard**: Overview of the instructor's courses, along with ratings and feedback.
- **Insights**: Detailed insights into the instructor's courses, including views, clicks, and other relevant metrics.
- **Course Management Pages**: Allows the instructor to create, update, and delete courses, manage course content and pricing.
- **View and Edit Profile Details**: Allows the instructor to view and edit their account details.

#### For Admin (Future Scope):

- **Dashboard**: Overview of the platform's courses, instructors, and students.
- **Insights**: Detailed insights into the platform's metrics, including registered users, courses, and revenue.
- **Instructor Management**: Manage the platform's instructors, including account details, courses, and ratings.

### Technologies Used

- **ReactJS**: For building the user interface.
- **CSS & TailwindCSS**: For styling the user interface.
- **Redux**: For state management.

## Back-end

The back end of the platform is built using NodeJS and ExpressJS. It provides APIs for the front end to consume, which include functionalities such as user authentication, course creation, and course consumption.

### Features

- **User Authentication and Authorization**: Supports email/password login, OTP verification, and password reset.
- **Course Management**: Instructors can manage courses, students can view and rate courses.
- **Payment Integration**: Razorpay integration for payment handling.
- **Cloud-based Media Management**: Uses Cloudinary for storing and managing media content.
- **Markdown Formatting**: Stores course content in Markdown format for easier display and rendering on the front end.

### Technologies Used

- **Node.js**: Primary framework for the back end.
- **MongoDB**: Primary database for flexible and scalable data storage.
- **Express.js**: Web application framework.
- **JWT**: For authentication and authorization.
- **Bcrypt**: For password hashing.
- **Mongoose**: ODM library for MongoDB.

## Database Schema

### Data Models

- **Student Schema**: Fields include name, email, password, and course details.
- **Instructor Schema**: Fields include name, email, password, and course details.
- **Course Schema**: Fields include course name, description, instructor details, and media content.

![Database Schema](./src/assets/ReadmeFile/schema.png)

## API Design

The StudyNotion platform's API follows the REST architectural style. It uses JSON for data exchange and follows standard HTTP request methods such as GET, POST, PUT, and DELETE.

### Sample API Endpoints

- **/api/auth/signup (POST)**: Create a new user (student or instructor) account.
- **/api/auth/login (POST)**: Log in using existing credentials and generate a JWT token.
- **/api/auth/verify-otp (POST)**: Verify the OTP sent to the user's registered email.
- **/api/auth/forgot-password (POST)**: Send a password reset link to the registered email.
- **/api/courses (GET)**: Get a list of all available courses.
- **/api/courses/:id (GET)**: Get details of a specific course by ID.
- **/api/courses (POST)**: Create a new course.
- **/api/courses/:id (PUT)**: Update an existing course by ID.
- **/api/courses/:id (DELETE)**: Delete a course by ID.
- **/api/courses/:id/rate (POST)**: Add a rating (out of 5) to a course.

### Sample API Requests and Responses

#### GET /api/courses
Response: A list of all courses in the database.

#### GET /api/courses/:id
Response: The course with the specified ID.

#### POST /api/courses
Request: The course details in the request body.
Response: The newly created course.

#### PUT /api/courses/:id
Request: The updated course details in the request body.
Response: The updated course.

#### DELETE /api/courses/:id
Response: A success message indicating that the course has been deleted.

## Deployment

The platform is hosted on Vercel. The deployment process involves building the front end and back end separately and deploying them to the hosting environment.

## Testing

The platform uses a range of testing methods and frameworks to ensure its functionality and performance. 

### Types of Testing

- **Unit Testing**: Testing individual components and functionalities.
- **Integration Testing**: Testing the integration between different parts of the application.
- **End-to-End Testing**: Testing the complete flow of the application.

### Testing Tools

- **Jest**: For unit and integration testing.
- **Cypress**: For end-to-end testing.

## Future Enhancements

Potential future enhancements to the platform include:

- **Enhanced Analytics**: Adding more detailed analytics and reporting features.
- **Mobile App**: Developing a mobile app version of the platform.
- **Gamification**: Introducing gamification elements to make learning more engaging.
- **Internationalization**: Adding support for multiple languages to reach a broader audience.

## About

StudyNotion is a fully functional ed-tech platform that enables users to create, consume, and rate educational content. The platform is built using the MERN stack, which includes ReactJS, NodeJS, MongoDB, and ExpressJS.

## Resources

- **Frontend**: 
- **GitHub Repository**: [GitHub Link](https://github.com/khalekarakash05/StudyNotion)

## Topics

- MongoDB
- ReactJS
- Mongoose
- REST API
- ExpressJS
- Bcrypt
- Cloudinary
- Node.js
- JWT Authentication
- Razorpay API
- TailwindCSS

## Contact

For more information, please contact us at [akashkhalekar@gmail.com].


