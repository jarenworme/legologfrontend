import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuthProtectedPage } from "../UseAuthProtectedPage";
import THEMES from "../data arrays/Themes";
import '../styles/add.css'


export default function AddNewSet(){
    // this call redirects a user to the login page if they somehow get here without logging in first
    useAuthProtectedPage('/login');
    
    // hold user info of the form [id, username] so we post the new set to the right user
    const [userInfo, setUserInfo] = useState(null);

    // init navigate variable for page navigation
    const navigate = useNavigate();

    // variable to hold the user-entered set name
    const [setName, setSetName] = useState('');

    // variable to hold the user-entered set theme
    const [setTheme, setSetTheme] = useState('');

    // variable to hold the user-entered set number
    const [setNum, setSetNum] = useState('');
    // variable to hold conditionally rendered error message for invalid set number
    const [setNumError, setSetNumError] = useState('');

    // variable to hold the user-entered number of pieces for the set
    const [setPieces, setSetPieces] = useState('');
    // variable to hold conditionally rendered error message for invalid set number
    const [setPiecesError, setSetPiecesError] = useState('');


    // gets information from the user so the new set can be added to the right user in api call
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/profile/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
                setUserInfo(response.data);
                console.log(setName, setTheme, setNum, setPieces);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchUserInfo();
    }, []);

    // validation function to ensure a correct set number in a valid range
    const validateSetNum = () => {
        // checks for a valid LEGO set number
        if(setNum < 100 || setNum > 99999){
            setSetNumError('Please enter a valid LEGO set number');
        } else {
            setSetNumError('');
        }
    }

    // validation function to ensure a correct piece count in a valid range
    const validatePieceNum = () => {
        // gives an error for 0 or less pieces, and piece counts over 11695, the count of the largest LEGO set ever released
        if(setPieces < 1 || setPieces > 11695){
            setSetPiecesError('Please enter a valid amount of pieces');
        } else {
            setSetPiecesError('');
        }
    }

    // post request to api to add a new set for the logged in user
    const handleSubmit = async (e) => {
        // prevent default form submission
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:8000/api/newset/${userInfo.id}/`, {
                name: setName,
                theme: setTheme,
                set_num: setNum,
                piece_num: setPieces
            });
            navigate('/SetList', { replace: false });
        } catch (error) {
            console.error('Error creating set:', error);
        }
    };

    // navigates back to the set list page when a user clicks the cancel button
    const handleCancel = () => navigate('/SetList', { replace: false });

    // <h2>you can edit this later, so you can put in a dummy number if you don't know right now</h2>
   
    return (
        <div className="outer-container outer-container-add">
            <div className="add-top-container">
                <div className="add-title-wrapper">
                    <h1 className="add-title">Add a New Set</h1>
                </div>
                <div className="add-subtitle-wrapper">
                    <p className="add-subtitle">Don't worry if you don't know all the information now, you can always edit the set details later!</p>
                </div>
            </div>
            <div className="add-middle-container">
                <form className="add-form" onSubmit={handleSubmit}>
                    <div className="add-field">
                        <label className="add-field-title">Name</label>
                        <input className="add-field-input" type="text" value={setName} onChange={(e) => setSetName(e.target.value)} />
                    </div>
                    <div className="add-field">
                        <label className="add-field-title">Theme</label>
                        <select className="add-field-input" value={setTheme} onChange={(e) => setSetTheme(e.target.value)}>
                            <option value="">Select Theme</option>
                            {THEMES.map(([id, name]) => (
                                <option key={id} value={id}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="add-field">
                        <label className="add-field-title">Set Number</label>
                        <input className="add-field-input" type="number" value={setNum} onChange={(e) => setSetNum(e.target.value)} onBlur={validateSetNum} />
                        { setNumError && (<p className="add-field-error">{setNumError}</p>) }
                    </div>
                    <div className="add-field">
                        <label className="add-field-title">Piece Count</label>
                        <input className="add-field-input" type="number" value={setPieces} onChange={(e) => setSetPieces(e.target.value)} onBlur={validatePieceNum} />
                        { setPiecesError && (<p className="add-field-error">{setPiecesError}</p>) }
                    </div>
                    <div className="add-buttons">
                        <button className="add-cancel-button" type="button" onClick={handleCancel}>Cancel</button>
                        <button className="add-submit-button" type="submit" disabled={setName.length == 0 || setTheme.length == 0 || setNum.length == 0 || setPiecesError.length > 0 || setNumError.length > 0}>Add New Set!</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
