import React, { useState } from 'react';
import styles from './PaymentForm.module.css';

interface PaymentFormProps {
  amount: number; // amount in grosze (e.g. 5000 = 50 PLN)
  description: string;
  source?: string; // optional source identifier for analytics
  defaultFirstName?: string;
  defaultLastName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
}

export default function PaymentForm({
  amount,
  description,
  source = 'pricing',
  defaultFirstName = '',
  defaultLastName = '',
  defaultEmail = '',
  defaultPhone = '',
}: PaymentFormProps) {
  const [firstName, setFirstName] = useState(defaultFirstName);
  const [lastName, setLastName] = useState(defaultLastName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState(defaultPhone);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const phoneRegex = /^[+]?\d{7,15}$/;
    if (!firstName.trim()) return 'Enter first name in Latin (e.g. Ivan)';
    if (!lastName.trim()) return 'Enter last name in Latin (e.g. Petrenko)';
    if (!emailRegex.test(email)) return 'Enter a valid email';
    if (phone && !phoneRegex.test(phone)) return 'Enter a valid phone number';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          description,
          email,
          firstName,
          lastName,
          phone,
          lang: 'uk',
          source,
        }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setError(data.error || 'Unexpected response from server');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label="Payment form" noValidate>
      <div className={styles.field}>
        <label htmlFor="firstName" className={styles.label}>First name (Latin)</label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          className={styles.input}
          placeholder="Ivan"
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="lastName" className={styles.label}>Last name (Latin)</label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className={styles.input}
          placeholder="Petrenko"
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>Your email for receipt</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={styles.input}
          placeholder="example@gmail.com"
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="phone" className={styles.label}>Contact phone</label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className={styles.input}
          placeholder="+48 123 456 789"
        />
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? 'Redirecting...' : 'Proceed to Przelewy24 payment'}
      </button>
    </form>
  );
}
