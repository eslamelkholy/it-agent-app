import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { Ticket, CreateTicketRequest, TicketFilters, TicketStatus } from '../types';
import { ticketService } from '../services';

// Context state interface
interface TicketContextState {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  isLoading: boolean;
  error: string | null;
  filters: TicketFilters;
}

// Context actions interface
interface TicketContextActions {
  fetchTickets: (filters?: TicketFilters) => Promise<void>;
  fetchTicketById: (id: string) => Promise<void>;
  createTicket: (data: CreateTicketRequest) => Promise<Ticket>;
  setFilters: (filters: TicketFilters) => void;
  clearError: () => void;
  clearSelectedTicket: () => void;
  getTicketsByStatus: (status: TicketStatus) => Ticket[];
  getTicketStats: () => TicketStats;
}

// Stats interface
interface TicketStats {
  total: number;
  new: number;
  processing: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

// Combined context type
type TicketContextType = TicketContextState & TicketContextActions;

// Create context with undefined default
const TicketContext = createContext<TicketContextType | undefined>(undefined);

// Provider props
interface TicketProviderProps {
  children: ReactNode;
}

/**
 * Ticket Context Provider
 * Manages global ticket state and provides actions for ticket operations
 */
export const TicketProvider: React.FC<TicketProviderProps> = ({ children }) => {
  // State
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<TicketFilters>({});

  // Fetch all tickets
  const fetchTickets = useCallback(async (newFilters?: TicketFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const appliedFilters = newFilters || filters;
      const data = await ticketService.getTickets(appliedFilters);
      setTickets(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tickets';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Fetch single ticket by ID
  const fetchTicketById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ticketService.getTicketById(id);
      setSelectedTicket(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch ticket';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new ticket
  const createTicket = useCallback(async (data: CreateTicketRequest): Promise<Ticket> => {
    setIsLoading(true);
    setError(null);
    try {
      const newTicket = await ticketService.createTicket(data);
      // Add new ticket to the beginning of the list
      setTickets((prev) => [newTicket, ...prev]);
      return newTicket;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create ticket';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set filters
  const setFilters = useCallback((newFilters: TicketFilters) => {
    setFiltersState(newFilters);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear selected ticket
  const clearSelectedTicket = useCallback(() => {
    setSelectedTicket(null);
  }, []);

  // Get tickets by status
  const getTicketsByStatus = useCallback(
    (status: TicketStatus): Ticket[] => {
      return tickets.filter((ticket) => ticket.status === status);
    },
    [tickets]
  );

  // Get ticket statistics
  const getTicketStats = useCallback((): TicketStats => {
    return {
      total: tickets.length,
      new: tickets.filter((t) => t.status === 'new').length,
      processing: tickets.filter((t) => t.status === 'processing').length,
      inProgress: tickets.filter((t) => t.status === 'in_progress').length,
      resolved: tickets.filter((t) => t.status === 'resolved').length,
      closed: tickets.filter((t) => t.status === 'closed').length,
    };
  }, [tickets]);

  // Context value
  const value: TicketContextType = {
    // State
    tickets,
    selectedTicket,
    isLoading,
    error,
    filters,
    // Actions
    fetchTickets,
    fetchTicketById,
    createTicket,
    setFilters,
    clearError,
    clearSelectedTicket,
    getTicketsByStatus,
    getTicketStats,
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
};

/**
 * Custom hook to use ticket context
 * Throws error if used outside of TicketProvider
 */
export const useTickets = (): TicketContextType => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
