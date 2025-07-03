

export type Project = {
  id: string;
  name: string;
  location: string;
  description: string;
  status: 'Active' | 'On Hold' | 'Completed';
  progress: number;
  endDate: string;
};

export type Task = {
  id: string;
  projectId: string;
  name: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED' | 'SCHEDULED';
  assignee: string;
  dueDate: string;
};

export type Invoice = {
  id: string;
  client: string;
  amount: number; // Represents subtotal
  tax?: number;
  discount?: number;
  lateFee?: number;
  paidAmount?: number;
  notes?: string;
  termsAndConditions?: string;
  signature?: string;
  status: 'Paid' | 'Pending' | 'Partial';
  date: string;
  projectId?: string;
  type: 'Standard' | 'Retainer' | 'Pro-forma';
};

export const paymentMethods = ['Cash', 'Bank Transfer', 'Credit Card', 'Other'] as const;
export type PaymentMethod = (typeof paymentMethods)[number];

export type Payment = {
  id: string;
  invoiceId: string;
  clientName: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  notes?: string;
};

export const employeeRoles = ['Manager', 'Warehouse Staff', 'Accountant', 'Driver', 'Contractor'] as const;
export type EmployeeRole = (typeof employeeRoles)[number];

export type Employee = {
  id: string;
  name: string;
  role: EmployeeRole;
  department: string;
  email: string;
  avatar: string;
  timesheetEnabled: boolean;
  payrollManaged: boolean;
};

export type JobPosting = {
  id: string;
  title: string;
  department: string;
  location: string;
  status: 'Open' | 'Closed' | 'Archived';
}

export type Expense = {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  clientId?: string;
  projectId?: string;
  isBillable?: boolean;
  receiptUrl?: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
};

export type Estimate = {
  id: string;
  client: string;
  estimateNumber: string;
  amount: number;
  tax?: number;
  discount?: number;
  shippingAddress?: string;
  notes?: string;
  termsAndConditions?: string;
  signature?: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
  date: string;
};

export type Document = {
  id: string;
  name: string;
  type: string; // e.g., 'PDF', 'Word', 'Image'
  size: string; // e.g., '2.5 MB'
  uploadDate: string;
  relatedTo: string; // e.g., 'INV-001', 'proj-1'
};

export const quantityTypes = ['kg', 'item', 'pallet', 'delivery', 'shipment'] as const;
export type QuantityType = (typeof quantityTypes)[number];

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantityType: QuantityType;
};

export type Supplier = {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
};

export type PurchaseOrder = {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string; 
  date: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Fulfilled' | 'Cancelled';
};

export type Asset = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  purchaseDate: string;
  value: number;
  receiptUrl?: string;
};

export type StockItem = {
  id: string;
  reference: string;
  senderName: string;
  receiverName: string;
  description: string;
  quantity: number;
  weight: number; // in kg
  value: number; // per item
  status: 'In Warehouse' | 'In Transit' | 'Delivered';
  entryDate: string;
  warehouseId?: string;
  warehouseName?: string;
  color?: string;
  documentUrl?: string;
};

export type Warehouse = {
  id: string;
  name: string;
  location: string;
};

export type StockTransferLog = {
  id: string;
  itemId: string;
  itemName: string;
  fromWarehouseName: string;
  toWarehouseName: string;
  quantity: number;
  date: string;
};

export type MoneyTransfer = {
  id: string;
  fromLocation: string;
  toLocation: string;
  senderName: string;
  receiverName: string;
  amountSent: number;
  exchangeRate: number;
  amountToCollect: number;
  referenceCode: string;
  status: 'Pending Collection' | 'Collected';
  date: string;
};

export const accountTypes = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'] as const;
export type AccountType = (typeof accountTypes)[number];

export type Account = {
  id: string;
  accountNumber: string;
  name: string;
  description: string;
  type: AccountType;
};

export type JournalEntryLine = {
    accountId: string;
    accountName: string;
    debit: number;
    credit: number;
}

export type JournalEntry = {
  id: string;
  date: string;
  description: string;
  lines: JournalEntryLine[];
};

