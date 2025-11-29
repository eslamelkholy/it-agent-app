import { Link } from 'react-router-dom';
import { TicketForm } from '../components';
import styles from './CreateTicket.module.css';

export const CreateTicket: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/tickets" className={styles.backLink}>
          ← Back to tickets
        </Link>
        <h1 className={styles.title}>Create New Ticket</h1>
      </div>
      <TicketForm />
    </div>
  );
};
