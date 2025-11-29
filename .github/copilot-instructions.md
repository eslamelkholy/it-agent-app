# Alphora Agent 101 - Frontend Development Guidelines

## Project Overview

This is the frontend application for **Alphora Agent 101** - Europe's First AI-Native MSP Support Platform. The platform enables IT Managed Service Providers (MSPs) to leverage AI-driven automation for handling L1/L2 support tickets.

### Business Context

Alphora Holdings acquires and transforms IT MSPs across Europe. This platform helps:
- Automate 60-70% of L1/L2 ticket volume
- Reduce manual workload for technicians
- Improve service quality and response times
- Scale support capacity through automation

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **State Management**: React Context API
- **Build Tool**: Vite
- **Styling**: CSS Modules / Plain CSS
- **HTTP Client**: Fetch API

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── tickets/         # Ticket-related components
│   ├── layout/          # Layout components (Header, Sidebar, etc.)
│   └── common/          # Common/shared components
├── context/             # React Context providers
│   └── TicketContext.tsx
├── pages/               # Page components
│   ├── Dashboard.tsx
│   ├── TicketList.tsx
│   ├── TicketDetail.tsx
│   └── CreateTicket.tsx
├── services/            # API service layer
│   └── ticketService.ts
├── types/               # TypeScript type definitions
│   └── ticket.types.ts
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
└── styles/              # Global styles
```

## API Integration

### Base URL
```
http://localhost:3000/psa
```

### Endpoints
- `GET /psa/tickets` - List all tickets (with optional filters)
- `POST /psa/webhook/tickets` - Create a new ticket (triggers AI processing)
- `GET /psa/tickets/:id` - Get ticket details

### Ticket Status Flow
```
new → processing → resolved (automated)
                 → in_progress (escalated) → resolved → closed
```

### Ticket Statuses
| Status | Description |
|--------|-------------|
| `new` | Just created, not yet processed |
| `processing` | AI agent is analyzing |
| `in_progress` | Escalated to human technician |
| `resolved` | Issue resolved |
| `closed` | Ticket closed |

### Ticket Priorities
| Priority | Description |
|----------|-------------|
| `low` | Non-urgent |
| `medium` | Standard (default) |
| `high` | Needs attention soon |
| `urgent` | Critical, immediate |

## Coding Guidelines

### TypeScript
- Use strict TypeScript - no `any` types
- Define interfaces for all API responses and component props
- Use type guards where necessary

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use proper prop typing with interfaces
- Implement error boundaries for critical sections

### State Management
- Use Context API for global state (tickets, user session)
- Keep local state for component-specific data
- Avoid prop drilling - use context when data is needed by many components

### API Calls
- Centralize API calls in the services layer
- Handle loading and error states
- Implement proper error messages for users

### Styling
- Use consistent spacing and colors
- Mobile-first responsive design
- Use CSS variables for theming

## Component Patterns

### Context Provider Pattern
```tsx
const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider: React.FC<{children: ReactNode}> = ({children}) => {
  // State and handlers
  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) throw new Error('useTickets must be used within TicketProvider');
  return context;
};
```

### API Service Pattern
```tsx
const API_BASE = 'http://localhost:3000/psa';

export const ticketService = {
  async getTickets(filters?: TicketFilters): Promise<Ticket[]> {
    const response = await fetch(`${API_BASE}/tickets`);
    return response.json();
  },
  // ... other methods
};
```

## Testing Guidelines

- Write unit tests for utility functions
- Write integration tests for API services
- Write component tests for critical UI flows

## Git Commit Guidelines

- Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`
- Keep commits atomic and focused
- Write meaningful commit messages

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