export type Meeting = {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string 'YYYY-MM-DD'
};


export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'East Coast Distribution Center',
    location: 'Newark, NJ',
    description: 'Expansion of the main distribution hub to increase capacity by 30%.',
    status: 'Active',
    progress: 75,
    endDate: '2024-12-31',
  },
  {
    id: 'proj-2',
    name: 'Midwest Logistics Overhaul',
    location: 'Chicago, IL',
    description: 'Integrating new automated sorting systems to improve fulfillment speed.',
    status: 'Active',
    progress: 45,
    endDate: '2025-03-31',
  },
  {
    id: 'proj-3',
    name: 'West Coast Warehouse Setup',
    location: 'Los Angeles, CA',
    description: 'Establishing a new warehouse to serve the pacific region.',
    status: 'Active',
    progress: 90,
    endDate: '2024-11-30',
  },
    {
    id: 'proj-4',
    name: 'Southern Region Supply Chain',
    location: 'Atlanta, GA',
    description: 'Optimizing delivery routes for the entire southern region.',
    status: 'On Hold',
    progress: 20,
    endDate: '2025-06-30',
  },
  {
    id: 'proj-5',
    name: 'International Shipment Hub',
    location: 'Miami, FL',
    description: 'Phase 1 of the international hub for South American routes.',
    status: 'Completed',
    progress: 100,
    endDate: '2024-09-15',
  },
];

export const tasks: Task[] = [
  { id: 'task-1', projectId: 'proj-1', name: 'Install new shelving units', status: 'DONE', assignee: 'John Doe', dueDate: '2024-11-15' },
  { id: 'task-2', projectId: 'proj-1', name: 'Configure inventory management software', status: 'IN_PROGRESS', assignee: 'Jane Smith', dueDate: '2024-12-01' },
  { id: 'task-3', projectId: 'proj-1', name: 'Hire additional warehouse staff', status: 'PENDING', assignee: 'Emily White', dueDate: '2024-12-10' },
  { id: 'task-4', projectId: 'proj-1', name: 'Finalize safety protocols', status: 'BLOCKED', assignee: 'Mike Brown', dueDate: '2024-11-25' },
  { id: 'task-5', projectId: 'proj-2', name: 'Procure automated sorters', status: 'DONE', assignee: 'Chris Green', dueDate: '2024-10-30' },
  { id: 'task-6', projectId: 'proj-2', name: 'Integrate sorters with WMS', status: 'IN_PROGRESS', assignee: 'Sarah Black', dueDate: '2024-12-15' },
  { id: 'task-7', projectId: 'proj-2', name: 'Train staff on new systems', status: 'PENDING', assignee: 'David King', dueDate: '2025-01-15' },
  { id: 'task-8', projectId: 'proj-3', name: 'Lease warehouse space', status: 'DONE', assignee: 'Olivia Blue', dueDate: '2024-09-10' },
  { id: 'task-9', projectId: 'proj-3', name: 'Set up initial inventory', status: 'DONE', assignee: 'Peter Pan', dueDate: '2024-10-01' },
  { id: 'task-10', projectId: 'proj-3', name: 'Go-live operations', status: 'IN_PROGRESS', assignee: 'Wendy Darling', dueDate: '2024-11-20' },
  { id: 'task-11', projectId: 'proj-3', name: 'Schedule first shipment reception', status: 'SCHEDULED', assignee: 'Captain Hook', dueDate: '2024-11-28' },
];

export const invoices: Invoice[] = [
  { id: 'INV-001', client: 'Nexus Corp', amount: 2500.00, status: 'Paid', date: '2024-10-15', projectId: 'proj-1', type: 'Standard', tax: 200, discount: 50, paidAmount: 2650.00 },
  { id: 'INV-002', client: 'Quantum Solutions', amount: 1200.50, status: 'Pending', date: '2024-12-22', type: 'Standard', paidAmount: 0 },
  { id: 'INV-003', client: 'Stellar Goods', amount: 850.00, status: 'Paid', date: '2024-09-30', type: 'Standard', paidAmount: 850.00 },
  { id: 'INV-004', client: 'Apex Logistics', amount: 3400.00, status: 'Partial', date: '2024-11-01', projectId: 'proj-2', lateFee: 50.00, type: 'Standard', discount: 100, paidAmount: 2000.00 },
];

