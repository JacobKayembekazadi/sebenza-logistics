
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  projects as initialProjects,
  tasks as initialTasks,
  invoices as initialInvoices,
  employees as initialEmployees,
  jobPostings as initialJobPostings,
  Project, Task, Invoice, Employee, JobPosting
} from '@/lib/data';

type DataContextType = {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'status' | 'progress'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;

  tasks: Task[];
  getTasksByProjectId: (projectId: string) => Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;

  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (invoiceId: string) => void;

  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (employeeId: string) => void;

  jobPostings: JobPosting[];
  addJobPosting: (jobPosting: Omit<JobPosting, 'id'>) => void;
  updateJobPosting: (jobPosting: JobPosting) => void;
  deleteJobPosting: (jobPostingId: string) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>(initialJobPostings);

  // Projects
  const addProject = (project: Omit<Project, 'id' | 'status' | 'progress'>) => {
    const newProject: Project = { ...project, id: uuidv4(), status: 'Active', progress: 0 };
    setProjects(prev => [newProject, ...prev]);
  };
  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };
  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setTasks(prev => prev.filter(t => t.projectId !== projectId));
  };

  // Tasks
  const getTasksByProjectId = (projectId: string) => tasks.filter(t => t.projectId === projectId);
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: uuidv4() };
    setTasks(prev => [newTask, ...prev]);
  };
  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };
  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Invoices
  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = { ...invoice, id: uuidv4() };
    setInvoices(prev => [newInvoice, ...prev]);
  };
  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(prev => prev.map(i => i.id === updatedInvoice.id ? updatedInvoice : i));
  };
  const deleteInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.filter(i => i.id !== invoiceId));
  };

  // Employees
  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = { ...employee, id: uuidv4() };
    setEmployees(prev => [newEmployee, ...prev]);
  };
  const updateEmployee = (updatedEmployee: Employee) => {
    setEmployees(prev => prev.map(e => e.id === updatedEmployee.id ? updatedEmployee : e));
  };
  const deleteEmployee = (employeeId: string) => {
    setEmployees(prev => prev.filter(e => e.id !== employeeId));
  };
  
  // Job Postings
  const addJobPosting = (job: Omit<JobPosting, 'id'>) => {
    const newJob: JobPosting = { ...job, id: uuidv4() };
    setJobPostings(prev => [newJob, ...prev]);
  };
  const updateJobPosting = (updatedJob: JobPosting) => {
    setJobPostings(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
  };
  const deleteJobPosting = (jobId: string) => {
    setJobPostings(prev => prev.filter(j => j.id !== jobId));
  };

  return (
    <DataContext.Provider value={{
      projects, addProject, updateProject, deleteProject,
      tasks, getTasksByProjectId, addTask, updateTask, deleteTask,
      invoices, addInvoice, updateInvoice, deleteInvoice,
      employees, addEmployee, updateEmployee, deleteEmployee,
      jobPostings, addJobPosting, updateJobPosting, deleteJobPosting
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
