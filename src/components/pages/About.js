import { useNavigate } from "react-router-dom";
import { useAuthProtectedPage } from "../UseAuthProtectedPage";

export default function About () {
    // this call redirects a user to the login page if they somehow get here without logging in first
    useAuthProtectedPage('/login');

    // init navigate variable for page navigation
    const navigate = useNavigate();
    
    const routeHome = () => navigate('/', { replace: false });


    return (
        <div className="outer-container">
            <button onClick={routeHome}>Back</button>
            <h2>About LEGOlog</h2>
            <p>info will go here</p>
        </div>
    );
}
