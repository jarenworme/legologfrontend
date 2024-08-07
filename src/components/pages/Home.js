import { useNavigate } from "react-router-dom";
import { useAuthProtectedPage } from "../UseAuthProtectedPage";
import '../styles/home.css'

export default function Home () {

    const navigate = useNavigate();
    const routeSetList = () => navigate('/SetList', { replace: false });
    const routePieceList = () => navigate('/PieceList', { replace: false });
    const routeStats = () => navigate('/Stats', { replace: false });
    const routeOnlineStats = () => navigate('/OnlineStats', { replace: false });
    const routeAbout = () => navigate('/About', { replace: false });

    const message = useAuthProtectedPage('/login');

    return (
        <div className="outer-container">
            <div className="home-wrapper">
                <div className="left-home-wrapper">
                    <button className="home-nav-button-primary" onClick={routeSetList}>
                        <div className="home-text-wrapper"><h1 className="home-text">Your LEGO Sets</h1></div>
                    </button>
                </div>
                <div className="right-home-wrapper">
                    <div className="home-nav-button-wrapper">
                        <button className="home-nav-button pieces-image" onClick={routePieceList}>Your Missing LEGO Pieces</button>
                    </div>
                    <div className="home-nav-button-wrapper">
                        <button className="home-nav-button stats-image" onClick={routeStats}>Your Statistics</button>
                    </div>
                    <div className="home-nav-button-wrapper">
                        <button className="home-nav-button online-image" onClick={routeOnlineStats}>Online Statistics</button>
                    </div>
                    <div className="home-nav-button-wrapper-secondary">
                        <button className="home-nav-button-secondary" onClick={routeAbout}>About LEGOlog</button>
                    </div>
                </div>
            </div>
        </div>
  );
}
