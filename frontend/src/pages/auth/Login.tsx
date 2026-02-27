import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import { fetchApi } from '../../services/api';
import type { Token } from '../../types';
import './Login.css';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetchApi<Token>('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            localStorage.setItem('token', response.access_token);
            navigate('/');
        } catch {
            // Fallback: demo login when backend is unavailable
            if (email === 'admin@schooleye.in' && password === 'admin') {
                localStorage.setItem('token', 'demo-jwt-token');
                navigate('/');
                return;
            }
            setError('Login failed. Try admin@schooleye.in / admin');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-wrapper bg-app">
            <div className="login-bg-shape shape-1"></div>
            <div className="login-bg-shape shape-2"></div>

            <div className="login-container animate-fade-in">
                <div className="login-brand">
                    <div className="brand-logo">SE</div>
                    <h1 className="brand-name">SchoolEye</h1>
                    <p className="brand-tagline">Cloud ERP for Modern Schools</p>
                </div>

                <Card className="login-card">
                    <CardHeader>
                        <CardTitle>Welcome Back</CardTitle>
                        <p className="text-secondary text-sm">Sign in to your account to continue</p>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent>
                            {error && <div className="login-error-alert">{error}</div>}
                            <Input
                                label="Email or Username"
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                            <Input
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                            <div className="flex justify-between items-center forgot-password">
                                <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer">
                                    <input type="checkbox" className="custom-checkbox" />
                                    Remember me
                                </label>
                                <a href="#" className="text-sm font-medium">Forgot password?</a>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full btn-lg" isLoading={isLoading}>
                                Sign In
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};
