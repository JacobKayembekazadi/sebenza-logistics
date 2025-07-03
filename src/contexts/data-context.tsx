
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  projects as initialProjects,
  tasks as initialTasks,
  invoices as initialInvoices,
  employees as initialEmployees,
  jobPostings as initialJobPostings,
  expenses as initialExpenses,
  clients as initialClients,
  estimates as initialEstimates,
  documents as initialDocuments,
  services as initialServices,
  Project, Task, Invoice, Employee, JobPosting, Expense, Client, Estimate, Document, Service
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

  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (expenseId: string) => void;

  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'avatar'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (clientId: string) => void;

  estimates: Estimate[];
  addEstimate: (estimate: Omit<Estimate, 'id' | 'estimateNumber'>) => void;
  updateEstimate: (estimate: Estimate) => void;
  deleteEstimate: (estimateId: string) => void;

  documents: Document[];
  addDocument: (document: Omit<Document, 'id'>) => void;
  updateDocument: (document: Document) => void;
  deleteDocument: (documentId: string) => void;

  services: Service[];
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (service: Service) => void;
  deleteService: (serviceId: string) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>(initialJobPostings);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [estimates, setEstimates] = useState<Estimate[]>(initialEstimates);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [services, setServices] = useState<Service[]>(initialServices);

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
    const newInvoice: Invoice = { ...invoice, id: `INV-${(invoices.length + 1).toString().padStart(3, '0')}` };
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

  // Expenses
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { ...expense, id: uuidv4() };
    setExpenses(prev => [newExpense, ...prev]);
  };
  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e));
  };
  const deleteExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
  };

  // Clients
  const addClient = (client: Omit<Client, 'id' | 'avatar'>) => {
    const newClient: Client = { ...client, id: uuidv4(), avatar: 'https://placehold.co/100x100.png' };
    setClients(prev => [newClient, ...prev]);
  };
  const updateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };
  const deleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  // Estimates
  const addEstimate = (estimate: Omit<Estimate, 'id' | 'estimateNumber'>) => {
    const newEstimate: Estimate = { ...estimate, id: uuidv4(), estimateNumber: `EST-${(estimates.length + 1).toString().padStart(3, '0')}` };
    setEstimates(prev => [newEstimate, ...prev]);
  };
  const updateEstimate = (updatedEstimate: Estimate) => {
    setEstimates(prev => prev.map(e => e.id === updatedEstimate.id ? updatedEstimate : e));
  };
  const deleteEstimate = (estimateId: string) => {
    setEstimates(prev => prev.filter(e => e.id !== estimateId));
  };

  // Documents
  const addDocument = (document: Omit<Document, 'id'>) => {
    const newDocument: Document = { ...document, id: uuidv4() };
    setDocuments(prev => [newDocument, ...prev]);
  };
  const updateDocument = (updatedDocument: Document) => {
    setDocuments(prev => prev.map(d => d.id === updatedDocument.id ? updatedDocument : d));
  };
  const deleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== documentId));
  };

  // Services
  const addService = (service: Omit<Service, 'id'>) => {
    const newService: Service = { ...service, id: uuidv4() };
    setServices(prev => [newService, ...prev]);
  };
  const updateService = (updatedService: Service) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
  };
  const deleteService = (serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
  };

  return (
    <DataContext.Provider value={{
      projects, addProject, updateProject, deleteProject,
      tasks, getTasksByProjectId, addTask, updateTask, deleteTask,
      invoices, addInvoice, updateInvoice, deleteInvoice,
      employees, addEmployee, updateEmployee, deleteEmployee,
      jobPostings, addJobPosting, updateJobPosting, deleteJobPosting,
      expenses, addExpense, updateExpense, deleteExpense,
      clients, addClient, updateClient, deleteClient,
      estimates, addEstimate, updateEstimate, deleteEstimate,
      documents, addDocument, updateDocument, deleteDocument,
      services, addService, updateService, deleteService
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
