import { useEffect, useMemo, useState } from 'react';
import { useFrontContext } from '../providers/FrontContext';
import { useTickets } from '../context';
import styles from './FrontPlugin.module.css';

const isInsideFront = (): boolean => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};

export const FrontPlugin: React.FC = () => {
  const frontContext = useFrontContext();
  const { tickets, fetchTickets } = useTickets();
  const [connectionTimeout, setConnectionTimeout] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!frontContext) {
        setConnectionTimeout(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [frontContext]);

  const relatedTickets = useMemo(() => {
    if (frontContext?.type === 'singleConversation' && tickets.length > 0) {
      const conversationSubject = frontContext.conversation?.subject?.toLowerCase() || '';
      const filtered = tickets.filter(ticket => 
        ticket.title.toLowerCase().includes(conversationSubject) ||
        conversationSubject.includes(ticket.title.toLowerCase())
      );
      return filtered.slice(0, 5);
    }
    return [];
  }, [frontContext, tickets]);

  if (!frontContext) {
    if (connectionTimeout && !isInsideFront()) {
      return (
        <div className={styles.container}>
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🔌</span>
            <h3>Front Context Required</h3>
            <p>This plugin must be loaded inside Front's sidebar.</p>
            <div className={styles.instructions}>
              <h4>Setup Instructions:</h4>
              <ol>
                <li>Go to Front Settings → Company → Developers</li>
                <li>Create a new app with a Sidebar Plugin</li>
                <li>Set the URL to: <code>{window.location.href}</code></li>
                <li>Pin the plugin in your Front sidebar</li>
              </ol>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Connecting to Front...</p>
        </div>
      </div>
    );
  }

  const userName = frontContext.teammate?.name || 'User';

  if (frontContext.type === 'noConversation') {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📭</span>
          <h3>No Conversation Selected</h3>
          <p>Select a conversation to view related tickets and create new ones.</p>
        </div>
      </div>
    );
  }

  if (frontContext.type === 'multiConversations') {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📋</span>
          <h3>Multiple Conversations</h3>
          <p>Select a single conversation to use the Alphora plugin.</p>
        </div>
      </div>
    );
  }

  const handleCreateTicket = async () => {
    if (frontContext.type !== 'singleConversation') return;
    
    const conversation = frontContext.conversation;
    const subject = conversation?.subject || 'New Support Ticket';
    
    const messages = await frontContext.listMessages();
    const latestMessage = messages.results[messages.results.length - 1];
    const body = latestMessage?.content?.body || '';

    window.open(
      `/tickets/create?title=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      '_blank'
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>A</span>
          <span className={styles.logoText}>Alphora Agent 101</span>
        </div>
        <p className={styles.greeting}>Hello, {userName}!</p>
      </div>

      {frontContext.type === 'singleConversation' && (
        <>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Current Conversation</h4>
            <div className={styles.conversationInfo}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Subject</span>
                <span className={styles.value}>{frontContext.conversation?.subject || 'No subject'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>From</span>
                <span className={styles.value}>{frontContext.conversation?.recipient?.name || 'Unknown'}</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Related Tickets</h4>
            {relatedTickets.length > 0 ? (
              <ul className={styles.ticketList}>
                {relatedTickets.map(ticket => (
                  <li key={ticket.id} className={styles.ticketItem}>
                    <a 
                      href={`/tickets/${ticket.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.ticketLink}
                    >
                      <span className={styles.ticketTitle}>{ticket.title}</span>
                      <span className={`${styles.ticketStatus} ${styles[`status${ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}`]}`}>
                        {ticket.status}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.noTickets}>No related tickets found.</p>
            )}
          </div>

          <div className={styles.actions}>
            <button className={styles.primaryButton} onClick={handleCreateTicket}>
              + Create Ticket from Conversation
            </button>
            <a 
              href="/tickets" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.secondaryButton}
            >
              View All Tickets
            </a>
          </div>
        </>
      )}
    </div>
  );
};
