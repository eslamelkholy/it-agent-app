import type { Ticket } from '../../types';
import { TicketCard } from './TicketCard';
import styles from './TicketList.module.css';

interface TicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
  error?: string | null;
}

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  isLoading = false,
  error = null,
}) => {
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (tickets.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📭</div>
        <h3 className={styles.emptyTitle}>No tickets found</h3>
        <p className={styles.emptyText}>
          Create a new ticket to get started with AI-powered support.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
};
