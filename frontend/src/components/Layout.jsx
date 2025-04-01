import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

function Layout() {
    return (
        <div className="d-flex flex-column vh-100">
            <Header />
            <div className="d-flex flex-grow-1">
                <Sidebar />
                <MainContent />
            </div>
            <Footer />
        </div>
    );
}

export default Layout; 