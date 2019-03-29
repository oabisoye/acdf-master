import React, { Component } from 'react';
import axios from 'axios';
// import classNames from 'classnames';

import Navbar from '../components/Navbar';
import Canvas from '../components/Canvas';
import Footer from '../components/Footer';

class Create extends Component{
    constructor(props) {
        super(props);

        this.defaultState = {
            isBlackBg: true,
            isSingleImage: true,
            createdData: null
        };

        this.state = {...this.defaultState};
    }
    shareImage(data) {
        console.log('data to be stored.', data);
        axios.post('/api/save', data).then(res => {
            console.log(res.data);
            if (res.data.status === 'success') {
                this.setState({
                    createdData: res.data.entry
                });
            }
        });
    }
    resetCanvas() {
        this.setState({...this.defaultState});
    }
    render() {
        return (
            <div className="create-wrapper">
                <Navbar/>
                <h1 className="create-page-title">
                    Create a unique collage with your works!
                </h1>
                <div className="creator-wrapper">
                    <Canvas
                        black={this.state.isBlackBg}
                        onShare={data => this.shareImage(data)}
                        created={this.state.createdData}
                        onReset={() => this.resetCanvas()}
                    />
                </div>
                <div className="create-page-tip-overlay is-hidden">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam amet architecto corporis cumque doloribus excepturi itaque maiores officia, porro quam quasi qui quia quos. Laudantium magni obcaecati quod repellendus velit.
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Create;