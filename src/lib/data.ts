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
  // Project 1
  { id: 'task-1', projectId: 'proj-1', name: 'Install new shelving units', status: 'DONE', assignee: 'John Doe', dueDate: '2023-10-15' },
  { id: 'task-2', projectId: 'proj-1', name: 'Configure inventory management software', status: 'IN_PROGRESS', assignee: 'Jane Smith', dueDate: '2023-11-01' },
  { id: 'task-3', projectId: 'proj-1', name: 'Hire additional warehouse staff', status: 'PENDING', assignee: 'Emily White', dueDate: '2023-11-10' },
  { id: 'task-4', projectId: 'proj-1', name: 'Finalize safety protocols', status: 'BLOCKED', assignee: 'Mike Brown', dueDate: '2023-10-25' },

  // Project 2
  { id: 'task-5', projectId: 'proj-2', name: 'Procure automated sorters', status: 'DONE', assignee: 'Chris Green', dueDate: '2023-09-30' },
  { id: 'task-6', projectId: 'proj-2', name: 'Integrate sorters with WMS', status: 'IN_PROGRESS', assignee: 'Sarah Black', dueDate: '2023-11-15' },
  { id: 'task-7', projectId: 'proj-2', name: 'Train staff on new systems', status: 'PENDING', assignee: 'David King', dueDate: '2023-12-01' },

  // Project 3
  { id: 'task-8', projectId: 'proj-3', name: 'Lease warehouse space', status: 'DONE', assignee: 'Olivia Blue', dueDate: '2023-08-10' },
  { id: 'task-9', projectId: 'proj-3', name: 'Set up initial inventory', status: 'DONE', assignee: 'Peter Pan', dueDate: '2023-09-01' },
  { id: 'task-10', projectId: 'proj-3', name: 'Go-live operations', status: 'IN_PROGRESS', assignee: 'Wendy Darling', dueDate: '2023-10-30' },
  { id: 'task-11', projectId: 'proj-3', name: 'Schedule first shipment reception', status: 'SCHEDULED', assignee: 'Captain Hook', dueDate: '2023-11-05' },
];
