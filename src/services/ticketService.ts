import type { Ticket, CreateTicketRequest, TicketFilters } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Ticket Service - Handles all ticket-related API calls
 */
export const ticketService = {
  /**
   * Get all tickets with optional filters
   */
  async getTickets(filters?: TicketFilters): Promise<Ticket[]> {
    const params = new URLSearchParams();
    
    if (filters?.clientId) {
      params.append('clientId', filters.clientId);
    }
    if (filters?.status) {
      params.append('status', filters.status);
    }
    if (filters?.assignedTo) {
      params.append('assignedTo', filters.assignedTo);
    }

    const queryString = params.toString();
    const url = `${API_BASE}/psa/tickets${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tickets: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get a single ticket by ID
   */
  async getTicketById(id: string): Promise<Ticket> {
    const response = await fetch(`${API_BASE}/psa/tickets/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Ticket with ID "${id}" not found`);
      }
      throw new Error(`Failed to fetch ticket: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Create a new ticket (triggers AI processing in background)
   */
  async createTicket(data: CreateTicketRequest): Promise<Ticket> {
    const response = await fetch(`${API_BASE}/psa/webhook/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `Failed to create ticket: ${response.statusText}`
      );
    }

    return response.json();
  },
};
