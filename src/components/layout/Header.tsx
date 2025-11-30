import styles from './Header.module.css';

interface HeaderProps {
  clientName?: string;
}

export const Header: React.FC<HeaderProps> = ({ clientName = 'Cisco Systems' }) => {
  const initials = clientName.split(' ').map(n => n[0]).join('').slice(0, 2);
  
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>A</div>
        <div className={styles.logoText}>
          Alphora <span>Agent 101</span>
        </div>
      </div>

      <div className={styles.clientInfo}>
        <div className={styles.clientAvatar}>{initials}</div>
        <span className={styles.clientName}>{clientName}</span>
        <span className={styles.clientBadge}>Active</span>
      </div>
    </header>
  );
};
