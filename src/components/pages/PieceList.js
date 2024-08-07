import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuthProtectedPage } from "../UseAuthProtectedPage";
import COLORS from "../data arrays/Colors";
import THEMES from "../data arrays/Themes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import '../styles/lists.css'


export default function PieceList(){
    // this call redirects a user to the login page if they somehow get here without logging in first
    useAuthProtectedPage('/login');

    // init navigate variable for page navigation
    const navigate = useNavigate();

    // hold user info so the api call can be made to get all sets for a user
    // user info is of the form [id, username]
    const [userInfo, setUserInfo] = useState(null);

    // sets is an array of set objects with attributes id, name, theme, set_num, piece_num
    const [sets, setSets] = useState([]);

    // piecesAndSets is a variable where each element is of the form [display title, set name, piece id, setId]
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

    // build array piecesAndSets to hold all needed info to render piece list
    useEffect(() => {
        // temp variable to hold pieces when retrieving from api
        var tempPiecesTotal = [];

        // Use Promise.all to wait for all axios requests to resolve when retrieving all pieces for all sets
        Promise.all(
            sets.map(set => 
                axios.get(`http://localhost:8000/api/pieces/${set.id}/`)
                    .then(response => tempPiecesTotal.push([set.id, response.data, set.name, set.theme]))
                    .catch(error => console.log(error))
            )
        ).then(() => {
            // Sort the array after all axios requests have been completed so the order of sets and pieces in the arrays match
            // this functionality from set list is kept so the pieces are displayed together in the same order that sets
            // are displayed on that page
            var tempArray = tempPiecesTotal.sort((a, b) => a[0] - b[0]);
            var tempCombinedArray = [];
            // gather relevant data for every set to display
            for(let i = 0; i < tempArray.length; i++){
                // loop over all pieces j for the set i and add their quantity elements to get missing num
                // this is because tempArray is of the form [[setId, [piece1, piece2, ...], setName, setTheme], [setId, [], setName, setTheme], ...]
                for(let j = 0; j < tempArray[i][1].length; j++){
                    var pcol = COLORS[tempArray[i][1][j].color - 1][1];
                    var pcolclass = COLORS[tempArray[i][1][j].color - 1][2];
                    var plen = tempArray[i][1][j].length;
                    var pwid = tempArray[i][1][j].width;
                    var ptype = tempArray[i][1][j].piece_type;
                    var ptr = tempArray[i][1][j].transparent;
                    var ptrstr = "";
                    var pquan = tempArray[i][1][j].quantity;
                    var pid = tempArray[i][1][j].id;
                    var sname = tempArray[i][2];
                    var stheme = THEMES[tempArray[i][3] - 1][1];
                    var stitle = "LEGO " + stheme + " " + sname;
                    var sid = tempArray[i][0]

                    var psize = " " + plen + " x " + pwid + " ";
                    if(plen == 0 || pwid == 0){
                        psize = " ";
                    }

                    if(ptr){ ptrstr = " transparent ";}
                    var ptitle = pcol + psize + ptrstr + ptype + " (" + pquan + ")";
                    tempCombinedArray.push([ptitle, stitle, pid, sid, pcolclass]);
                }
            }
            setPiecesAndSets(tempCombinedArray);
        });
    }, [sets]);

    // navigate to the SetDetail page with the prop setId to view info for that particular set
    const viewSetDetail = (setId) => navigate(`/SetDetail/page/2/set/${setId}`, { replace: false });

    // send a request to delete a set and all its pieces (cascading)
    const handleDeletePiece = (id) => {
        axios.delete(`http://localhost:8000/api/piece/${id}/`)
            .then(response => {
                // Remove the deleted set from the state
                setPiecesAndSets(piecesAndSets.filter(item => item[2] !== id));
            })
            .catch(error => {
                console.log(error);
            });
    }

    // navigate to a page to add a new set for the logged in user
    const navigateAllSets = () => navigate('/SetList', { replace: false });

    const [isOdd, setIsOdd] = useState(false);

    useEffect(() => {
        if (piecesAndSets) {
            setIsOdd(piecesAndSets.length % 2 !== 0);
        }
    }, [piecesAndSets]);


  
    return (
        <div className="outer-container">
            <div className="list-title-wrapper">
                <h1 className="list-title">Your Missing Pieces</h1>
            </div>
            <div className="all-pieces">
                {piecesAndSets.length == 0 ? 
                <div>
                    <h2>you have no missing pieces</h2>
                    <button onClick={() => navigateAllSets()}>View All Sets</button>
                </div> 
                : piecesAndSets?.map((item, index) => (
                    <div key={item[2]} className={`set-card ${isOdd && index === piecesAndSets.length - 1 ? 'last-odd' : ''}`}>
                        <button className="piece-card-button" onClick={() => viewSetDetail(item[3])}>
                            <h1 className="piece-card-title">{item[0]}</h1>
                            <div className="piece-card-color-bar" style={{backgroundColor: item[4]}}></div>
                            <h1 className="piece-card-set-info">{item[1]}</h1>
                        </button>
                        <div className="xmark-icon-wrapper">
                            <FontAwesomeIcon icon={faCircleXmark} className='xmark-icon' size='xl' onClick={() => handleDeletePiece(item[2])}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
