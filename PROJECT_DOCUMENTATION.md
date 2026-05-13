# DreamCarta Project Documentation

## 1. Project Overview
DreamCarta is a life-goals and manifestation platform with three role-based experiences:
- User dashboard for goal, habit, dream, community, and profile workflows
- Mentor dashboard for coaching and guidance delivery
- Admin console for user management and platform moderation

The app is a React + TypeScript frontend with a Node/Express + Sequelize backend.

## 2. Runtime Setup
### Frontend
- Development URL: `http://localhost:8082`
- Legacy/dev mirror URL: `http://localhost:8081`
- API proxy in dev: `/api` -> `http://localhost:5000`

### Backend
- API base: `http://localhost:5000/api`
- Backend start command: `npm start` from `dreamcarta-backend`

## 3. Role Accounts Verified
### User
- `test@gmail.com` / `User@123`
- Lands on `/dashboard`

### Mentor
- `mentor@dreamcarta.in` / `Mentor@123`
- Lands on `/mentor`

### Admin
- `admin@dreamcarta.in` / `Admin@123`
- Lands on `/admin/users`

### Important note
- `user@dreamcarta.in` currently behaves as a mentor-side account in this data set, not as a standard user.

## 4. Authentication And Logout Behavior
- Login stores token and user session in localStorage.
- Logout clears the stored auth data.
- Browser tabs on the same origin share localStorage, so only one role session should be active per origin at a time.
- For reliable testing, log out before switching roles on the same host.

## 5. User Section Map
### Dashboard
- Summary cards for goals, habits, progress, and dreams
- Mentor advice panel
- Recent activity cards

### User Modules
- Goals
- Habits
- Dream Tracker
- Vision Board
- AI Coach
- Community
- History
- Profile
- Settings

### Verified API reads
- `GET /api/user/profile`
- `GET /api/goals`
- `GET /api/habits`
- `GET /api/dreams`
- `GET /api/vision-board/items`
- `GET /api/activity/all`

## 6. Mentor Section Map
### Mentor Dashboard
- Active users summary
- Selected user goals
- Quick focus cards
- Guidance composer

### Mentor-allowed routes
- `/dashboard/history`
- `/dashboard/community`
- `/dashboard/profile`
- `/dashboard/settings`

### Verified API reads
- `GET /api/mentor/users`
- `GET /api/mentor/goals/:userId`
- `GET /api/mentor/analytics`

### Guidance flow
- Mentor submits guidance through `POST /api/mentor/advice`
- Guidance is also surfaced in the UI notification/inbox flow

## 7. Admin Section Map
### Admin Console
- Dashboard
- Users
- Mentors
- Blogs
- Community
- Contacts
- Plans
- Reviews
- User Activity
- Settings

### Users Management
- Create user / mentor / admin
- Change role
- Toggle active/inactive
- Delete user

### Verified API reads
- `GET /api/admin/users`
- `GET /api/admin/stats`
- `GET /api/activity/all`

### Verified write API
- `PATCH /api/admin/users/:id/status`
- `PATCH /api/admin/users/:id`
- `PATCH /api/admin/users/:id/role`

## 8. Community And Activity
### Community
- Live community feed
- Likes, comments, shares
- User and admin-facing community surfaces use live API data

### Activity
- Admin user activity monitor uses backend activity records
- Mentor/user history surfaces live activity data

## 9. Theme Handling
- Theme preference is stored in localStorage under `dc_theme`
- The theme is applied early in `index.html` before React renders
- This prevents refreshes from falling back to light mode unexpectedly

## 10. Verified Testing Notes
### Logout/Login cycle
- User, mentor, and admin login flows were tested after clearing session storage
- Role redirects and landing pages were verified

### Route guard checks
- User cannot access `/admin`
- Mentor cannot access `/admin`
- Admin can access `/admin/users`

### API verification
- User profile fetch returned `200`
- Mentor users/analytics fetches returned `200`
- Admin users/stats fetches returned `200`
- Admin status update on a valid user returned `200`

## 11. Backend Notes
- Sequelize sync runs at startup
- Mentor advice is stored in SQL through the `MentorAdvice` model
- Admin and activity data are backed by SQL models and seeded tables

## 12. Current Caveats
- Some tabs may show stale HMR noise if they were opened before the dev server restart
- Use the 8082 dev server for the cleanest frontend proxy behavior during testing
- When switching between roles, log out or clear storage first to avoid auth overlap on the same origin

## 13. Suggested Verification Checklist
- User login -> dashboard
- User route guard on `/admin`
- Mentor login -> mentor dashboard
- Mentor allowed dashboard pages
- Mentor route guard on `/admin`
- Admin login -> users management
- Admin read APIs
- Admin update API on a valid user
- Theme refresh persistence after reload