export const payments: Payment[] = [
    { id: 'pay-1', invoiceId: 'INV-001', clientName: 'Nexus Corp', amount: 2650.00, date: '2024-10-20', method: 'Bank Transfer' },
    { id: 'pay-2', invoiceId: 'INV-003', clientName: 'Stellar Goods', amount: 850.00, date: '2024-10-05', method: 'Credit Card' },
    { id: 'pay-3', invoiceId: 'INV-004', clientName: 'Apex Logistics', amount: 2000.00, date: '2024-11-10', method: 'Bank Transfer' },
];

export const employees: Employee[] = [
  { id: 'emp-1', name: 'Alice Johnson', role: 'Manager', department: 'Operations', email: 'alice.j@wareflow.com', avatar: 'https://placehold.co/100x100.png', timesheetEnabled: true, payrollManaged: true },
  { id: 'emp-2', name: 'Bob Williams', role: 'Warehouse Staff', department: 'Operations', email: 'bob.w@wareflow.com', avatar: 'https://placehold.co/100x100.png', timesheetEnabled: true, payrollManaged: false },
  { id: 'emp-3', name: 'Charlie Brown', role: 'Accountant', department: 'Finance', email: 'charlie.b@wareflow.com', avatar: 'https://placehold.co/100x100.png', timesheetEnabled: false, payrollManaged: true },
  { id: 'emp-4', name: 'Diana Prince', role: 'Manager', department: 'Human Resources', email: 'diana.p@wareflow.com', avatar: 'https://placehold.co/100x100.png', timesheetEnabled: true, payrollManaged: true },
];

export const jobPostings: JobPosting[] = [
    { id: 'job-1', title: 'Senior Warehouse Associate', department: 'Operations', location: 'Newark, NJ', status: 'Open' },
    { id: 'job-2', title: 'Forklift Operator', department: 'Operations', location: 'Chicago, IL', status: 'Open' },
    { id: 'job-3', title: 'Financial Analyst', department: 'Finance', location: 'Remote', status: 'Closed' },
    { id: 'job-4', title: 'Recruiting Coordinator', department: 'Human Resources', location: 'Miami, FL', status: 'Open' },
];

export const expenses: Expense[] = [
  { id: 'exp-1', category: 'Office Supplies', description: 'Printer paper and ink', amount: 75.50, date: '2024-10-20', isBillable: false },
  { id: 'exp-2', category: 'Software', description: 'Subscription for project management tool', amount: 200.00, date: '2024-10-01', projectId: 'proj-2', isBillable: true },
  { id: 'exp-3', category: 'Travel', description: 'Client meeting in Chicago', amount: 450.00, date: '2024-09-15', clientId: 'client-2', isBillable: true },
];

export const clients: Client[] = [
  { id: 'client-1', name: 'Nexus Corp', email: 'contact@nexuscorp.com', phone: '555-0101', address: '123 Nexus Way, Silicon Valley, CA', avatar: 'https://placehold.co/100x100/A6B1E1/FFFFFF.png' },
  { id: 'client-2', name: 'Quantum Solutions', email: 'info@quantum.com', phone: '555-0102', address: '456 Quantum Blvd, Boston, MA', avatar: 'https://placehold.co/100x100/FFD6A5/FFFFFF.png' },
  { id: 'client-3', name: 'Stellar Goods', email: 'support@stellargoods.co', phone: '555-0103', address: '789 Stellar Ave, Seattle, WA', avatar: 'https://placehold.co/100x100/A8D8B9/FFFFFF.png' },
  { id: 'client-4', name: 'Apex Logistics', email: 'service@apexlogistics.net', phone: '555-0104', address: '101 Apex Circle, Newark, NJ', avatar: 'https://placehold.co/100x100/F0B8B8/FFFFFF.png' },
];

