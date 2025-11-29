import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

export const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.navIcon}>📊</span>
          Dashboard
        </NavLink>

        <div className={styles.divider} />
        <div className={styles.sectionTitle}>Tickets</div>

        <NavLink
          to="/tickets"
          end
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.navIcon}>📋</span>
          All Tickets
        </NavLink>

        <NavLink
          to="/tickets/create"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.navIcon}>➕</span>
          Create Ticket
        </NavLink>
      </nav>
    </aside>
  );
};
