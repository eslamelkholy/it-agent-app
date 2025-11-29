// Ticket Status enum
export type TicketStatus = 'new' | 'processing' | 'in_progress' | 'resolved' | 'closed';

// Ticket Priority enum
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

// Client type
export interface Client {
  id: string;
  name: string;
  industry: string;
  timezone?: string;
  status?: string;
}

// RMM Device type
export interface RmmDevice {
  id: string;
  name: string;
  type: string;
}

// User type (for assigned technician)
export interface User {
  id: string;
  name: string;
  email: string;
}

// Attachment type
export interface Attachment {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
}

// Knowledge Base Article type
export interface KnowledgeBaseArticle {
  id: string;
  content: string;
}

// Main Ticket interface
export interface Ticket {
  id: string;
  clientId: string;
  rmmDeviceId: string | null;
  assignedTo: string | null;
  title: string;
  body: string;
  status: TicketStatus;
  priority: TicketPriority;
  externalTicketId: string | null;
  resolutionSteps: string | null;
  knowledgeBaseArticleId: string | null;
  createdAt: string;
  updatedAt: string;
  client?: Client;
  rmmDevice?: RmmDevice | null;
  assignedUser?: User | null;
  attachments?: Attachment[];
  knowledgeBaseArticle?: KnowledgeBaseArticle | null;
}

// Create ticket request payload
export interface CreateTicketRequest {
  clientId: string;
  title: string;
  body: string;
  priority?: TicketPriority;
  rmmDeviceId?: string;
  assignedTo?: string;
  externalTicketId?: string;
}

// Ticket filters for list endpoint
export interface TicketFilters {
  clientId?: string;
  status?: TicketStatus;
  assignedTo?: string;
}

// API Error response
export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}
