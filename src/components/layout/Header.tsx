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
          Alphora Agent 101
        </div>
      </div>

      <div className={styles.clientInfo}>
        <span className={styles.clientName}>{clientName}</span>
      </div>
    </header>
  );
};
