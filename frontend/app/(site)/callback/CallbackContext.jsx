'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/shop\/?$/, '');

export default function CallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const [error, setError] = useState('');

    useEffect(() => {
        const access = searchParams.get('access');
        const refresh = searchParams.get('refresh');

        if (!access || !refresh) {
            setError('Authentication failed. No tokens received.');
            return;
        }

        const fetchUser = async () => {
            try {
                // Fetch user profile using the access token
                const res = await fetch(`${API_ORIGIN}/userauth/api/info/`, {
                    headers: { Authorization: `Bearer ${access}` },
                });

                if (!res.ok) throw new Error('Failed to fetch user');

                const user = await res.json();
                login(access, user, refresh);
                router.replace('/');
            } catch (err) {
                console.error(err);
                // Even if profile fetch fails, still log in with tokens
                login(access, null, refresh);
                router.replace('/');
            }
        };

        fetchUser();
    }, []);

    if (error) {
        return (
            <div className="auth-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: '#be123c', marginBottom: '1rem' }}>{error}</p>
                    <a href="/login" style={{ color: 'hsl(150 35% 40%)', fontWeight: 600 }}>Back to login</a>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fff' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: 40, height: 40, border: '3px solid #e5e7eb',
                    borderTopColor: 'hsl(150 35% 45%)', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite', margin: '0 auto 1rem'
                }} />
                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Signing you in...</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
