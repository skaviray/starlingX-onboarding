import React from 'react';
import { Outlet } from "react-router-dom";

function MainContent() {
    return (
        <div className="p-4 flex-grow-1">
            <Outlet />
        </div>
    );
}
 
export default MainContent;