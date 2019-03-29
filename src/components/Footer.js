import React, { Component } from 'react';

class Footer extends Component {
    render() {
        return (
            <div className="home-footer">
                <div className="home-footer-brands">
                    <div className="home-footer-brand-item">
                        <img src="/images/brands/ifi.png" alt="ifi"/>
                    </div>
                    <div className="home-footer-brand-item">
                        <img src="/images/brands/idan.png" alt="idan"/>
                    </div>
                    <div className="home-footer-brand-item">
                        <img src="/images/brands/diamond.png" alt="diamond"/>
                    </div>
                    <div className="home-footer-brand-item">
                        <img src="/images/brands/insecta.png" alt="insecta"/>
                    </div>
                    <div className="home-footer-brand-item">
                        <img src="/images/brands/xkojimedia.png" alt="xkojimedia"/>
                    </div>
                    <div className="home-footer-brand-item">
                        <img src="/images/brands/lagos.jpg" alt="lagos"/>
                    </div>
                    <div className="home-footer-brand-item">
                        <img src="/images/brands/dangote.png" alt="dangote"/>
                    </div>
                    <div className="home-footer-brand-item">
                        <img src="/images/brands/sterling.png" alt="sterling"/>
                    </div>
                </div>
                <div className="home-footer-copyright">
                    &copy; 2017 Insecta Studios
                </div>
            </div>
        );
    }
}

export default Footer;