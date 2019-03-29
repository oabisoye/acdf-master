import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import classNames from 'classnames';
import axios from 'axios';

// import imageDump from '../utils/image_dump';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageGallery from '../components/ImageGallery';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: []
        };
    }
    componentDidMount() {
        axios('/api/entries').then(res => {
            console.log(res.data);
            if (res.data.status === 'success') {
                this.setState({
                    images: res.data.entries
                });
            }
        });
    }

    render() {

        // const galleryImages = imageDump;
        const galleryImages = this.state.images;

        return (
            <div className="home-wrapper gradient-wrapper">
                <Navbar/>
                <div className="container">
                    <section className="hero home-hero">
                        <div className="hero-body">
                            <div className="has-text-centered">
                                <h2 className="subtitle">
                                    Create a custom collage for <strong>free!</strong>
                                </h2>
                                <Link to="/create" className="button create-button">Create yours!</Link>
                            </div>
                        </div>
                    </section>
                    <div className="home-main-section section">
                        <div className="columns">
                            <div className="column is-two-thirds-desktop is-offset-2-desktop">
                                <ImageGallery images={galleryImages} slider={true}/>
                            </div>
                        </div>
                        <div className="home-brands has-text-centered">
                            <h2 className="home-brands-title">Brands</h2>
                            <div className="columns">
                                <div className="column is-4 home-brand-item-container">
                                    <div className="home-brand-item">
                                        <Link to="/acdf">
                                            <img src="/images/logo.png" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="column is-4 home-brand-item-container">
                                    <div className="home-brand-item">
                                        Coming soon
                                    </div>
                                </div>
                                <div className="column is-4 home-brand-item-container">
                                    <div className="home-brand-item">
                                        Coming soon
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default HomePage;