import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles/auth.css'


export const Login = () => {
    // init navigate variable for page navigation
    const navigate = useNavigate();

    // variables to hold user entered username and password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // variable to hold error message
    const [error, setError] = useState(''); 

    // send a request to the backend to log in a user with entered credentials
    const submit = async e => {
        e.preventDefault();
        const user = {
            username: username,
            password: password
        };
        try {
            // Create the POST request
            const { data } = await axios.post(
                'http://localhost:8000/token/', 
                user,
                { headers: { 'Content-Type': 'application/json' } },
                { withCredentials: true }
            );

            // Initialize the access & refresh token in localstorage.      
            localStorage.clear();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`;
            window.location.href = '/'
        } catch (err) {
            // Set error message if login fails
            setError('Incorrect username or password.');
        }
    }

    const handleRegister = () => navigate('/register', { replace: false });

    return (
        <div className="auth-container color-changer">
            <div className="auth-card">
                <div className="title-wrapper">
                    <h3 className="auth-title">Welcome to</h3>
                    <div className="span-wrapper auth-logo-span">
                        <span className="auth-logo-1">L</span>
                        <span className="auth-logo-2">E</span>
                        <span className="auth-logo-3">G</span>
                        <span className="auth-logo-4">O</span>
                        <span className="auth-logo-5">log</span>
                        <span className="auth-logo-r">&#174;</span>
                    </div>
                </div>
                <div className="middle-divider"></div>
                <form onSubmit={submit} className="login-form">
                    <div className="login-form-wrapper">
                        {error && <div className="error-text-login">{error}</div>}
                        <div className="input-wrapper">
                            <label className="input-label">Username</label>
                            <input className="input-box" 
                                placeholder="Enter Username" 
                                name='username'  
                                type='text' 
                                value={username}
                                required 
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="input-wrapper">
                            <label className="input-label">Password</label>
                            <input className="input-box"
                                name='password' 
                                type="password"     
                                placeholder="Enter password"
                                value={password}
                                required
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="button" onClick={handleRegister} className="change-auth">or register here</button>
                        <button type="submit" className="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
