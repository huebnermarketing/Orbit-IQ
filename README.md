# Orbit IQ - Project Management System

A comprehensive project management system built with Laravel backend and Vue 3 frontend, designed to match ClickUp's functionality and interface.

## Tech Stack

- **Backend**: Laravel 11
- **Frontend**: Vue 3 + Vite
- **Database**: MySQL 8.0
- **Storage**: AWS S3
- **WebSocket**: Laravel WebSockets
- **Email**: Mailtrap (dev) / SendGrid (production)
- **Cache**: Redis
- **Authentication**: Laravel Sanctum

## Project Structure

```
orbit-iq/
├── backend/                 # Laravel API
├── frontend/               # Vue 3 Application
├── docs/                   # Documentation
└── README.md
```

## Getting Started

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Development Approach

This project follows an incremental development approach, building features step by step with parallel backend and frontend development.
