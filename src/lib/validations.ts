import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  userCount: z.number().min(1, 'User count must be at least 1'),
});

// Project schemas
export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
  status: z.enum(['Active', 'On Hold', 'Completed']),
  endDate: z.string().min(1, 'End date is required'),
});

export const updateProjectSchema = projectSchema.partial().extend({
  id: z.string().uuid(),
});

// Task schemas
export const taskSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  name: z.string().min(1, 'Task name is required'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE', 'BLOCKED', 'SCHEDULED']),
  assignee: z.string().min(1, 'Assignee is required'),
  dueDate: z.string().min(1, 'Due date is required'),
});

export const updateTaskSchema = taskSchema.partial().extend({
  id: z.string().uuid(),
});

// Client schemas
export const clientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
});

export const updateClientSchema = clientSchema.partial().extend({
  id: z.string().uuid(),
});

// Invoice schemas
export const invoiceSchema = z.object({
  client: z.string().min(1, 'Client is required'),
  amount: z.number().positive('Amount must be positive'),
  tax: z.number().optional(),
  discount: z.number().optional(),
  lateFee: z.number().optional(),
  paidAmount: z.number().optional(),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  signature: z.string().optional(),
  status: z.enum(['Paid', 'Pending', 'Partial']),
  date: z.string().min(1, 'Date is required'),
  projectId: z.string().uuid().optional(),
  type: z.enum(['Standard', 'Retainer', 'Pro-forma']),
});

export const updateInvoiceSchema = invoiceSchema.partial().extend({
  id: z.string().uuid(),
});

// Employee schemas
export const employeeSchema = z.object({
  name: z.string().min(1, 'Employee name is required'),
  role: z.enum(['Manager', 'Warehouse Staff', 'Accountant', 'Driver', 'Contractor']),
  department: z.string().min(1, 'Department is required'),
  email: z.string().email('Invalid email address'),
  timesheetEnabled: z.boolean(),
  payrollManaged: z.boolean(),
});

export const updateEmployeeSchema = employeeSchema.partial().extend({
  id: z.string().uuid(),
});

// Inventory schemas
export const stockItemSchema = z.object({
  reference: z.string().min(1, 'Reference is required'),
  senderName: z.string().min(1, 'Sender name is required'),
  receiverName: z.string().min(1, 'Receiver name is required'),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().positive('Quantity must be positive'),
  weight: z.number().positive('Weight must be positive'),
  value: z.number().positive('Value must be positive'),
  status: z.enum(['In Warehouse', 'In Transit', 'Delivered']),
  entryDate: z.string().min(1, 'Entry date is required'),
  warehouseId: z.string().uuid().optional(),
  color: z.string().optional(),
  documentUrl: z.string().url().optional(),
});

export const updateStockItemSchema = stockItemSchema.partial().extend({
  id: z.string().uuid(),
});

// Warehouse schemas
export const warehouseSchema = z.object({
  name: z.string().min(1, 'Warehouse name is required'),
  location: z.string().min(1, 'Location is required'),
});

export const updateWarehouseSchema = warehouseSchema.partial().extend({
  id: z.string().uuid(),
});

// Payment schemas
export const paymentSchema = z.object({
  invoiceId: z.string().uuid('Invalid invoice ID'),
  clientName: z.string().min(1, 'Client name is required'),
  amount: z.number().positive('Amount must be positive'),
  date: z.string().min(1, 'Date is required'),
  method: z.enum(['Cash', 'Bank Transfer', 'Credit Card', 'Other']),
  notes: z.string().optional(),
});

export const updatePaymentSchema = paymentSchema.partial().extend({
  id: z.string().uuid(),
});

// Query parameters schema
export const paginationSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  search: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
export type EmployeeInput = z.infer<typeof employeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type StockItemInput = z.infer<typeof stockItemSchema>;
export type UpdateStockItemInput = z.infer<typeof updateStockItemSchema>;
export type WarehouseInput = z.infer<typeof warehouseSchema>;
export type UpdateWarehouseInput = z.infer<typeof updateWarehouseSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
