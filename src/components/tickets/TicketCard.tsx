import { useNavigate } from 'react-router-dom';
import type { Ticket } from '../../types';
import styles from './TicketCard.module.css';

interface TicketCardProps {
  ticket: Ticket;
}

const statusStyles: Record<string, string> = {
  new: styles.statusNew,
  processing: styles.statusProcessing,
  in_progress: styles.statusInProgress,
  resolved: styles.statusResolved,
  closed: styles.statusClosed,
};

const priorityStyles: Record<string, string> = {
  low: styles.priorityLow,
  medium: styles.priorityMedium,
  high: styles.priorityHigh,
  urgent: styles.priorityUrgent,
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatStatus = (status: string): string => {
  return status.replace('_', ' ');
};

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/tickets/${ticket.id}`);
  };

  return (
    <article className={styles.card} onClick={handleClick}>
      <div className={styles.header}>
        <h3 className={styles.title}>{ticket.title}</h3>
        <div className={styles.badges}>
          <span className={`${styles.statusBadge} ${statusStyles[ticket.status]}`}>
            {formatStatus(ticket.status)}
          </span>
          <span className={`${styles.priorityBadge} ${priorityStyles[ticket.priority]}`}>
            {ticket.priority}
          </span>
        </div>
      </div>

      <p className={styles.body}>{ticket.body}</p>

      <div className={styles.footer}>
        <div className={styles.client}>
          <span className={styles.clientIcon}>🏢</span>
          <span>{ticket.client?.name || 'Unknown Client'}</span>
        </div>
        <span className={styles.ticketId}>
          {formatDate(ticket.createdAt)}
        </span>
      </div>
    </article>
  );
};
