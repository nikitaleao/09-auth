'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './SignUp.module.css'; // Скопируй соответствующий css-модуль из стилей HW-09

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const user = await register({ email, password });
      setUser(user);
      router.push('/profile');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form onSubmit={handleSubmit} className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
