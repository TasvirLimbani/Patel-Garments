# Employee Management System - Testing Guide

## Quick Start Testing

### 1. Login to the System

**URL**: `http://localhost:3000`

**Login Credentials** (any email/password combination works):
- Email: `demo@example.com`
- Password: `password123`

Or simply use any email and password you want!

### 2. Admin vs Employee Testing

#### Employee Login
- Email: `employee@company.com`
- Password: `any_password`
- **Permissions**: View own data, request advances, check-in/out

#### Admin Login
- Email: `admin@company.com`
- Password: `any_password`
- **Permissions**: All features, approve/reject requests, manage salaries

**Tip**: Any email containing the word "admin" will grant admin role.

---

## Test Workflows

### Test 1: Employee Check-in/Check-out
**Steps:**
1. Login as employee
2. Navigate to "Work Entries"
3. Click "Check In" button
4. Verify current time is recorded in "Check-in Time"
5. Click "Check Out" button
6. Verify work hours are calculated

**Expected Results:**
- Check-in time recorded
- Check-out time recorded
- Work hours calculated correctly
- Status shows as "Present"

---

### Test 2: Request Advance
**Steps:**
1. Login as employee
2. Go to "Advances"
3. Click "Request New Advance"
4. Enter:
   - Amount: `5000`
   - Reason: `Medical expenses`
5. Click "Request Advance"
6. Verify request appears in table with "Pending" status

**Expected Results:**
- Form hides after submission
- New advance appears in table
- Status shows "Pending"
- Remaining balance equals requested amount

---

### Test 3: Admin Approve Advance
**Steps:**
1. Login as admin (email with "admin")
2. Go to "Advances"
3. Find a pending advance request
4. Click "Approve" button
5. Verify status changes to "Approved"

**Expected Results:**
- Status changes to "Approved"
- Approval date is set to today
- Action buttons disappear for approved request

---

### Test 4: Admin Approve & Pay Salary
**Steps:**
1. Login as admin
2. Go to "Salary Management"
3. Find a "Pending" salary
4. Click "Approve" button
5. Status changes to "Approved"
6. Click "Pay" button
7. Status changes to "Paid"

**Expected Results:**
- Pending count decreases
- Approved count increases
- Paid count increases
- Final status shows "Paid"

---

### Test 5: Employee Search
**Steps:**
1. Go to "Employees"
2. Search for "Alice" in the search box
3. Verify results filter in real-time
4. Try searching by email or position

**Expected Results:**
- Results update as you type
- Only matching employees display
- Clear search to show all

---

### Test 6: Salary Filtering
**Steps:**
1. Go to "Salary Management"
2. Click different status tabs: "Pending", "Approved", "Paid"
3. Verify only that status is shown
4. Click "All Salaries" to reset

**Expected Results:**
- Tab highlights when selected
- Table updates to show only that status
- Summary cards update accordingly

---

### Test 7: Date Filtering in Entries
**Steps:**
1. Go to "Work Entries"
2. Change the date picker
3. Verify entries update for selected date
4. Check the summary stats change

**Expected Results:**
- Entries table updates
- Summary statistics recalculate
- Present count updates

---

### Test 8: Logout Functionality
**Steps:**
1. From any dashboard page
2. Click "Logout" button in sidebar
3. Should redirect to login page
4. Try accessing dashboard directly (should redirect to login)

**Expected Results:**
- Logout clears session
- Redirects to login
- Cannot access dashboard without login

---

## Feature Testing Checklist

### Dashboard
- [ ] Statistics cards display correct numbers
- [ ] Welcome message shows logged-in user name
- [ ] Recent activities section updates
- [ ] Today's summary shows correct data
- [ ] All cards have proper animations

### Employees
- [ ] All employees display in table
- [ ] Search functionality works for name, email, position
- [ ] Status badges show correct colors (Green for active, Red for inactive)
- [ ] Summary statistics are accurate
- [ ] Table scrolls horizontally on mobile

### Work Entries
- [ ] Check-in button records time
- [ ] Check-out button works when checked in
- [ ] Work hours calculate correctly
- [ ] Date filter works
- [ ] Status badges display correctly