export const estimates: Estimate[] = [
  { id: 'est-1', client: 'Nexus Corp', estimateNumber: 'EST-001', amount: 5000.00, status: 'Sent', date: '2024-10-18', tax: 400, discount: 100, notes: 'Standard 2-week delivery.', termsAndConditions: 'Payment due upon receipt.' },
  { id: 'est-2', client: 'Quantum Solutions', estimateNumber: 'EST-002', amount: 7500.00, status: 'Accepted', date: '2024-10-12', tax: 600, signature: "Bob Belcher" },
  { id: 'est-3', client: 'Stellar Goods', estimateNumber: 'EST-003', amount: 1200, status: 'Draft', date: '2024-10-25' },
];

export const documents: Document[] = [
  { id: 'doc-1', name: 'Contract_NexusCorp.pdf', type: 'PDF', size: '1.2 MB', uploadDate: '2024-10-15', relatedTo: 'client-1' },
  { id: 'doc-2', name: 'Shipping_Manifest_INV-003.docx', type: 'Word', size: '800 KB', uploadDate: '2024-09-30', relatedTo: 'INV-003' },
  { id: 'doc-3', name: 'Warehouse_Photos.zip', type: 'Image', size: '15.4 MB', uploadDate: '2024-08-20', relatedTo: 'proj-1' },
];

export const services: Service[] = [
    { id: 'serv-1', name: 'Standard Freight', description: 'Standard ground transportation.', price: 500, quantityType: 'delivery' },
    { id: 'serv-2', name: 'Warehousing Fee', description: 'Per-pallet weekly storage.', price: 25, quantityType: 'pallet' },
    { id: 'serv-3', name: 'Customs Clearance', description: 'Handling of import/export documentation.', price: 350, quantityType: 'shipment' },
];

export const suppliers: Supplier[] = [
    { id: 'sup-1', name: 'Global Shipping Co.', contactPerson: 'John Smith', email: 'john@gsc.com', phone: '555-0201' },
    { id: 'sup-2', name: 'Packaging Pros', contactPerson: 'Mary Allen', email: 'mary@packpros.com', phone: '555-0202' },
];

export const purchaseOrders: PurchaseOrder[] = [
    { id: 'po-1', poNumber: 'PO-1001', supplierId: 'sup-1', supplierName: 'Global Shipping Co.', date: '2024-10-20', amount: 3500, status: 'Sent' },
    { id: 'po-2', poNumber: 'PO-1002', supplierId: 'sup-2', supplierName: 'Packaging Pros', date: '2024-10-22', amount: 800, status: 'Fulfilled' },
];

export const assets: Asset[] = [
    { id: 'asset-1', name: 'Forklift A', description: 'Electric forklift, 5000lb capacity', quantity: 1, purchaseDate: '2023-05-15', value: 25000 },
    { id: 'asset-2', name: 'Pallet Jack', description: 'Manual pallet jack, 2500lb capacity', quantity: 5, purchaseDate: '2023-01-20', value: 400 },
];

export const warehouses: Warehouse[] = [
    { id: 'wh-1', name: 'Main Warehouse', location: 'Newark, NJ' },
    { id: 'wh-2', name: 'Staging Area A', location: 'Chicago, IL' },
    { id: 'wh-3', name: 'Virtual-Returns', location: 'Online' },
];

export const stockItems: StockItem[] = [
    { id: 'item-1', reference: 'SHP-123', senderName: 'Sender A', receiverName: 'Receiver X', description: 'Electronics Components', quantity: 50, weight: 2.5, value: 150, status: 'In Warehouse', entryDate: '2024-11-01', warehouseId: 'wh-1', warehouseName: 'Main Warehouse', color: 'Blue' },
    { id: 'item-2', reference: 'SHP-124', senderName: 'Sender B', receiverName: 'Receiver Y', description: 'Textiles', quantity: 200, weight: 1.0, value: 25, status: 'In Transit', entryDate: '2024-11-03', warehouseId: 'wh-1', warehouseName: 'Main Warehouse', color: 'Red' },
    { id: 'item-3', reference: 'SHP-125', senderName: 'Sender C', receiverName: 'Receiver Z', description: 'Auto Parts', quantity: 10, weight: 15.0, value: 400, status: 'Delivered', entryDate: '2024-10-28', warehouseId: 'wh-2', warehouseName: 'Staging Area A', color: 'Black' },
];

