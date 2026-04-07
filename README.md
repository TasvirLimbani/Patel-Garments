# Employee Management System (HRM)

A modern, feature-rich Human Resource Management system built with Next.js, React, and TypeScript. This system provides comprehensive employee management, work tracking, salary management, and advance request handling.

## Features

### 1. **Authentication & Authorization**
- Login page with email and password authentication
- Mock authentication (any email/password combination works)
- Admin and Employee role-based access
- Session management with automatic redirects

### 2. **Dashboard Overview**
- Real-time employee statistics
- Present today count
- Pending advances summary
- Total payroll calculation
- Recent activities feed
- Daily work summary

### 3. **Employee Management**
- View all employees with detailed information
- Search and filter employees
- Employee status (Active/Inactive)
- Display employee details: Name, Position, Department, Email, Phone
- Summary statistics

### 4. **Work Entries (Attendance)**
- Check-in and Check-out functionality
- Real-time attendance tracking
- Work hours calculation
- Date-wise entry filtering
- Attendance status (Present, Absent, Half-day)
- Employee-wise entry logs

### 5. **Advance Requests**
- Request advances with amount and reason
- Approval workflow for admins
- Approve/Reject functionality
- Track advance status (Pending, Approved, Rejected, Paid)
- Balance tracking
- Summary by status

### 6. **Salary Management**
- View salary components (Basic, HRA, DA, Allowances)
- Salary status tracking (Pending, Approved, Paid)
- Deduction calculations
- Admin approval workflow
- Salary payment processing
- Monthly salary overview
- Payroll summaries

### 7. **Sidebar Navigation**
- Easy navigation between all modules
- Current page highlighting
- Logout functionality
- Quick access to all features

## Technical Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: React with Shadcn/UI components
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **State Management**: React Context API
- **Animations**: Custom CSS animations with Tailwind

## Project Structure

```
/app
  /dashboard
    - layout.tsx
    - page.tsx
  /employees
    - layout.tsx
    - page.tsx
  /entries
    - layout.tsx
    - page.tsx
  /advances
    - layout.tsx
    - page.tsx
  /salary
    - layout.tsx
    - page.tsx
  layout.tsx
  page.tsx (Login)
  globals.css

/components
  - Sidebar.tsx
  - TopNav.tsx
  - DashboardOverview.tsx
  - EmployeesPage.tsx
  - EntriesPage.tsx
  - AdvancesPage.tsx
  - SalaryPage.tsx

/context
  - AuthContext.tsx (Authentication)
  - AppContext.tsx (App State Management)

/lib
  - mockData.ts (Mock database)
  - utils.ts (Utility functions)
```

## Key Components

### AuthContext
Handles user authentication and session management:
- `login(email, password)` - Authenticates user
- `logout()` - Clears session
- `user` - Current user object
- `isLoggedIn` - Authentication status

### AppContext
Manages application state and data:
- Employee CRUD operations
- Work entry management
- Advance request handling
- Salary management

### Mock Data
Pre-populated with sample data:
- 6 employees
- 3 salary records
- 4 work entries
- 3 advance requests

## Color Scheme

- **Primary Color**: #00885a (Green)
- **Secondary Color**: #feb752 (Orange)
- **Backgrounds**: White, Gray-100, Gray-50
- **Text**: Gray-800, Gray-600

## Animations

All pages feature smooth animations:
- `animate-fade-in` - Fade in effect
- `animate-slide-in-left` - Slide from left
- `animate-slide-in-right` - Slide from right
- `animate-pulse-glow` - Pulsing glow effect

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Access the Application

1. **Login Page**: http://localhost:3000
   - Enter any email and password
   - Demo: demo@example.com / password123

2. **Dashboard**: http://localhost:3000/dashboard
   - Overview of all metrics
   - Quick statistics

3. **Employees**: http://localhost:3000/employees
   - Employee directory

4. **Work Entries**: http://localhost:3000/entries
   - Check-in/Check-out
   - Attendance tracking

5. **Advances**: http://localhost:3000/advances
   - Request advances
   - Manage advance requests (Admin)

6. **Salary**: http://localhost:3000/salary
   - View salary details
   - Approve/Pay salaries (Admin)

## Usage Guide

### Login
1. Go to the home page
2. Enter email and password (any values work)
3. Click "Sign In"
4. Redirected to dashboard

### Check-in/Check-out
1. Navigate to "Work Entries"
2. Click "Check In" button
3. Time is automatically recorded
4. Click "Check Out" when leaving
5. Work hours are calculated

### Request Advance
1. Go to "Advances"
2. Click "Request New Advance"
3. Enter amount and reason
4. Submit request
5. Admins can approve/reject

### Manage Salary
1. Navigate to "Salary Management"
2. Filter by status (All, Pending, Approved, Paid)
3. View salary breakdown
4. Admins can approve and process payments

### Logout
1. Click logout button in sidebar
2. Redirected to login page

## Data Persistence

Currently uses mock data stored in memory. Data resets on page refresh. For production:
- Replace with actual database (Supabase, PostgreSQL, etc.)
- Implement proper authentication
- Add persistent storage

## Admin Features

Users with email containing "admin" automatically get admin role:
- Approve/Reject advance requests
- Approve/Pay salaries
- Access all employee data
- Manage all records

## Responsive Design

- Mobile-first approach
- Fully responsive on all screen sizes
- Optimized for tablets and desktops
- Touch-friendly navigation

## Performance

- Optimized component rendering
- Efficient state management
- Lazy loading where applicable
- Fast page transitions

## Security Considerations

Current implementation is a demo. Production recommendations:
- Use proper authentication (OAuth, JWT)
- Implement secure session management
- Add input validation and sanitization
- Use environment variables for secrets
- Implement proper authorization checks
- Add audit logging
- Encrypt sensitive data

## Future Enhancements

- Database integration
- Real authentication system
- Email notifications
- Report generation
- Data export (CSV, PDF)
- Advanced filtering and sorting
- User role management
- Department management
- Leave management
- Performance reviews
- Mobile app

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please check the documentation or create an issue in the repository.

---

Built with ❤️ using Next.js and React
