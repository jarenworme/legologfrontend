import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthProtectedPage } from "../UseAuthProtectedPage";
import COLORS from "../data arrays/Colors";
import THEMES from "../data arrays/Themes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import '../styles/setDetail.css'
import { faCirclePlus, faCircleMinus } from '@fortawesome/free-solid-svg-icons';

export default function SetDetail () {
    // this call redirects a user to the login page if they somehow get here without logging in first
    useAuthProtectedPage('/login');

    // init navigate variable for page navigation
    const navigate = useNavigate();

    // Accessing the parameter from the URL of setID passed in from either setList or pieceList
    const { prevPage, setId } = useParams();
    const setIdNumber = parseInt(setId, 10);

    // contains all of the set information for the particular set being examined
    const [setObj, setSetObj] = useState([]);

    // holds the corresponding theme name in THEMES from setObj.theme 
    const[sTheme, setSTheme] = useState([""]);

    // contains all of the pieces missing for this set
    const [pieces, setPieces] = useState([]);

    // stores the value for the calculated number of missing pieces
    const [numMissing, setNumMissing] = useState(0);

    // keeps track of the disable condition for the fontawesome icon
    const isDisabled = setObj.piece_num - numMissing < 2;


    // grab set with id setIdNumber from api
    useEffect(() => {
        if(setIdNumber){
            axios.get(`http://localhost:8000/api/set/${setIdNumber}/`)
                .then(response => {
                    setSetObj(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [setIdNumber]);

    // grab missing pieces for the set from the api after the setObj has updated
    useEffect(() => {
        axios.get(`http://localhost:8000/api/pieces/${setIdNumber}/`)
                .then(response => {
                    setPieces(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
    }, [setObj]);

    useEffect(() => {
        if(THEMES != [] && setObj.name != null) setSTheme(THEMES[setObj.theme - 1][1]);
    }, [THEMES, setObj])

    // calculate the amount of missing pieces after the pieces are fetched from the api
    useEffect(() => {
        var total = 0;
        for(let i = 0; i < pieces.length; i++){
            total += pieces[i].quantity;
        }
        setNumMissing(total);
    }, [pieces]);

    // redirect to a new page to edit the selected piece with all info needed passed as props
    const handleEditPiece = (pieceId, pieceQ) => {
        // this calculation sets the threshold properly for piece quantity error checking in edit page
        var threshold = setObj.piece_num - numMissing - 1 + pieceQ;
        navigate(`/EditPiece/page/${prevPage}/set/${setId}/piece/${pieceId}/thr/${threshold}`, { replace: false });
    }

    // decrease the quantity attribute of a piece object on screen and over the api
    // will delete the piece altogether if the quantity is 1 when decreasing
    const handleDecreaseDeletePiece = async (piece_id, index) => {
        if(pieces[index].quantity == 1){
            try {
                setPieces(pieces.filter(piece => piece.id !== piece_id));
                await axios.delete(`http://localhost:8000/api/piece/${piece_id}/`);
            } catch (error) {
                console.error('Error deleting piece:', error);
            }
        } else {
            try {
                const updatedPieces = [...pieces]; // Create a copy of the pieces array
                updatedPieces[index] = { ...updatedPieces[index], quantity: updatedPieces[index].quantity - 1 };
                setPieces(updatedPieces); // Set the updated array to trigger a re-render
                await axios.put(`http://localhost:8000/api/piece/${piece_id}/`, { 
                    piece_type: pieces[index].piece_type,
                    length: pieces[index].length,
                    width: pieces[index].width,
                    color: pieces[index].color,
                    transparent: pieces[index].transparent,
                    quantity: pieces[index].quantity - 1,
                });
            } catch (error) {
                console.error('Error updating piece:', error);
            }
        }
    }

    // increase the quantity attribute of the piece object on screen and over the api
    const handleIncreasePiece = async (piece_id, index) => {
        try {
            const updatedPieces = [...pieces]; // Create a copy of the pieces array
            updatedPieces[index] = { ...updatedPieces[index], quantity: updatedPieces[index].quantity + 1 };
            setPieces(updatedPieces); // Set the updated array to trigger a re-render
            await axios.put(`http://localhost:8000/api/piece/${piece_id}/`, { 
                piece_type: pieces[index].piece_type,
                length: pieces[index].length,
                width: pieces[index].width,
                color: pieces[index].color,
                transparent: pieces[index].transparent,
                quantity: pieces[index].quantity + 1,
            });
        } catch (error) {
            console.error('Error updating piece:', error);
        }
    }

    // navigate to a new page to handle adding a new piece to the set with id setId
    const handleAddPiece = () => navigate(`/AddNewPiece/page/${prevPage}/set/${setId}/data/${numMissing}`, { replace: false });

    // navigate to a new page to edit a set
    const handleEditSet = () => navigate(`/EditSet/page/${prevPage}/set/${setId}`, { replace: false });

    // delete the set with the id setIdNumber
    const handleDeleteSet = () => {
        axios.delete(`http://localhost:8000/api/set/${setIdNumber}/`)
            .then(response => {
                // go back to set list upon deletion
                navigate('/SetList', { replace: false });
            })
            .catch(error => {
                console.log(error);
            });
    }

    // navigate back to set list page by clicking the back button
    const handleBack = () => {
        if(prevPage == 1){
            navigate('/SetList', { replace: false });
        } else {
            navigate('/PieceList', { replace: false });
        }
    }

    return (
    <div className="outer-container outer-container-detail">
        <div className="detail-wrapper">
            <div className="left-detail-wrapper">
                <div className="detail-h-wrapper">
                    <h1 className="detail-set-name">LEGO {sTheme} {setObj.name}</h1>
                    <h1 className="detail-set-num">Set Number {setObj.set_num}</h1>
                    <h1 className="detail-set-pieces">Pieces: {setObj.piece_num - numMissing}/{setObj.piece_num}</h1>
                </div>
                <div className="detail-button-wrapper">
                    <button className="detail-wrapper detail-secondary" onClick={handleBack}>Back</button>
                    <button className="detail-wrapper detail-secondary" onClick={handleEditSet}>Edit Set</button>
                    <button className="detail-wrapper detail-delete" onClick={handleDeleteSet}>Delete Set</button>
                </div>
            </div>
            <div className="seperator-bar"></div>
            <div className="right-detail-wrapper">
                <h1 className="detail-right-title">Missing Pieces</h1>
                <div className="detail-piece-list">
                    {pieces.length == 0 ? 
                    <div>
                        <h2 className="no-missing-pieces">Currently, there are no missing pieces for this set!</h2>
                    </div> 
                    :pieces?.map((piece, index) => (
                        <div className="detail-piece-wrapper" key={index}>
                            <button className="detail-edit-piece" key={index} onClick={() => handleEditPiece(piece.id, piece.quantity)}>
                                <h1 className="detail-edit-piece-text">{COLORS[piece.color-1][1]} {(piece.transparent) ? "transparent " : ""}{(piece.length == 0 || piece.width == 0) ? " " : piece.length + " x " + piece.width + " "}{piece.piece_type} ({piece.quantity})</h1>
                            </button>
                            <div className="set-detail-icon-wrapper">
                                <FontAwesomeIcon 
                                    icon={faCirclePlus} 
                                    className='set-detail-icon' 
                                    onClick={!isDisabled ? () => handleIncreasePiece(piece.id, index) : undefined}
                                />
                            </div>
                            <div className="set-detail-icon-wrapper">
                                <FontAwesomeIcon 
                                    icon={faCircleMinus} 
                                    className='set-detail-icon' 
                                    onClick={() => handleDecreaseDeletePiece(piece.id, index)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <button className="detail-add-piece" onClick={handleAddPiece} disabled={setObj.piece_num - numMissing < 2}>Add New Piece</button>   
            </div>
        </div>
    </div>
    );
}