export const stockTransferLogs: StockTransferLog[] = [
    { id: 'log-1', itemId: 'item-3', itemName: 'Auto Parts', fromWarehouseName: 'Main Warehouse', toWarehouseName: 'Staging Area A', quantity: 10, date: '2024-10-25' },
];

export const moneyTransfers: MoneyTransfer[] = [
    { id: 'mt-1', fromLocation: 'USA', toLocation: 'Mexico', senderName: 'John Doe', receiverName: 'Maria Garcia', amountSent: 500, exchangeRate: 17.5, amountToCollect: 8750, status: 'Collected', date: '2024-10-28', referenceCode: 'MT12345' },
    { id: 'mt-2', fromLocation: 'Canada', toLocation: 'USA', senderName: 'Pierre Dubois', receiverName: 'Jane Smith', amountSent: 1000, exchangeRate: 0.75, amountToCollect: 750, referenceCode: 'MT67890', status: 'Pending Collection', date: '2024-11-01' },
];

export const chartOfAccounts: Account[] = [
    // Assets
    { id: 'acc-1', accountNumber: '1010', name: 'Cash', description: 'Cash in hand and in bank accounts.', type: 'Asset' },
    { id: 'acc-2', accountNumber: '1200', name: 'Accounts Receivable', description: 'Amounts owed by customers.', type: 'Asset' },
    { id: 'acc-3', accountNumber: '1500', name: 'Inventory', description: 'Goods available for sale.', type: 'Asset' },
    { id: 'acc-4', accountNumber: '1700', name: 'Fixed Assets', description: 'Long-term assets like equipment.', type: 'Asset' },
    // Liabilities
    { id: 'acc-5', accountNumber: '2010', name: 'Accounts Payable', description: 'Amounts owed to suppliers.', type: 'Liability' },
    { id: 'acc-6', accountNumber: '2200', name: 'Sales Tax Payable', description: 'Sales tax collected but not yet remitted.', type: 'Liability' },
    // Equity
    { id: 'acc-7', accountNumber: '3010', name: "Owner's Equity", description: "Owner's stake in the company.", type: 'Equity' },
    { id: 'acc-8', accountNumber: '3200', name: 'Retained Earnings', description: 'Net income retained in the business.', type: 'Equity' },
    // Revenue
    { id: 'acc-9', accountNumber: '4010', name: 'Sales Revenue', description: 'Revenue from sales of goods/services.', type: 'Revenue' },
    { id: 'acc-10', accountNumber: '4020', name: 'Shipping & Delivery Income', description: 'Revenue from shipping charges.', type: 'Revenue' },
    // Expenses
    { id: 'acc-11', accountNumber: '5010', name: 'Cost of Goods Sold', description: 'Direct costs of goods sold.', type: 'Expense' },
    { id: 'acc-12', accountNumber: '5200', name: 'Salaries and Wages', description: 'Employee salaries.', type: 'Expense' },
    { id: 'acc-13', accountNumber: '5300', name: 'Rent Expense', description: 'Rent for facilities.', type: 'Expense' },
    { id: 'acc-14', accountNumber: '5400', name: 'Utilities', description: 'Electricity, water, etc.', type: 'Expense' },
];

export const journalEntries: JournalEntry[] = [
    {
        id: 'je-1',
        date: '2024-10-31',
        description: 'To record October salaries.',
        lines: [
            { accountId: 'acc-12', accountName: 'Salaries and Wages', debit: 5000.00, credit: 0 },
            { accountId: 'acc-1', accountName: 'Cash', debit: 0, credit: 5000.00 },
        ]
    }
];

export const meetings: Meeting[] = [
  {
    id: 'meet-1',
    title: 'Weekly Sync',
    description: 'Discuss project progress and blockers.',
    date: '2024-11-25',
  },
  {
    id: 'meet-2',
    title: 'Client Call - Nexus Corp',
    description: 'Follow-up on the latest invoice and upcoming work.',
    date: '2024-12-02',
  }
];
