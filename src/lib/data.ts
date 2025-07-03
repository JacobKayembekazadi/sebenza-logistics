export type Project = {
  id: string;
  name: string;
  location: string;
  description: string;
  status: 'Active' | 'On Hold' | 'Completed';
  progress: number;
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
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
};

export type Employee = {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  avatar: string;
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

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'East Coast Distribution Center',
    location: 'Newark, NJ',
    description: 'Expansion of the main distribution hub to increase capacity by 30%.',
    status: 'Active',
    progress: 75,
  },
  {
    id: 'proj-2',
    name: 'Midwest Logistics Overhaul',
    location: 'Chicago, IL',
    description: 'Integrating new automated sorting systems to improve fulfillment speed.',
    status: 'Active',
    progress: 45,
  },
  {
    id: 'proj-3',
    name: 'West Coast Warehouse Setup',
    location: 'Los Angeles, CA',
    description: 'Establishing a new warehouse to serve the pacific region.',
    status: 'Active',
    progress: 90,
  },
    {
    id: 'proj-4',
    name: 'Southern Region Supply Chain',
    location: 'Atlanta, GA',
    description: 'Optimizing delivery routes for the entire southern region.',
    status: 'On Hold',
    progress: 20,
  },
  {
    id: 'proj-5',
    name: 'International Shipment Hub',
    location: 'Miami, FL',
    description: 'Phase 1 of the international hub for South American routes.',
    status: 'Completed',
    progress: 100,
  },
];

export const tasks: Task[] = [
  { id: 'task-1', projectId: 'proj-1', name: 'Install new shelving units', status: 'DONE', assignee: 'John Doe', dueDate: '2023-10-15' },
  { id: 'task-2', projectId: 'proj-1', name: 'Configure inventory management software', status: 'IN_PROGRESS', assignee: 'Jane Smith', dueDate: '2023-11-01' },
  { id: 'task-3', projectId: 'proj-1', name: 'Hire additional warehouse staff', status: 'PENDING', assignee: 'Emily White', dueDate: '2023-11-10' },
  { id: 'task-4', projectId: 'proj-1', name: 'Finalize safety protocols', status: 'BLOCKED', assignee: 'Mike Brown', dueDate: '2023-10-25' },
  { id: 'task-5', projectId: 'proj-2', name: 'Procure automated sorters', status: 'DONE', assignee: 'Chris Green', dueDate: '2023-09-30' },
  { id: 'task-6', projectId: 'proj-2', name: 'Integrate sorters with WMS', status: 'IN_PROGRESS', assignee: 'Sarah Black', dueDate: '2023-11-15' },
  { id: 'task-7', projectId: 'proj-2', name: 'Train staff on new systems', status: 'PENDING', assignee: 'David King', dueDate: '2023-12-01' },
  { id: 'task-8', projectId: 'proj-3', name: 'Lease warehouse space', status: 'DONE', assignee: 'Olivia Blue', dueDate: '2023-08-10' },
  { id: 'task-9', projectId: 'proj-3', name: 'Set up initial inventory', status: 'DONE', assignee: 'Peter Pan', dueDate: '2023-09-01' },
  { id: 'task-10', projectId: 'proj-3', name: 'Go-live operations', status: 'IN_PROGRESS', assignee: 'Wendy Darling', dueDate: '2023-10-30' },
  { id: 'task-11', projectId: 'proj-3', name: 'Schedule first shipment reception', status: 'SCHEDULED', assignee: 'Captain Hook', dueDate: '2023-11-05' },
];

export const invoices: Invoice[] = [
  { id: 'INV-001', client: 'Nexus Corp', amount: 2500.00, status: 'Paid', date: '2023-10-15' },
  { id: 'INV-002', client: 'Quantum Solutions', amount: 1200.50, status: 'Pending', date: '2023-10-22' },
  { id: 'INV-003', client: 'Stellar Goods', amount: 850.00, status: 'Paid', date: '2023-09-30' },
  { id: 'INV-004', client: 'Apex Logistics', amount: 3400.00, status: 'Overdue', date: '2023-09-01' },
];

