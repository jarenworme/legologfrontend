import { useNavigate } from "react-router-dom";
import { useAuthProtectedPage } from "../UseAuthProtectedPage";

export default function OnlineStats () {
    // this call redirects a user to the login page if they somehow get here without logging in first
    useAuthProtectedPage('/login');

    // init navigate variable for page navigation
    const navigate = useNavigate();
    
    const routeHome = () => navigate('/', { replace: false });


    return (
        <div className="outer-container">
            <button onClick={routeHome}>Back</button>
            <h2>Online Statistics</h2>
        </div>
    );
}