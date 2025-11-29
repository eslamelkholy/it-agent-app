import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateTicketRequest } from '../../types';
import { useTickets } from '../../context';
import styles from './TicketForm.module.css';

// Demo client ID for Cisco Systems
const DEMO_CLIENT_ID = '123e4567-e89b-12d3-a456-426614174000';

export const TicketForm: React.FC = () => {
  const navigate = useNavigate();
  const { createTicket, isLoading, error, clearError } = useTickets();

  const [formData, setFormData] = useState<CreateTicketRequest>({
    clientId: DEMO_CLIENT_ID,
    title: '',
    body: '',
    priority: 'medium',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTicket(formData);
      navigate('/tickets');
    } catch {
      // Error is already handled in context
    }
  };

  const handleCancel = () => {
    navigate('/tickets');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Create Support Ticket</h2>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.field}>
        <label className={styles.label}>
          Title<span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={styles.input}
          placeholder="Brief description of the issue"
          required
          maxLength={500}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          Description<span className={styles.required}>*</span>
        </label>
        <textarea
          name="body"
          value={formData.body}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="Provide detailed information about the issue..."
          required
        />
        <p className={styles.hint}>
          Include relevant details like error messages, affected users, or steps to reproduce.
        </p>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="low">Low - Can wait</option>
          <option value="medium">Medium - Standard priority</option>
          <option value="high">High - Needs attention soon</option>
          <option value="urgent">Urgent - Critical issue</option>
        </select>
      </div>

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isLoading || !formData.title || !formData.body}
        >
          {isLoading ? 'Creating...' : 'Create Ticket'}
        </button>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
