import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import classNames from 'classnames';
import axios from 'axios';

// import imageDump from '../utils/image_dump';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageGallery from '../components/ImageGallery';

class BrandPage extends Component {
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
                                <h1 className="title is-spaced">
                                    THIS IS AFRICA
                                </h1>
                                <h2 className="subtitle">
                                    Africa's Biggest Culture and Design Festival for Creatives
                                </h2>
                                <h2 className="sub-subtitle">
                                    Create and share your own ACDF collage.
                                </h2>
                                <Link to="/create" className="button create-button">Join in. Create yours!</Link>
                            </div>
                        </div>
                    </section>
                    <div className="home-main-section section">
                        <div className="columns">
                            <div className="column is-two-thirds-desktop is-offset-2-desktop">
                                <ImageGallery images={galleryImages} slider={true}/>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default BrandPage;