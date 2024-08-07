import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles/auth.css' // will be applied without import since it was imported in login, but kept to know primary styling file

export const Register = () => {
    // init navigate variable for page navigation
    const navigate = useNavigate();

    // varaible to hold user entered username
    const [username, setUsername] = useState('');

    // varaible to hold user entered email
    const [email, setEmail] = useState('');
    // message to be displayed if email is invalid
    const [emailError, setEmailError] = useState('');

    // varaible to hold user entered password
    const [password1, setPassword1] = useState('');
    // message to be displayed if password1 is invalid
    const [password1Error, setPassword1Error] = useState('');
    // variable to switch whether password1 is visable or not
    const [showPassword1, setShowPassword1] = useState(false);


    // varaible to hold user entered confirmation password
    const [password2, setPassword2] = useState('');
    // message to be displayed if password2 is invalid
    const [password2Error, setPassword2Error] = useState('');
    // variable to switch whether password2 is visable or not
    const [showPassword2, setShowPassword2] = useState(false);


    // error check email
    const validateEmail = () => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            setEmailError('Invalid email address');
        } else {
            setEmailError('');
        }
    };

    //error check password: 8 characters long with min 1 lowercase, uppercase, digit, special
    const validatePassword1 = () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password1)) {
            setPassword1Error('Password is too weak');
            // Password must be eight (8) characters long, contain at least one (1) uppercase, one (1) lowercase, one (1) digit and one (1) special character
        } else {
            setPassword1Error('')
        }
    };

    // error check password 2: ensure it matches
    const validatePassword2 = () => {
        if (password1 !== password2) {
            setPassword2Error('Passwords do not match');
        } else {
            setPassword2Error('');
        }
    };

    // switch password1 to text type input so it is visable
    const handlePassword1Click = () => setShowPassword1(!showPassword1);

    // switch password1 to text type input so it is visable
    const handlePassword2Click = () => setShowPassword2(!showPassword2);

    // sends user info to register endpoint in backend
    const submit = async e => {
        e.preventDefault();

        const newUser = {
            username: username,
            email: email,
            password: password1
        };

        try {
            const { response } = await axios.post(
                'http://localhost:8000/api/register/',
                newUser,
                { headers: { 'Content-Type': 'application/json' } }
            );
            // Registration successful, redirect to login page
            navigate('/login', { replace: false });
        } catch (error) {
            console.log("Registration failed.");
        }
    };

    // navigate to login page
    const handleLogin = () => navigate('/login', { replace: false });

    // prototype eye button to view password
    // <button type="button" onClick={handlePassword1Click}>eye</button>

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
                        <div className="input-wrapper">
                            <label className="input-label">Username</label>
                            <input className="input-box"
                                name='username'
                                type='text'
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="input-wrapper">
                            <label className="input-label">Email</label>
                            <input className="input-box"
                                name='email'
                                type='email'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                onBlur={validateEmail}
                            />
                            { emailError && (<h4 className="error-text-register">{emailError}</h4>) }
                        </div>
                        <div className="input-wrapper">
                            <label className="input-label">Password</label>
                            <input className="input-box"
                                name='password1'
                                type={showPassword1 ? "text" : "password"}
                                value={password1}
                                onChange={e => setPassword1(e.target.value)}
                                onBlur={validatePassword1}
                            />
                            { password1Error && (<h4 className="error-text-register">{password1Error}</h4>) }
                        </div>
                        <div className="input-wrapper">
                            <label className="input-label">Confirm Password</label>
                            <input className="input-box"
                                name='password2'
                                type={showPassword2 ? "text" : "password"}
                                value={password2}
                                onChange={e => setPassword2(e.target.value)}
                                onBlur={validatePassword2}
                            />
                            { password2Error && (<h4 className="error-text-register">{password2Error}</h4>) }
                        </div>
                        <button type="button" className="change-auth" onClick={handleLogin}>or sign in</button>
                        <button type="submit" className="submit" disabled={username.length == 0 || email.length == 0 || password1.length == 0 ||
                            password2.length == 0 || emailError.length > 0 || password1Error.length > 0 || password2Error.length > 0}
                        >Register</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