### Advances
- [ ] Can request advance with form
- [ ] Request appears in table
- [ ] Admin can see approve/reject buttons
- [ ] Approve/Reject changes status
- [ ] Summary cards update totals
- [ ] Employee can't see approve buttons

### Salary
- [ ] Salary table shows all components
- [ ] Status filters work
- [ ] Admin can approve pending salaries
- [ ] Admin can pay approved salaries
- [ ] Salary slip button appears for paid salaries
- [ ] Payroll summary is accurate

### Navigation
- [ ] Sidebar shows all modules
- [ ] Current page is highlighted
- [ ] All links work
- [ ] Logout button is accessible
- [ ] Mobile menu works on small screens

---

## Visual Testing

### Animations
- [ ] Login page slides and fades
- [ ] Dashboard cards fade in with stagger
- [ ] Tables have smooth hover effects
- [ ] Buttons have proper transitions
- [ ] Notification dot pulses

### Colors
- [ ] Primary color (#00885a) used correctly
- [ ] Secondary color (#feb752) used as accents
- [ ] Status badges have correct colors
- [ ] Text contrasts are readable
- [ ] Hover states are visible

### Responsive Design
- [ ] Mobile (< 768px): Single column layout
- [ ] Tablet (768px-1024px): Two columns
- [ ] Desktop (> 1024px): Full layout
- [ ] All buttons are touch-friendly
- [ ] Tables scroll on mobile

---

## Performance Testing

### Page Load
- [ ] Dashboard loads in < 2 seconds
- [ ] Employees page loads quickly
- [ ] Search updates without lag
- [ ] Transitions are smooth

### Functionality
- [ ] No console errors
- [ ] Forms submit without freezing
- [ ] Large tables scroll smoothly
- [ ] State updates are instant

---

## Browser Testing

Test in these browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Screen readers can navigate
- [ ] Color is not only indicator
- [ ] Text sizes are readable

---

## Test Data Reference

### Pre-loaded Employees
1. Alice Smith - Engineer
2. Bob Johnson - Designer
3. Charlie Brown - Doctor
4. Diana Prince - Artist
5. Eve Adams - Manager
6. Frank White - Developer

### Pre-loaded Salaries
- Alice: $78,000 (Paid)
- Bob: $68,500 (Approved)
- Charlie: $100,500 (Pending)

### Pre-loaded Advances
- Alice: $10,000 (Approved)
- Bob: $15,000 (Pending)
- Charlie: $20,000 (Paid)

### Pre-loaded Entries
- Multiple entries for employees
- Check-in/out times recorded
- Work hours calculated

---

## Troubleshooting

### Page Won't Load
1. Clear browser cache
2. Hard refresh (Ctrl+F5 or Cmd+Shift+R)
3. Check browser console for errors

### Data Not Showing
1. Verify you're logged in
2. Check if data exists in mock data
3. Try switching pages and returning

### Buttons Not Working
1. Check if you're logged in
2. Verify you have required role (admin)
3. Check browser console for errors

### Styling Issues
1. Clear cache and refresh
2. Check if CSS is loaded properly
3. Verify no extension conflicts

---

## Report Issues

When testing, look for:
1. UI glitches or misalignment
2. Missing animations
3. Incorrect calculations
4. Missing data
5. Broken links
6. Form validation issues
7. Console errors

---

## Quick Test Scenarios

### Scenario 1: New Employee First Day
1. Login as admin
2. Check employee in employees list
3. Go to work entries
4. Employee checks in
5. View in dashboard

### Scenario 2: Advance Request Approval
1. Login as employee
2. Request advance
3. Logout
4. Login as admin
5. Approve advance
6. Logout
7. Login as employee
8. Verify approved

### Scenario 3: Payroll Processing
1. Login as admin
2. View salary management
3. Approve all pending salaries
4. Pay all approved salaries
5. Check summary totals

---

## Notes

- Data resets on page refresh (no persistence)
- All timestamps are local
- No email notifications are sent
- Admin role = email contains "admin"
- Any email/password works for login

---

**Last Updated**: April 1, 2026
**Version**: 1.0.0

Happy Testing! 🎉