export const employees: Employee[] = [
  { id: 'emp-1', name: 'Alice Johnson', role: 'Logistics Manager', department: 'Operations', email: 'alice.j@wareflow.com', avatar: 'https://placehold.co/100x100.png' },
  { id: 'emp-2', name: 'Bob Williams', role: 'Warehouse Supervisor', department: 'Operations', email: 'bob.w@wareflow.com', avatar: 'https://placehold.co/100x100.png' },
  { id: 'emp-3', name: 'Charlie Brown', role: 'Accountant', department: 'Finance', email: 'charlie.b@wareflow.com', avatar: 'https://placehold.co/100x100.png' },
  { id: 'emp-4', name: 'Diana Prince', role: 'HR Manager', department: 'Human Resources', email: 'diana.p@wareflow.com', avatar: 'https://placehold.co/100x100.png' },
];

export const jobPostings: JobPosting[] = [
    { id: 'job-1', title: 'Senior Warehouse Associate', department: 'Operations', location: 'Newark, NJ', status: 'Open' },
    { id: 'job-2', title: 'Forklift Operator', department: 'Operations', location: 'Chicago, IL', status: 'Open' },
    { id: 'job-3', title: 'Financial Analyst', department: 'Finance', location: 'Remote', status: 'Closed' },
    { id: 'job-4', title: 'Recruiting Coordinator', department: 'Human Resources', location: 'Miami, FL', status: 'Open' },
];

export const expenses: Expense[] = [
  { id: 'exp-1', category: 'Office Supplies', description: 'Printer paper and ink', amount: 75.50, date: '2023-10-20' },
  { id: 'exp-2', category: 'Software', description: 'Subscription for project management tool', amount: 200.00, date: '2023-10-01' },
  { id: 'exp-3', category: 'Travel', description: 'Client meeting in Chicago', amount: 450.00, date: '2023-09-15' },
];

export const clients: Client[] = [
  { id: 'client-1', name: 'Nexus Corp', email: 'contact@nexuscorp.com', phone: '555-0101', address: '123 Nexus Way, Silicon Valley, CA', avatar: 'https://placehold.co/100x100/A6B1E1/FFFFFF.png' },
  { id: 'client-2', name: 'Quantum Solutions', email: 'info@quantum.com', phone: '555-0102', address: '456 Quantum Blvd, Boston, MA', avatar: 'https://placehold.co/100x100/FFD6A5/FFFFFF.png' },
  { id: 'client-3', name: 'Stellar Goods', email: 'support@stellargoods.co', phone: '555-0103', address: '789 Stellar Ave, Seattle, WA', avatar: 'https://placehold.co/100x100/A8D8B9/FFFFFF.png' },
  { id: 'client-4', name: 'Apex Logistics', email: 'service@apexlogistics.net', phone: '555-0104', address: '101 Apex Circle, Newark, NJ', avatar: 'https://placehold.co/100x100/F0B8B8/FFFFFF.png' },
];

export const estimates: Estimate[] = [
  { id: 'est-1', client: 'Nexus Corp', estimateNumber: 'EST-001', amount: 5000.00, status: 'Sent', date: '2023-10-18' },
  { id: 'est-2', client: 'Quantum Solutions', estimateNumber: 'EST-002', amount: 7500.00, status: 'Accepted', date: '2023-10-12' },
  { id: 'est-3', client: 'Stellar Goods', estimateNumber: 'EST-003', amount: 3200.00, status: 'Draft', date: '2023-10-25' },
];

export const documents: Document[] = [
  { id: 'doc-1', name: 'Contract_NexusCorp.pdf', type: 'PDF', size: '1.2 MB', uploadDate: '2023-10-15', relatedTo: 'client-1' },
  { id: 'doc-2', name: 'Shipping_Manifest_INV-003.docx', type: 'Word', size: '800 KB', uploadDate: '2023-09-30', relatedTo: 'INV-003' },
  { id: 'doc-3', name: 'Warehouse_Photos.zip', type: 'Image', size: '15.4 MB', uploadDate: '2023-08-20', relatedTo: 'proj-1' },
];
