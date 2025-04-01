import React, { Component } from 'react'

class Footer extends Component {
    state = {  } 
    render() { 
        return (
        <footer className="bg-dark text-white text-center py-3">
            &copy; {new Date().getFullYear()} My Website. All rights reserved.
        </footer>
        );
    }
}
 
export default Footer;