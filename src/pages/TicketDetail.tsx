import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTickets } from '../context';
import styles from './TicketDetail.module.css';

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
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatStatus = (status: string): string => {
  return status.replace('_', ' ');
};

export const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedTicket, isLoading, error, fetchTicketById, clearSelectedTicket } = useTickets();

  useEffect(() => {
    if (id) {
      fetchTicketById(id);
    }
    return () => {
      clearSelectedTicket();
    };
  }, [id, fetchTicketById, clearSelectedTicket]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <Link to="/tickets" className={styles.backLink}>
          ← Back to tickets
        </Link>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!selectedTicket) {
    return null;
  }

  const isResolved = selectedTicket.status === 'resolved' || selectedTicket.status === 'closed';

  return (
    <div className={styles.page}>
      <Link to="/tickets" className={styles.backLink}>
        ← Back to tickets
      </Link>

      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{selectedTicket.title}</h1>
          <div className={styles.badges}>
            <span className={`${styles.statusBadge} ${statusStyles[selectedTicket.status]}`}>
              {formatStatus(selectedTicket.status)}
            </span>
            <span className={`${styles.priorityBadge} ${priorityStyles[selectedTicket.priority]}`}>
              {selectedTicket.priority}
            </span>
          </div>
        </div>
      </div>

      {isResolved && selectedTicket.resolutionSteps && (
        <div className={styles.resolvedBanner}>
          <span className={styles.resolvedIcon}>✅</span>
          <div className={styles.resolvedText}>
            <p className={styles.resolvedTitle}>Ticket Resolved by AI Agent</p>
            <p className={styles.resolvedSubtitle}>
              This ticket was automatically resolved using the knowledge base.
            </p>
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.mainContent}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>📝 Description</h3>
            <p className={styles.description}>{selectedTicket.body}</p>
          </div>

          {selectedTicket.resolutionSteps && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🔧 Resolution Steps</h3>
              <div className={styles.resolutionSteps}>{selectedTicket.resolutionSteps}</div>
            </div>
          )}

          {selectedTicket.knowledgeBaseArticle && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📚 Knowledge Base Article</h3>
              <div className={styles.resolutionSteps}>
                {selectedTicket.knowledgeBaseArticle.content}
              </div>
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>ℹ️ Details</h3>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Client</span>
              <span className={styles.infoValue}>
                {selectedTicket.client?.name || 'Unknown'}
              </span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Industry</span>
              <span className={styles.infoValue}>
                {selectedTicket.client?.industry || 'N/A'}
              </span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Created</span>
              <span className={styles.infoValue}>
                {formatDate(selectedTicket.createdAt)}
              </span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Updated</span>
              <span className={styles.infoValue}>
                {formatDate(selectedTicket.updatedAt)}
              </span>
            </div>

            {selectedTicket.assignedUser && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Assigned To</span>
                <span className={styles.infoValue}>
                  {selectedTicket.assignedUser.name}
                </span>
              </div>
            )}

            {selectedTicket.externalTicketId && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>External ID</span>
                <span className={styles.infoValue}>
                  {selectedTicket.externalTicketId}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
