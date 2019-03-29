import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import classNames from 'classnames';
import axios from 'axios';

// import imageDump from '../utils/image_dump';

import Navbar from '../components/Navbar';
import ImageGallery from '../components/ImageGallery';
import Footer from '../components/Footer';
class Gallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            fullResult: [],
            itemsPerPage: 12,
            pageNo: 1,
            hasMoreItems: true
        };
    }
    componentDidMount() {
        this.searchGallery();
    }

    searchGallery() {
        const term = this.searchInput.value;
        axios('/api/search/entries', {
            params: { term }
        }).then(res => {
            console.log(res.data);
            if (res.data.status === 'success') {
                this.setState({
                    fullResult: res.data.entries,
                    images: []
                });
                this.loadImages(1);
            }
        });
    }
    loadImages(pageNo = 1) {
        const startIndex = (pageNo - 1) * this.state.itemsPerPage;
        const endIndex = startIndex + this.state.itemsPerPage;
        const imageSet = this.state.fullResult.slice(startIndex, endIndex);
        console.log('full set:', this.state.fullResult, pageNo, startIndex);
        console.log('image set:', imageSet);
        if (imageSet.length) {
            this.setState({
                images: [...this.state.images, ...imageSet],
                pageNo,
                hasMoreItems: this.state.fullResult.length > endIndex
            });
        } else {
            this.setState({
                hasMoreItems: false
            });
        }
    }

    render() {

        // const galleryImages = imageDump;
        const galleryImages = this.state.images;

        return (
            <div className="gallery-wrapper gradient-wrapper">
                <Navbar/>
                <div className="container">
                    <div className="gallery-top is-block is-flex-desktop">
                        <div className="gallery-title has-text-centered">Explore, Like and Share</div>
                        <div className="gallery-search-wrapper has-text-centered">
                            <input ref={input => this.searchInput = input } className="gallery-search-input" type="search" placeholder="Search gallery..." onKeyPress={e => e.key === 'Enter' && this.searchGallery()}/>
                        </div>
                    </div>
                    <div className="gallery-actions has-text-centered">
                        <Link to="/create" className="button create-button">Join in. Create yours!</Link>
                    </div>
                    <div className="gallery-main-section section">
                        <div className="columns">
                            <div className="column is-two-thirds-desktop is-offset-2-desktop has-text-centered">
                                {
                                    galleryImages.length ?
                                        <div>
                                            <ImageGallery images={galleryImages} />
                                            {
                                                this.state.hasMoreItems ? 
                                                <button className="button is-primary is-inverted is-outlined is-medium" onClick={() => this.loadImages(this.state.pageNo + 1)}>Load more</button>
                                                : ''
                                            }
                                        </div>
                                        : 'No gallery images match your search.'
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Gallery;
