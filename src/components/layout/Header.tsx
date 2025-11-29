import styles from './Header.module.css';

interface HeaderProps {
  clientName?: string;
}

export const Header: React.FC<HeaderProps> = ({ clientName = 'Cisco Systems' }) => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>A</div>
        <div className={styles.logoText}>
          Alphora <span>Agent 101</span>
        </div>
      </div>

      <div className={styles.clientInfo}>
        <span className={styles.clientName}>{clientName}</span>
        <span className={styles.clientBadge}>Client Portal</span>
      </div>
    </header>
  );
};
