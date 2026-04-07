'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Employee, Salary, Entry, Advance } from '@/lib/mockData';
import { employees as initialEmployees, salaries as initialSalaries, entries as initialEntries, advances as initialAdvances } from '@/lib/mockData';

interface AppContextType {
  employees: Employee[];
  salaries: Salary[];
  entries: Entry[];
  advances: Advance[];
  
  // Employee methods
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  // Entry methods
  checkIn: (employeeId: string) => void;
  checkOut: (employeeId: string) => void;
  getTodayEntry: (employeeId: string) => Entry | undefined;
  
  // Advance methods
  requestAdvance: (employeeId: string, amount: number, reason: string) => void;
  approveAdvance: (advanceId: string) => void;
  rejectAdvance: (advanceId: string) => void;
  
  // Salary methods
  updateSalary: (salaryId: string, salary: Partial<Salary>) => void;
  getEmployeeSalary: (employeeId: string) => Salary | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [employeesList, setEmployeesList] = useState<Employee[]>(initialEmployees);
  const [salariesList, setSalariesList] = useState<Salary[]>(initialSalaries);
  const [entriesList, setEntriesList] = useState<Entry[]>(initialEntries);
  const [advancesList, setAdvancesList] = useState<Advance[]>(initialAdvances);

  const addEmployee = (employee: Employee) => {
    setEmployeesList([...employeesList, employee]);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployeesList(employeesList.map(emp => emp.id === id ? { ...emp, ...updates } : emp));
  };

  const deleteEmployee = (id: string) => {
    setEmployeesList(employeesList.filter(emp => emp.id !== id));
  };

  const getTodayEntry = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return entriesList.find(entry => entry.employeeId === employeeId && entry.date === today);
  };

  const checkIn = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existingEntry = getTodayEntry(employeeId);

    if (!existingEntry) {
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      const newEntry: Entry = {
        id: Math.random().toString(36).substr(2, 9),
        employeeId,
        date: today,
        checkInTime: time,
        checkOutTime: null,
        workHours: 0,
        status: 'present',
      };
      setEntriesList([...entriesList, newEntry]);
    }
  };

  const checkOut = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const entry = entriesList.find(e => e.employeeId === employeeId && e.date === today);

    if (entry && !entry.checkOutTime) {
      const checkOutTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      const [checkInHours, checkInMins] = entry.checkInTime.split(':').map(Number);
      const [checkOutHours, checkOutMins] = checkOutTime.split(':').map(Number);
      const workHours = (checkOutHours - checkInHours) + (checkOutMins - checkInMins) / 60;

      setEntriesList(entriesList.map(e =>
        e.id === entry.id
          ? { ...e, checkOutTime, workHours: Math.max(0, workHours) }
          : e
      ));
    }
  };

  const requestAdvance = (employeeId: string, amount: number, reason: string) => {
    const newAdvance: Advance = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId,
      amount,
      requestDate: new Date().toISOString().split('T')[0],
      approvalDate: null,
      status: 'pending',
      reason,
      remainingBalance: amount,
    };
    setAdvancesList([...advancesList, newAdvance]);
  };

  const approveAdvance = (advanceId: string) => {
    setAdvancesList(advancesList.map(adv =>
      adv.id === advanceId
        ? { ...adv, status: 'approved', approvalDate: new Date().toISOString().split('T')[0] }
        : adv
    ));
  };

  const rejectAdvance = (advanceId: string) => {
    setAdvancesList(advancesList.map(adv =>
      adv.id === advanceId
        ? { ...adv, status: 'rejected', approvalDate: new Date().toISOString().split('T')[0] }
        : adv
    ));
  };

  const updateSalary = (salaryId: string, updates: Partial<Salary>) => {
    setSalariesList(salariesList.map(sal => sal.employee_id === salaryId ? { ...sal, ...updates } : sal));
  };

  const getEmployeeSalary = (employeeId: string) => {
    return salariesList.find(sal => sal.employee_id === employeeId);
  };

  return (
    <AppContext.Provider
      value={{
        employees: employeesList,
        salaries: salariesList,
        entries: entriesList,
        advances: advancesList,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        checkIn,
        checkOut,
        getTodayEntry,
        requestAdvance,
        approveAdvance,
        rejectAdvance,
        updateSalary,
        getEmployeeSalary,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
