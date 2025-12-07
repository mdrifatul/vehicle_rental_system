# Project Name : Vehicle rental system

Live Link : https://vehicle-rental-system-ass02.vercel.app

# Freature

User Management

-> User registration & login
-> Password hashing with bcrypt
-> JWT-based authentication
-> Role-based access (admin, customer)
-> Customers can update only their profile
-> Admins can update any user’s role or details

Vehicle Management

-> Add new vehicles (admin only)
-> Update vehicles (admin only)
-> Delete vehicles (admin only)
-> Auto-change availability status

Booking System

-> Customers can book available vehicles
-> Booking duration calculation
-> Auto price calculation based on rental days
-> Cancel booking before start date
-> Admin can mark booking as returned
-> System auto-marks booking as returned when end date passes
-> Vehicle availability auto-updated

Security

-> Password encrypted with bcrypt
-> JWT protected routes
-> Validation & error handling
-> Secure role-based operations

# Tech Stack

Backend

=> Node.js, Express.js, TypeScript

Database
=> PostgreSQL(NeonDB)

Security
=> Bcrypt, JSON Web Token (JWT)

Deployment
=> Vercel
