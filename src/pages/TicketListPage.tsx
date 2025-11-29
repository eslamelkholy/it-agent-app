import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTickets } from '../context';
import { TicketList } from '../components';
import type { TicketStatus } from '../types';
import styles from './TicketListPage.module.css';

export const TicketListPage: React.FC = () => {
  const { tickets, isLoading, error, fetchTickets, filters, setFilters } = useTickets();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as TicketStatus | '';
    const newFilters = { ...filters };
    if (status) {
      newFilters.status = status;
    } else {
      delete newFilters.status;
    }
    setFilters(newFilters);
    fetchTickets(newFilters);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>All Tickets</h1>
        <Link to="/tickets/create" className={styles.createBtn}>
          <span>➕</span> New Ticket
        </Link>
      </div>

      <div className={styles.filters}>
        <select
          className={styles.filterSelect}
          value={filters.status || ''}
          onChange={handleStatusChange}
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="processing">Processing</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className={styles.ticketCount}>
        Showing {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
      </div>

      <TicketList tickets={tickets} isLoading={isLoading} error={error} />
    </div>
  );
};
