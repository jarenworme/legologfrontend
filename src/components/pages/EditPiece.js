import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthProtectedPage } from "../UseAuthProtectedPage";
import COLORS from "../data arrays/Colors";

export default function EditPiece () {
    // this call redirects a user to the login page if they somehow get here without logging in first
    useAuthProtectedPage('/login');

    // init navigate variable for page navigation
    const navigate = useNavigate();

    // Accessing the parameter from the URL of setID passed in from either setList of pieceList
    const { prevPage, setId, pieceId, threshold } = useParams();

    // contains all of the set information for the particular piece being examined
    const [pieceObj, setPieceObj] = useState([]);

    // variable to hold the user-entered piece type
    const [pType, setPType] = useState('');
    // variable to hold conditionally rendered error message for invalid piece type
    const [pTypeError, setPTypeError] = useState('');

    // variable to hold the user-entered piece color
    const [pColor, setPColor] = useState('');

    // variable to hold the user-entered piece length
    const [pLength, setPLength] = useState('');

    // variable to hold the user-entered piece width
    const [pWidth, setPWidth] = useState('');

    // variable to hold conditionally rendered error message for invalid piece width
    const [pSizeError, setPSizeError] = useState('');

    // variable to hold the user-entered number of pieces missing for this piece (0:999)
    const [pQuantity, setPQuantity] = useState(1);
    // variable to hold conditionally rendered error message for invalid piece quantity
    const [pQuantityError, setPQuantityError] = useState('');

    // variable to hold yes or no to the piece being transparent
    const [pTr, setPTr] = useState(false);

    // validation function to ensure a correct set number in a valid range
    const validateType = () => {
        // checks for a valid LEGO piece type
        if(pType.length > 50){
            setPTypeError('Too Long!');
        } else {
            setPTypeError('');
        }
    }

    // validation function to ensure a correct set number in a valid range
    const validateSize = () => {
        // checks for a valid LEGO piece length AND width
        if(pLength < 0 || pLength > 50 || pWidth < 0 || pWidth > 50){
            setPSizeError('Invalid piece size. Must be between 0 and 50');
        } else {
            setPSizeError('');
        }
    }

    // validation function to ensure a correct piece quantity that never exceeds piece count
    const validateQuantity = () => {
        // checks for a valid LEGO piece quantity
        if(pQuantity < 0){
            setPQuantityError('Must be at least 1 to add piece');
        } else if(pQuantity > threshold){
            setPQuantityError('This quantity makes you miss more piece than there are pieces in the set');
        } else {
            setPQuantityError('');
        }
    }

    // grab piece with id pieceId from api once the prop has been read
    useEffect(() => {
        if(pieceId){
            axios.get(`http://localhost:8000/api/piece/${pieceId}/`)
                .then(response => {
                    setPieceObj(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [pieceId]);

    // update variables to what they are currently set to from the api call once pieceObj is allocated
    useEffect(() => {
        if(pieceObj.piece_type != null){
            setPType(pieceObj.piece_type);
            setPColor(pieceObj.color);
            setPLength(pieceObj.length);
            setPWidth(pieceObj.width);
            setPQuantity(pieceObj.quantity);
            setPTr(pieceObj.transparent);
        }
    }, [pieceObj]);

    // put request to api to update edited piece details
    const handleSubmit = async (e) => {
        // prevent default form submission
        e.preventDefault();

        try {
            const response = await axios.put(`http://localhost:8000/api/piece/${pieceId}/`, {
                "piece_type": pType,
                "length": pLength,
                "width": pWidth,
                "color": pColor,
                "transparent": pTr,
                "quantity": pQuantity
            });
            navigate(`/SetDetail/page/${prevPage}/set/${setId}`, { replace: false });
        } catch (error) {
            console.error('Error editing piece:', error);
        }
    };

    const handleCancel = () => navigate(`/SetDetail/page/${prevPage}/set/${setId}`, { replace: false });


    return (
        <div className="outer-container outer-container-add">
            <div className="add-top-container">
                <div className="add-title-wrapper">
                    <h1 className="add-title">Edit This Piece</h1>
                </div>
                <div className="add-subtitle-wrapper">
                    <p className="add-subtitle">You can change any details you'd like! Remember you can enter 0 x 0 as the size if you are logging an unusual piece and we'll format it to suit!</p>
                </div>
            </div>
            <div className="add-middle-container">
                <form className="add-form" onSubmit={handleSubmit}>
                    <div className="add-field">
                        <label className="add-field-title">Piece Type:</label>
                        <input className="add-field-input" type="text" value={pType} onChange={(e) => setPType(e.target.value)} onBlur={validateType} />
                        { pTypeError && (<h2>{pTypeError}</h2>) }
                    </div>
                    <div className="add-field">
                        <label className="add-field-title">Color:</label>
                        <select className="add-field-input" value={pColor} onChange={(e) => setPColor(e.target.value)}>
                            <option value="">Select Color</option>
                            {COLORS.map(([id, name]) => (
                                <option key={id} value={id}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="add-field">
                        <label className="add-field-title">Size</label>
                        <div className="size-field">
                            <input className="add-field-input-size" type="number" value={pLength} onChange={(e) => setPLength(e.target.value)} onBlur={validateSize} />
                            <h2 className="add-piece-x"> x </h2>
                            <input className="add-field-input-size" type="number" value={pWidth} onChange={(e) => setPWidth(e.target.value)} onBlur={validateSize} />
                            { pSizeError && (<h2>{pSizeError}</h2>) }
                        </div>
                    </div>
                    
                    <div className="add-field">
                        <label className="add-field-title">Transparent</label>
                        <select className="add-field-input" value={pTr} onChange={(e) => setPTr(e.target.value)}>
                            <option value="false">no</option>
                            <option value="true">yes</option>
                        </select>
                    </div>
                    <div className="add-field">
                        <label className="add-field-title">Quantity:</label>
                        <input className="add-field-input" type="text" value={pQuantity} onChange={(e) => setPQuantity(e.target.value)} onBlur={validateQuantity} />
                        { pQuantityError && (<h2>{pQuantityError}</h2>) }
                    </div>
                    <div className="add-buttons">
                        <button className="add-cancel-button" type="button" onClick={handleCancel}>Cancel</button>
                        <button 
                            className="add-submit-button"
                            type="submit" 
                            disabled={pType.length == 0 || pLength.length == 0 || pWidth.length == 0 || pColor.length == 0 || pTr.length == 0 || pQuantity.length == 0 || pTypeError.length > 0 || pSizeError.length > 0 || pQuantityError.length > 0}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    );
}



