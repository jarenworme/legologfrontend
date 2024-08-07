import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuthProtectedPage } from "../UseAuthProtectedPage";
import THEMES from "../data arrays/Themes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import '../styles/lists.css'


export default function SetList(){
    // this call redirects a user to the login page if they somehow get here without logging in first
    useAuthProtectedPage('/login');

    // init navigate variable for page navigation
    const navigate = useNavigate();

    // hold user info so the api call can be made to get all sets for a user
    // user info is of the form [id, username]
    const [userInfo, setUserInfo] = useState(null);

    // sets is an array of set objects with attributes id, name, theme, set_num, piece_num
    const [sets, setSets] = useState([]);

    // piecesAndSets is a variable where each element is of the form [display title, set number, pieces summary, setId]
    // which is calculated in the third useEffect hook with theapi to get pieces missing for each set
    const [piecesAndSets, setPiecesAndSets] = useState([]);


    // gets information from the user so the sets are called from the right user in the api call
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/profile/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
                setUserInfo(response.data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchUserInfo();
    }, []);

    // grab sets from api
    useEffect(() => {
        if(userInfo){
            var uid = userInfo.id
            axios.get(`http://localhost:8000/api/sets/${uid}/`)
                .then(response => {
                    setSets(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
            }
    }, [userInfo]);

    // build array piecesAndSets to hold all needed info to render set list
    useEffect(() => {
        // temp variable to hold pieces when retrieving from api
        var tempPiecesTotal = [];

        // Use Promise.all to wait for all axios requests to resolve when retrieving all pieces for all sets
        Promise.all(
            sets.map(set => 
                axios.get(`http://localhost:8000/api/pieces/${set.id}/`)
                    .then(response => tempPiecesTotal.push([set.id, response.data]))
                    .catch(error => console.log(error))
            )
        ).then(() => {
            // Sort the array after all axios requests have been completed so the order of sets and pieces in the arrays match
            var tempArray = tempPiecesTotal.sort((a, b) => a[0] - b[0]);
            var tempCombinedArray = [];
            // gather relevant data for every set to display
            for(let i = 0; i < tempArray.length; i++){
                var num_pieces_missing = 0;
                // loop over all pieces j for the set i and add their quantity elements to get missing num
                // this is because tempArray is of the form [[setId, [piece1, piece2, ...]], [setId, []], ...]
                for(let j = 0; j < tempArray[i][1].length; j++){
                    num_pieces_missing += tempArray[i][1][j].quantity;
                }
                var num_pieces_remaining = sets[i].piece_num - num_pieces_missing;
                var theme_string = THEMES[sets[i].theme - 1][1];
                var theme_color = THEMES[sets[i].theme - 1][2];
                var name_string = "LEGO " + theme_string + " " + sets[i].name;
                var set_num_string = "#" + sets[i].set_num;
                var pieces_string = num_pieces_remaining + "/" + sets[i].piece_num + " pieces";
                tempCombinedArray.push([name_string, set_num_string, pieces_string, sets[i].id, theme_color]);
            }
            setPiecesAndSets(tempCombinedArray);
        });
    }, [sets]);

    // navigate to the SetDetail page with the prop setId to view info for that particular set
    const viewSetDetail = (setId) => navigate(`/SetDetail/page/1/set/${setId}`, { replace: false });

    // send a request to delete a set and all its pieces (cascading)
    const handleDeleteSet = (id) => {
        axios.delete(`http://localhost:8000/api/set/${id}/`)
            .then(response => {
                // Remove the deleted set from the state
                setSets(sets.filter(set => set.id !== id));
            })
            .catch(error => {
                console.log(error);
            });
    }

    // navigate to a page to add a new set for the logged in user
    const addNewSet = () => navigate('/AddNewSet', { replace: false });

    const [isOdd, setIsOdd] = useState(false);

    useEffect(() => {
        if (piecesAndSets) {
            setIsOdd(piecesAndSets.length % 2 !== 0);
        }
    }, [piecesAndSets]);

  
    return (
        <div className="outer-container">
            <div className="list-title-wrapper">
                <h1 className="list-title">Your LEGO Sets</h1>
            </div>
            <div className="all-sets">
                {sets.length == 0 ? 
                <div>
                    <h2>you have no sets</h2>
                </div> 
                : piecesAndSets?.map((item, index) => (
                    <div key={item[3]} className={`set-card ${isOdd && index === piecesAndSets.length - 1 ? 'last-odd' : ''}`}>
                        <button className="set-card-button" onClick={() => viewSetDetail(item[3])}>
                            <h1 className="set-card-title">{item[0]}</h1>
                            <div className="set-card-color-bar" style={{backgroundColor: item[4]}}></div>
                            <div className="set-card-bottom-wrapper">
                                <h2 className="set-card-number">{item[1]}</h2>
                                <h2 className="set-card-pieces">{item[2]}</h2>
                            </div>
                        </button>
                        <div className="xmark-icon-wrapper">
                            <FontAwesomeIcon icon={faCircleXmark} className='xmark-icon' size='xl' onClick={() => handleDeleteSet(item[3])}/>
                        </div>
                    </div>
                ))}
            </div>
            <button className="add-set-button" onClick={() => addNewSet()}>Add New Set</button>
        </div>
    );
}
