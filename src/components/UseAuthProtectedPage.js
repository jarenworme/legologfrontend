import { useEffect, useState } from 'react';
import axios from 'axios';

export const useAuthProtectedPage = (redirectUrl) => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');
                if (!accessToken) {
                    window.location.href = redirectUrl;
                    return;
                }

                const { data } = await axios.get(
                    'http://localhost:8000/api/home/',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }
                );
                setMessage(data.message);
            } catch (error) {
                console.log('error', error);
            }
        };

        checkAuth();
    }, [redirectUrl]);

    return message;
};
