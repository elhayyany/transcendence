# Overview
ft_transcendence is an immersive multiplayer online game project developed as part of the 42 school curriculum. This project reimagines the classic game "Pong" with modern twists and includes an array of features such as real-time multiplayer matches, user authentication through 42 Passport and Google OAuth, 2-step authentication for enhanced security, and dynamic microservices architecture. Additionally, it introduces chat functionality, chat groups, friend management, and blocked user management to create a comprehensive gaming community. Developed with NestJS for the backend, React for the front, PostgreSQL for the database, Docker for containerization, Nginx for web serving, and incorporating authentication from 42 Passport and Google, this project offers a comprehensive learning experience in modern web development.

# Features
Real-Time Multiplayer: ft_transcendence offers players a captivating real-time multiplayer experience, elevating gameplay with instantaneous interactions.

User Authentication: Players can securely register and log in via 42 Passport and Google OAuth, providing seamless access and enhanced security through trusted third-party authentication.

2-Step Authentication: The game implements 2-step authentication for an added layer of security, ensuring players' accounts are well-protected.

Chat and Chat Groups: Players can engage in real-time chat with other players and create or join chat groups, fostering communication and community building.

Friend Management: The project incorporates friend management, allowing players to send and accept friend requests to connect with each other.

Blocked User Management: Players can block users to manage their interactions and ensure a comfortable gaming environment.

Leaderboards: The game boasts leaderboards to showcase top players and their scores, encouraging healthy competition among players.

Tournaments: ft_transcendence introduces in-game tournaments, allowing players to display their skills and compete for rewards.

# Tech Stack

Backend Framework: The backend is built with NestJS, a versatile Node.js framework known for creating scalable and performant server-side applications.

Frontend Framework: React, a widely-used JavaScript library for crafting dynamic user interfaces, serves as the foundation for the front end.

Database Management: PostgreSQL is chosen as the database management system, providing reliable data storage for user profiles, game states, chat messages, and scores.

Authentication: ft_transcendence integrates authentication via 42 Passport and Google OAuth, enabling seamless registration and login processes.

2-Step Authentication: The project incorporates 2-step authentication, enhancing security through an additional verification layer.

Containerization with Docker: Docker facilitates consistent deployment and ensures uniform behavior across various environments.

Web Serving with Nginx: Nginx functions as the web server, expertly managing incoming traffic and routing requests.

# Architecture
ft_transcendence follows a microservices architecture, segmenting functionalities into distinct backend services:

Authentication Service: Manages user registration, authentication, and authorization, providing secure access through 42 Passport and Google OAuth.

Game Service: Handles core game logic, real-time interactions, and tournament management, delivering a seamless gameplay experience.

Chat Service: Enables real-time chat functionality and manages chat groups, enhancing player interactions.

User Service: Manages user profiles, friend interactions, blocked users, messaging, and leaderboard tracking, fostering a vibrant gaming community.

Database Service: Connects to the PostgreSQL database, handling player data, game states, scores, chat messages, and more.

# Deployment
The Dockerized architecture ensures a straightforward deployment process across various environments, making ft_transcendence accessible via cloud platforms or dedicated servers.

# Security
ft_transcendence emphasizes data security, utilizing hashed passwords, secure API endpoints, and 2-step authentication. HTTPS encryption safeguards communication between clients and the server.

# Conclusion
ft_transcendence stands as a comprehensive and engaging project that seamlessly blends modern technologies. Leveraging NestJS, React, PostgreSQL, Docker, and Nginx, and integrating authentication from 42 Passport and Google OAuth, the project constructs a captivating online gaming experience. The addition of chat functionality, chat groups, friend management, and blocked user management fosters a dynamic and interconnected gaming community. Developers gain practical experience in frontend and backend development, database management, security implementation, containerization, web serving, and third-party authentication, making ft_transcendence an exceptional educational endeavor.
