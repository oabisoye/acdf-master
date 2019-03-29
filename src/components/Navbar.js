import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMobileMenuActive: false,
            isModalActive: false,
            modalContent: 'lorem is a kind of text'
        };
    }
    render() {
        return (
            <div className="acdf-menu">
                <div className="container">
                    <nav className="navbar">
                        <div className="navbar-menu acdf-nav-padded">
                            <div className="navbar-start">
                                <Link className="navbar-item is-hidden-desktop-only" to='/'>Home</Link>
                                <Link className="navbar-item is-hidden-desktop-only" to='/create'>Create</Link>
                                <a className='navbar-item is-hidden-desktop-only' onClick={e => this.setState({ isModalActive: true })}>About Us</a>
                            </div>
                        </div>
                        <div className="navbar-brand">
                            <Link to="/" className="navbar-item acdf-nav-logo">
                                <img src="/images/collage_logo.svg" alt="logo"/>
                            </Link>
                            <div className="navbar-burger" onClick={e => this.setState({ isMobileMenuActive: true })}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        <div className="navbar-menu">
                            <div className="navbar-end">
                                <div className="navbar-item is-hidden-desktop-only">
                                    <div className="field">
                                        <p className="control">
                                            <a className="button nav-share-button" href="#">
                                                <span>Share!</span>
                                            </a>
                                        </p>
                                    </div>
                                </div>
                                <Link className="navbar-item is-hidden-desktop-only" to='/gallery'>View Gallery</Link>
                                <a href="#" className="navbar-item is-hidden-desktop-only">Contact Us</a>
                            </div>
                        </div>
                    </nav>
                </div>
                <div className={classNames({
                    'modal': true,
                    'is-active': this.state.isModalActive
                })}>
                    <div className="modal-background"/>
                    <div className="modal-content">
                        {this.state.modalContent}
                    </div>
                    <button className="modal-close is-large" aria-label="close" onClick={e => this.setState({ isModalActive: false })}/>
                </div>
                <div className={classNames({
                    'mobile-nav': true,
                    'is-hidden': !this.state.isMobileMenuActive
                })}>
                    <div className="mobile-nav-close" onClick={e => this.setState({ isMobileMenuActive: false })}>&times;</div>
                    <ul className="mobile-nav-list" onClick={e => this.setState({ isMobileMenuActive: false })}>
                        <li><Link className="mobile-nav-item" to="/">Home</Link></li>
                        <li><Link className="mobile-nav-item" to="/create">Create</Link></li>
                        <li><Link className="mobile-nav-item" to="/gallery">Gallery</Link></li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Navbar;
