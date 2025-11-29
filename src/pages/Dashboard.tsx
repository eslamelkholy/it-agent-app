import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTickets } from '../context';
import { TicketList } from '../components';
import styles from './Dashboard.module.css';

export const Dashboard: React.FC = () => {
  const { tickets, isLoading, error, fetchTickets, getTicketStats } = useTickets();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const stats = getTicketStats();

  // Get recent tickets (last 5)
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <Link to="/tickets/create" className={styles.createBtn}>
          <span>➕</span> New Ticket
        </Link>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Tickets</span>
          <span className={styles.statValue}>{stats.total}</span>
        </div>
        <div className={`${styles.statCard} ${styles.new}`}>
          <span className={styles.statLabel}>New</span>
          <span className={styles.statValue}>{stats.new}</span>
        </div>
        <div className={`${styles.statCard} ${styles.processing}`}>
          <span className={styles.statLabel}>Processing</span>
          <span className={styles.statValue}>{stats.processing}</span>
        </div>
        <div className={`${styles.statCard} ${styles.inProgress}`}>
          <span className={styles.statLabel}>In Progress</span>
          <span className={styles.statValue}>{stats.inProgress}</span>
        </div>
        <div className={`${styles.statCard} ${styles.resolved}`}>
          <span className={styles.statLabel}>Resolved</span>
          <span className={styles.statValue}>{stats.resolved}</span>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Tickets</h2>
          <Link to="/tickets" className={styles.viewAllLink}>
            View all →
          </Link>
        </div>
        <TicketList tickets={recentTickets} isLoading={isLoading} error={error} />
      </section>
    </div>
  );
};
