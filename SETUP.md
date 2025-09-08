# Orbit IQ - Setup Guide

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- Redis (optional, for caching)

### 1. Backend Setup (Laravel)

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env file
# DB_DATABASE=orbit_iq
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Start the server
php artisan serve
```

Backend will be available at: `http://localhost:8000`

### 2. Frontend Setup (Vue 3)

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
APP_NAME="Orbit IQ"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=orbit_iq
DB_USERNAME=root
DB_PASSWORD=

# Redis (for caching)
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# AWS S3 (for file storage)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=

# WebSockets
PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

# Email (Mailtrap for development)
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@orbitiq.com"
```

### Frontend Environment Variables (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# WebSocket Configuration
VITE_PUSHER_APP_KEY=
VITE_PUSHER_HOST=
VITE_PUSHER_PORT=443
VITE_PUSHER_SCHEME=https
VITE_PUSHER_APP_CLUSTER=mt1

# App Configuration
VITE_APP_NAME="Orbit IQ"
```

## 📁 Project Structure

```
Orbit IQ/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Services/
│   ├── config/
│   ├── database/migrations/
│   └── routes/
├── frontend/               # Vue 3 Application
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── stores/
│   │   └── router/
│   └── package.json
└── README.md
```

## 🎯 Development Workflow

1. **Start Backend**: `cd backend && php artisan serve`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Access Application**: `http://localhost:3000`

## 🔐 Authentication

The system uses Laravel Sanctum for API authentication:
- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Logout: `POST /api/auth/logout`
- Profile: `GET /api/profile`

## 📊 Database Schema

- **users** - User accounts and profiles
- **workspaces** - Project workspaces
- **projects** - Individual projects
- **tasks** - Task management
- **teams** - Team collaboration
- **workspace_members** - Workspace membership
- **team_members** - Team membership

## 🚀 Next Steps

1. Set up your database credentials
2. Configure AWS S3 for file storage
3. Set up Redis for caching
4. Configure WebSockets for real-time features
5. Start building features incrementally!

## 🛠️ Available Commands

### Backend
```bash
php artisan serve          # Start development server
php artisan migrate        # Run database migrations
php artisan make:model     # Create new model
php artisan make:controller # Create new controller
php artisan queue:work     # Process queued jobs
```

### Frontend
```bash
npm run dev               # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript checks
```

## 🎨 Design System

The frontend uses Tailwind CSS with a ClickUp-inspired design:
- Primary colors: Blue theme
- Clean, modern interface
- Responsive design
- Dark mode support (planned)

## 📱 Features Roadmap

- [ ] User authentication
- [ ] Workspace management
- [ ] Project creation and management
- [ ] Task management with subtasks
- [ ] Team collaboration
- [ ] Real-time updates via WebSockets
- [ ] File uploads to AWS S3
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] Time tracking
- [ ] Reporting and analytics
