import {useRoutes} from "react-router-dom";

import { Login } from "../login";
import { Register } from "../Register";
import { Logout } from "../Logout";

import Home from "../pages/Home";
import SetList from "../pages/SetList";
import SetDetail from "../pages/SetDetail";
import AddNewSet from "../pages/AddNewSet";
import AddNewPiece from "../pages/AddNewPiece";
import PieceList from "../pages/PieceList";
import EditSet from "../pages/EditSet";
import EditPiece from "../pages/EditPiece";
import Stats from "../pages/Stats";
import OnlineStats from "../pages/OnlineStats";
import About from "../pages/About";


export default function Router (){
    return useRoutes([
        {
            path: '/',
            children: [
                {
                    path: '/',
                    element: <Home />
                },
                {
                    path: '/register',
                    element: <Register />
                },
                {
                    path: '/login',
                    element: <Login />
                },
                {
                    path: "/logout",
                    element: <Logout />
                },
                {
                    path: '/SetList',
                    element: <SetList />
                },
                {
                    path: '/PieceList',
                    element: <PieceList />
                },
                {
                    path: '/SetDetail/page/:prevPage/set/:setId',
                    element: <SetDetail />
                },
                {
                    path: '/AddNewSet',
                    element: <AddNewSet />
                },
                {
                    path: '/AddNewPiece/page/:prevPage/set/:setId/data/:missing',
                    element: <AddNewPiece />
                },
                {
                    path: '/EditSet/page/:prevPage/set/:setId',
                    element: <EditSet />
                },
                {
                    path: '/EditPiece/page/:prevPage/set/:setId/piece/:pieceId/thr/:threshold',
                    element: <EditPiece />
                },
                {
                    path: "/Stats",
                    element: <Stats />
                },
                {
                    path: "/OnlineStats",
                    element: <OnlineStats />
                },
                {
                    path: "/About",
                    element: <About />
                },
            ]
        },
    ]);
}
