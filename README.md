# Sebenza Logistics Suite

Sebenza Logistics Suite is a modern, web-based SaaS platform for logistics, warehouse, and business management. It unifies project management, accounting, inventory, HR, and client operations into a single, easy-to-use application.

## Features

- Project & Task Management
- Financial Management (invoicing, payments, reporting)
- Inventory & Asset Management
- Human Resources (employees, job postings)
- Client & Supplier Management
- Messaging & Document Handling
- Role-based Authentication
- Responsive, mobile-friendly UI

## Tech Stack

- **Frontend:** Next.js 15, React 18, TypeScript, Tailwind CSS
- **UI:** Radix UI, Lucide Icons, Recharts
- **State:** React Context API
- **Data:** In-memory (mock data, ready for backend integration)

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3001](http://localhost:3001)

3. **Login:**

   - Use the demo credentials: `admin@sebenza.com` / `password`

## Project Structure

```text
src/
  app/           # Pages & features
  components/    # UI & domain components
  contexts/      # Auth & data providers
  lib/           # Data models & utilities
```

## Available Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Documentation

- [Architectural Document](architectural_document.md)
- [Product Requirements (PRD)](product_requirements_document.md)

## License

MIT
