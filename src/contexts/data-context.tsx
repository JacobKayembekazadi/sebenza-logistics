

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
  suppliers as initialSuppliers,
  purchaseOrders as initialPurchaseOrders,
  assets as initialAssets,
  stockItems as initialStockItems,
  warehouses as initialWarehouses,
  stockTransferLogs as initialStockTransferLogs,
  moneyTransfers as initialMoneyTransfers,
  payments as initialPayments,
  chartOfAccounts as initialChartOfAccounts,
  journalEntries as initialJournalEntries,
  meetings as initialMeetings,
  Project, Task, Invoice, Employee, JobPosting, Expense, Client, Estimate, Document, Service, Supplier, PurchaseOrder, Asset, StockItem, Warehouse, StockTransferLog, MoneyTransfer,
  Payment, Account, JournalEntry, Meeting
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
  addInvoice: (invoice: Omit<Invoice, 'id'>, document?: { name: string; type: string; size: string }) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (invoiceId: string) => void;

  payments: Payment[];
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (payment: Payment) => void;
  deletePayment: (paymentId: string) => void;

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

  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (supplierId: string) => void;

  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber'>) => void;
  updatePurchaseOrder: (po: PurchaseOrder) => void;
  deletePurchaseOrder: (poId: string) => void;

  assets: Asset[];
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  updateAsset: (asset: Asset) => void;
  deleteAsset: (assetId: string) => void;

  stockItems: StockItem[];
  addStockItem: (item: Omit<StockItem, 'id'>) => void;
  updateStockItem: (item: StockItem) => void;
  deleteStockItem: (itemId: string) => void;

  warehouses: Warehouse[];
  addWarehouse: (warehouse: Omit<Warehouse, 'id'>) => void;
  updateWarehouse: (warehouse: Warehouse) => void;
  deleteWarehouse: (warehouseId: string) => void;

  stockTransferLogs: StockTransferLog[];
  transferStockItem: (itemId: string, toWarehouseId: string) => void;

  moneyTransfers: MoneyTransfer[];
  addMoneyTransfer: (transfer: Omit<MoneyTransfer, 'id' | 'amountToCollect'>) => void;
  updateMoneyTransfer: (transfer: MoneyTransfer) => void;
  deleteMoneyTransfer: (transferId: string) => void;

  chartOfAccounts: Account[];
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (accountId: string) => void;

  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  updateJournalEntry: (entry: JournalEntry) => void;
  deleteJournalEntry: (entryId: string) => void;

  meetings: Meeting[];
  addMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  updateMeeting: (meeting: Meeting) => void;
  deleteMeeting: (meetingId: string) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>(initialJobPostings);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [estimates, setEstimates] = useState<Estimate[]>(initialEstimates);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStockItems);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses);
  const [stockTransferLogs, setStockTransferLogs] = useState<StockTransferLog[]>(initialStockTransferLogs);
  const [moneyTransfers, setMoneyTransfers] = useState<MoneyTransfer[]>(initialMoneyTransfers);
  const [chartOfAccounts, setChartOfAccounts] = useState<Account[]>(initialChartOfAccounts);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(initialJournalEntries);
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);


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
  const addInvoice = (invoice: Omit<Invoice, 'id'>, document?: { name: string; type: string; size: string }) => {
    const newInvoiceId = `INV-${(invoices.length + 1).toString().padStart(3, '0')}`;
    const newInvoice: Invoice = { ...invoice, id: newInvoiceId, paidAmount: 0 };
    setInvoices(prev => [newInvoice, ...prev]);

    if (document) {
      const newDocument: Document = {
        id: uuidv4(),
        name: document.name,
        type: document.type,
        size: document.size,
        uploadDate: new Date().toISOString().split('T')[0],
        relatedTo: newInvoiceId,
      };
      setDocuments(prev => [newDocument, ...prev]);
    }
  };
  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(prev => prev.map(i => i.id === updatedInvoice.id ? updatedInvoice : i));
  };
  const deleteInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.filter(i => i.id !== invoiceId));
  };
  
  // Payments
  const addPayment = (payment: Omit<Payment, 'id'>) => {
    const newPayment: Payment = { ...payment, id: uuidv4() };
    setPayments(prev => [newPayment, ...prev]);

    const invoiceToUpdate = invoices.find(inv => inv.id === payment.invoiceId);
    if (invoiceToUpdate) {
      const totalAmount = invoiceToUpdate.amount + (invoiceToUpdate.tax || 0) - (invoiceToUpdate.discount || 0) + (invoiceToUpdate.lateFee || 0);
      const newPaidAmount = (invoiceToUpdate.paidAmount || 0) + payment.amount;
      
      let newStatus: Invoice['status'] = 'Partial';
      if (newPaidAmount >= totalAmount) {
        newStatus = 'Paid';
      } else if (newPaidAmount <= 0) {
        newStatus = 'Pending';
      }

      updateInvoice({
        ...invoiceToUpdate,
        paidAmount: newPaidAmount,
        status: newStatus
      });
    }
  };

  const updatePayment = (updatedPayment: Payment) => {
    const oldPayment = payments.find(p => p.id === updatedPayment.id);
    if (!oldPayment) return;

    setPayments(prev => prev.map(p => (p.id === updatedPayment.id ? updatedPayment : p)));
    
    const invoiceToUpdate = invoices.find(inv => inv.id === updatedPayment.invoiceId);
    if (invoiceToUpdate) {
      const amountDifference = updatedPayment.amount - oldPayment.amount;
      const newPaidAmount = (invoiceToUpdate.paidAmount || 0) + amountDifference;
      
      const totalAmount = invoiceToUpdate.amount + (invoiceToUpdate.tax || 0) - (invoiceToUpdate.discount || 0) + (invoiceToUpdate.lateFee || 0);
      let newStatus: Invoice['status'] = 'Partial';
      if (newPaidAmount >= totalAmount) {
        newStatus = 'Paid';
      } else if (newPaidAmount <= 0) {
        newStatus = 'Pending';
      }

      updateInvoice({
        ...invoiceToUpdate,
        paidAmount: newPaidAmount,
        status: newStatus
      });
    }
  };

  const deletePayment = (paymentId: string) => {
    const paymentToDelete = payments.find(p => p.id === paymentId);
    if (!paymentToDelete) return;

    setPayments(prev => prev.filter(p => p.id !== paymentId));

    const invoiceToUpdate = invoices.find(inv => inv.id === paymentToDelete.invoiceId);
    if (invoiceToUpdate) {
      const newPaidAmount = (invoiceToUpdate.paidAmount || 0) - paymentToDelete.amount;
      
      const totalAmount = invoiceToUpdate.amount + (invoiceToUpdate.tax || 0) - (invoiceToUpdate.discount || 0) + (invoiceToUpdate.lateFee || 0);
      let newStatus: Invoice['status'] = 'Partial';
      if (newPaidAmount >= totalAmount) {
        newStatus = 'Paid';
      } else if (newPaidAmount <= 0) {
        newStatus = 'Pending';
      }

      updateInvoice({
        ...invoiceToUpdate,
        paidAmount: newPaidAmount,
        status: newStatus
      });
    }
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

  // Suppliers
  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = { ...supplier, id: uuidv4() };
    setSuppliers(prev => [newSupplier, ...prev]);
  };
  const updateSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
  };
  const deleteSupplier = (supplierId: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplierId));
  };

  // Purchase Orders
  const addPurchaseOrder = (po: Omit<PurchaseOrder, 'id' | 'poNumber'>) => {
    const newPO: PurchaseOrder = { ...po, id: uuidv4(), poNumber: `PO-${(purchaseOrders.length + 1001)}` };
    setPurchaseOrders(prev => [newPO, ...prev]);
  };
  const updatePurchaseOrder = (updatedPO: PurchaseOrder) => {
    setPurchaseOrders(prev => prev.map(po => po.id === updatedPO.id ? updatedPO : po));
  };
  const deletePurchaseOrder = (poId: string) => {
    setPurchaseOrders(prev => prev.filter(po => po.id !== poId));
  };

  // Assets
  const addAsset = (asset: Omit<Asset, 'id'>) => {
    const newAsset: Asset = { ...asset, id: uuidv4() };
    setAssets(prev => [newAsset, ...prev]);
  };
  const updateAsset = (updatedAsset: Asset) => {
    setAssets(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
  };
  const deleteAsset = (assetId: string) => {
    setAssets(prev => prev.filter(a => a.id !== assetId));
  };

  // Stock Items
  const addStockItem = (item: Omit<StockItem, 'id'>) => {
    const newItem: StockItem = { ...item, id: uuidv4() };
    setStockItems(prev => [newItem, ...prev]);
  };
  const updateStockItem = (updatedItem: StockItem) => {
    setStockItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
  };
  const deleteStockItem = (itemId: string) => {
    setStockItems(prev => prev.filter(i => i.id !== itemId));
  };

  // Warehouses
  const addWarehouse = (warehouse: Omit<Warehouse, 'id'>) => {
    const newWarehouse: Warehouse = { ...warehouse, id: uuidv4() };
    setWarehouses(prev => [newWarehouse, ...prev]);
  };
  const updateWarehouse = (updatedWarehouse: Warehouse) => {
    setWarehouses(prev => prev.map(w => w.id === updatedWarehouse.id ? updatedWarehouse : w));
  };
  const deleteWarehouse = (warehouseId: string) => {
    setWarehouses(prev => prev.filter(w => w.id !== warehouseId));
  };

  // Stock Transfers
  const transferStockItem = (itemId: string, toWarehouseId: string) => {
    const itemToTransfer = stockItems.find(i => i.id === itemId);
    const fromWarehouse = warehouses.find(w => w.id === itemToTransfer?.warehouseId);
    const toWarehouse = warehouses.find(w => w.id === toWarehouseId);

    if (itemToTransfer && toWarehouse) {
      // Update the item
      const updatedItem = {
        ...itemToTransfer,
        warehouseId: toWarehouse.id,
        warehouseName: toWarehouse.name,
      };
      updateStockItem(updatedItem);

      // Create audit log
      const newLog: StockTransferLog = {
        id: uuidv4(),
        itemId: itemToTransfer.id,
        itemName: itemToTransfer.description,
        fromWarehouseName: fromWarehouse?.name || 'No Warehouse',
        toWarehouseName: toWarehouse.name,
        quantity: itemToTransfer.quantity,
        date: new Date().toISOString().split('T')[0],
      };
      setStockTransferLogs(prev => [newLog, ...prev]);
    }
  };

  // Money Transfers
  const addMoneyTransfer = (transfer: Omit<MoneyTransfer, 'id' | 'amountToCollect'>) => {
    const newTransfer: MoneyTransfer = {
      ...transfer,
      id: `mt-${uuidv4()}`,
      amountToCollect: transfer.amountSent * transfer.exchangeRate,
    };
    setMoneyTransfers(prev => [newTransfer, ...prev]);
  };
  const updateMoneyTransfer = (updatedTransfer: MoneyTransfer) => {
    const transferWithRecalculation = {
        ...updatedTransfer,
        amountToCollect: updatedTransfer.amountSent * updatedTransfer.exchangeRate
    }
    setMoneyTransfers(prev => prev.map(t => t.id === updatedTransfer.id ? transferWithRecalculation : t));
  };
  const deleteMoneyTransfer = (transferId: string) => {
    setMoneyTransfers(prev => prev.filter(t => t.id !== transferId));
  };

  // Chart of Accounts
  const addAccount = (account: Omit<Account, 'id'>) => {
    const newAccount: Account = { ...account, id: uuidv4() };
    setChartOfAccounts(prev => [...prev, newAccount].sort((a,b) => a.accountNumber.localeCompare(b.accountNumber)));
  };
  const updateAccount = (updatedAccount: Account) => {
    setChartOfAccounts(prev => prev.map(a => a.id === updatedAccount.id ? updatedAccount : a));
  };
  const deleteAccount = (accountId: string) => {
    setChartOfAccounts(prev => prev.filter(a => a.id !== accountId));
  };

  // Journal Entries
  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = { ...entry, id: uuidv4() };
    setJournalEntries(prev => [newEntry, ...prev]);
  };
  const updateJournalEntry = (updatedEntry: JournalEntry) => {
    setJournalEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
  };
  const deleteJournalEntry = (entryId: string) => {
    setJournalEntries(prev => prev.filter(e => e.id !== entryId));
  };

  // Meetings
  const addMeeting = (meeting: Omit<Meeting, 'id'>) => {
    const newMeeting: Meeting = { ...meeting, id: uuidv4() };
    setMeetings(prev => [newMeeting, ...prev]);
  };
  const updateMeeting = (updatedMeeting: Meeting) => {
    setMeetings(prev => prev.map(m => m.id === updatedMeeting.id ? updatedMeeting : m));
  };
  const deleteMeeting = (meetingId: string) => {
    setMeetings(prev => prev.filter(m => m.id !== meetingId));
  };

  return (
    <DataContext.Provider value={{
      projects, addProject, updateProject, deleteProject,
      tasks, getTasksByProjectId, addTask, updateTask, deleteTask,
      invoices, addInvoice, updateInvoice, deleteInvoice,
      payments, addPayment, updatePayment, deletePayment,
      employees, addEmployee, updateEmployee, deleteEmployee,
      jobPostings, addJobPosting, updateJobPosting, deleteJobPosting,
      expenses, addExpense, updateExpense, deleteExpense,
      clients, addClient, updateClient, deleteClient,
      estimates, addEstimate, updateEstimate, deleteEstimate,
      documents, addDocument, updateDocument, deleteDocument,
      services, addService, updateService, deleteService,
      suppliers, addSupplier, updateSupplier, deleteSupplier,
      purchaseOrders, addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder,
      assets, addAsset, updateAsset, deleteAsset,
      stockItems, addStockItem, updateStockItem, deleteStockItem,
      warehouses, addWarehouse, updateWarehouse, deleteWarehouse,
      stockTransferLogs, transferStockItem,
      moneyTransfers, addMoneyTransfer, updateMoneyTransfer, deleteMoneyTransfer,
      chartOfAccounts, addAccount, updateAccount, deleteAccount,
      journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry,
      meetings, addMeeting, updateMeeting, deleteMeeting,
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
