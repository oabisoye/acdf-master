import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router-dom';
import { Stage } from 'react-konva';
import classNames from 'classnames';
import {
    ShareButtons,
    generateShareIcon
} from 'react-share';
import ZoomSlider from 'react-rangeslider';

import getDialogTop from '../utils/get_dialog_top';

import CanvasItem from './CanvasItem';
import PreviewCanvas from './PreviewCanvas';

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            stageWidth: 800,
            stageHeight: 300,
            stageScale: 1,
            imageUrl: '/images/acdf-grey-holder.png',
            zoomDx: 0,
            zoomScale: 0.1,
            isBlackBg: true,
            isMultiple: false,
            multipleImageState: {
                a: {
                    key: 'a',
                    maskUrl: '/images/masks/a.svg',
                    imageUrl: '/images/acdf-grey-holder.png',
                    zoomDx: 5
                },
                c: {
                    key: 'c',
                    maskUrl: '/images/masks/c.svg',
                    imageUrl: '/images/acdf-grey-holder.png',
                    zoomDx: 5
                },
                d: {
                    key: 'd',
                    maskUrl: '/images/masks/d.svg',
                    imageUrl: '/images/acdf-grey-holder.png',
                    zoomDx: 5
                },
                f: {
                    key: 'f',
                    maskUrl: '/images/masks/f.svg',
                    imageUrl: '/images/acdf-grey-holder.png',
                    zoomDx: 5
                },
            },

            // Used by the image preview
            canvasImageUrl: '/images/acdf-grey-holder.png',
            showUserDetailsForm: false,
            showPreviewOverlay: false,
            showImagePreview: false,

            isLoadingResult: false,
            finalImage: null
        };

        this.state = {...this.defaultState};

        // this.fitStageIntoParentContainer();
        // adapt the stage on any window resize
        //window.addEventListener('resize', e => this.fitStageIntoParentContainer(e));
    }

    getWindowDimension() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    getPreviewDialogTop() {
        return this.state.showPreviewOverlay ? getDialogTop() : 0;
    }
    getAspectRatio() {
        return this.state.stageWidth / this.state.stageHeight;
    }
    getFitWidth() {
        return this.state.stageScale * this.state.stageWidth;
    }
    getFitHeight() {
        return this.state.stageScale * this.state.stageHeight;
    }

    /**
     * Sets the zoom level of the specified image or the single image if nothing is specified
     * @param {number} value the new zoom value
     * @param {string} imageKey specifies the image state to update
     */
    handleZoom(value, imageKey) {
        console.log(value, imageKey);

        if (imageKey) {
            let multipleImageState = {...this.state.multipleImageState};
            multipleImageState[imageKey].zoomDx = value;
            this.setState({
                multipleImageState
            });
        } else {
            this.setState({
                zoomDx: value
            })
        }

    }

    /**
     * Logic to resize the canvas responsively
     */
    fitStageIntoParentContainer() {

        // now we need to fit stage into parent
        const containerWidth = this.getWindowDimension().width;

        // to do this we need to scale the stage
        const scale = containerWidth / this.state.stageWidth;

        // console.log(this.refs.stageRef.getStage());
        const stage = this.refs.stageRef.getStage();
        stage.width(this.state.stageWidth * scale);
        stage.height(this.state.stageHeight * scale);
        stage.scale({ x: scale, y: scale });
        stage.draw();
    }

    componentDidMount() {
        // Get the width to fit the stage into
        // Calculate the scale based on the fitWidth and the specified stage width
        //Set the width and height based on the responsive width of the container
        // The first child should be the container
        const fitWidth = findDOMNode(this).children[0].clientWidth;
        const stageScale = fitWidth / this.state.stageWidth;

        // console.log(stageWidth);
        this.setState({
            stageScale
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.created && nextProps.created !== this.props.created) {
            this.setState({
                isLoadingResult: false
            });
        }
    }

    /**
     * Gets the uploaded image for the specified image else for the single image if no image key is specified
     * @param e
     * @param imageKey specifies which image state to update
     * @returns {boolean}
     */
    getImage(e, imageKey) {
        const imageFile = e.target.files[0];
        console.log(imageFile);

        if (!imageFile.type.match('image.*')) {
            // The file type is not supported
            return false;
        }

        console.log(imageKey);
        const imageReader = new FileReader();

        imageReader.onload = image => {
            console.log('Loaded image.', image);
            const receivedImageUrl = image.target.result;

            if (imageKey) {
                let multipleImageState = {...this.state.multipleImageState};
                multipleImageState[imageKey].imageUrl = receivedImageUrl;
                this.setState({
                    multipleImageState
                });
            } else {
                this.setState({
                    imageUrl: receivedImageUrl
                });
            }
        };

        imageReader.readAsDataURL(imageFile);
    }

    goBackToCanvas(e) {
        this.setState({
            showPreviewOverlay: false,
            showUserDetailsForm: false,
            showImagePreview: false
        });
    }

    showUserDetailsForm() {
        this.setState({
            showPreviewOverlay: true,
            showUserDetailsForm: true,
            showImagePreview: false
        });
    }

    shareImage(e) {
        const finalImage = this.previewCanvas.getFinalImage();
        this.setState({
            finalImage
        });

        const imageData = {
            image: finalImage,
            userName: this.state.userName,
            userScreenName: this.state.userScreenName,
            userProfession: this.state.userProfession,
            userEmail: this.state.userEmail
        };

        this.setState({
            isLoadingResult: true
        });
        this.props.onShare(imageData);
    }

    saveAndPreview(e) {
        e.preventDefault();

        let stage = this.refs.stageSingleRef.getStage();
        if (this.state.isMultiple) {
            stage = this.refs.stageMultipleRef.getStage();
        }

        stage.scale({
            x: 1,
            y: 1
        });
        stage.width(this.state.stageWidth);
        stage.height(this.state.stageHeight);
        // Get the dataURL from the canvas item after scaling the stage
        const canvasImageUrl = stage.draw().toDataURL(); // this.refs.canvasItem.getDataURL();
        // console.log(canvasImageUrl);
        this.setState({
            userName: this.userNameInput.value,
            userScreenName: this.userScreenNameInput.value,
            userProfession: this.userProfessionInput.value,
            userEmail: this.userEmailInput.value,

            canvasImageUrl: canvasImageUrl,
            showPreviewOverlay: true,
            showUserDetailsForm: false,
            showImagePreview: true
        });
    }

    resetCollage() {
        this.props.onReset && this.props.onReset();
        this.setState({...this.defaultState});
    }

    renderBrands() {
        return (
            <div className="creator-preview-brands">
                <div className="creator-preview-brand-item">
                    <img src="/images/brands/ifi.png" alt="ifi"/>
                </div>
                <div className="creator-preview-brand-item">
                    <img src="/images/brands/idan.png" alt="idan"/>
                </div>
                <div className="creator-preview-brand-item">
                    <img src="/images/brands/diamond.png" alt="diamond"/>
                </div>
                <div className="creator-preview-brand-item">
                    <img src="/images/brands/intel.png" alt="intel"/>
                </div>
                <div className="creator-preview-brand-item">
                    <img src="/images/brands/ibm.png" alt="ibm"/>
                </div>
                <div className="creator-preview-brand-item">
                    <img src="/images/brands/samsung.png" alt="samsung"/>
                </div>
                <div className="creator-preview-brand-item">
                    <img src="/images/brands/insecta.png" alt="insecta"/>
                </div>
                <div className="creator-preview-brand-item">
                    <img src="/images/brands/microsoft.png" alt="microsoft"/>
                </div>
                <div className="creator-preview-brand-item">
                    <img src="/images/brands/xkojimedia.png" alt="xkojimedia"/>
                </div>
            </div>
        );
    }

    renderSingleStage() {
        const {
            stageScale,
            stageWidth,
            stageHeight,
            imageUrl,
            zoomDx,
            zoomScale
        } = this.state;
        return (
            <Stage ref='stageSingleRef' width={this.getFitWidth()} height={this.getFitHeight()} scaleX={stageScale} scaleY={stageScale}>
                <CanvasItem
                    ref='canvasItem'
                    width={stageWidth} height={stageHeight}
                    mask={'/images/masks/acdf.svg'}
                    maskScale={.75}
                    image={imageUrl}
                    imageScale={1 + (zoomScale * zoomDx)}
                />
            </Stage>
        );
    }

    renderMultipleStage() {
        const {
            stageScale,
            stageWidth,
            stageHeight,
            zoomScale,

            multipleImageState
        } = this.state;

        const { a, c, d, f } = multipleImageState;

        // Random calculated values based on approximate positions with the single stage
        const aWidth = stageWidth / 3;
        const cWidth = stageWidth / 3.7;
        const dWidth = stageWidth / 3.5;
        const fWidth = stageWidth / 3.5;

        const aX = stageWidth / 20;
        const cX = stageWidth / 3.4;
        const dX = stageWidth / 2;
        const fX = stageWidth / 1.45;

        return (
            <Stage ref='stageMultipleRef' width={this.getFitWidth()} height={this.getFitHeight()} scaleX={stageScale} scaleY={stageScale}>
                <CanvasItem
                    ref='canvasItem'
                    x={aX}
                    width={aWidth} height={stageHeight}
                    mask={a.maskUrl}
                    maskScale={.75}
                    image={a.imageUrl}
                    imageScale={1 + (zoomScale * a.zoomDx)}
                />
                <CanvasItem
                    ref='canvasItem'
                    x={cX}
                    width={cWidth} height={stageHeight}
                    mask={c.maskUrl}
                    maskScale={.75}
                    image={c.imageUrl}
                    imageScale={1 + (zoomScale * c.zoomDx)}
                />
                <CanvasItem
                    ref='canvasItem'
                    x={dX}
                    width={dWidth} height={stageHeight}
                    mask={d.maskUrl}
                    maskScale={.75}
                    image={d.imageUrl}
                    imageScale={1 + (zoomScale * d.zoomDx)}
                />
                <CanvasItem
                    ref='canvasItem'
                    x={fX}
                    width={fWidth} height={stageHeight}
                    mask={f.maskUrl}
                    maskScale={.75}
                    image={f.imageUrl}
                    imageScale={1 + (zoomScale * f.zoomDx)}
                />
            </Stage>
        );
    }

    renderActions(item) {

        return (
            <div>
                <div className="has-text-centered">
                    <img className="creator-actions-mask-icon" src={item.maskUrl} alt={item.key}/>
                </div>
                <div className="canvas-zoom-slider-wrapper">
                    <img className="canvas-zoom-out-icon" src="/images/icons/image-icon.png" alt="zoom out"/>
                    <ZoomSlider
                        min={0}
                        max={10}
                        tooltip={false}
                        step={0.1}
                        value={item.zoomDx}
                        onChange={val => this.handleZoom(val, item.key)}
                    />
                    <img className="canvas-zoom-in-icon" src="/images/icons/image-icon.png" alt="zoom in"/>
                </div>
                <div className="canvas-file-btn-wrapper has-text-centered">
                    <input className="canvas-file-input" id={`canvas_single_file_${item.key}`} type="file" accept="image/*" onChange={e => this.getImage(e, item.key)}/>
                    <label htmlFor={`canvas_single_file_${item.key}`} className="canvas-file-btn">Upload image</label>
                </div>
            </div>
        );
    }

    render() {
        const {
            showImagePreview,
            showPreviewOverlay,
            showUserDetailsForm,
            zoomDx,

            isBlackBg,
            isMultiple,
            multipleImageState
        } = this.state;

        const {
            FacebookShareButton,
            GooglePlusShareButton,
            TwitterShareButton,
            LinkedinShareButton,
            WhatsappShareButton,
            EmailShareButton,
        } = ShareButtons;

        const FacebookIcon = generateShareIcon('facebook');
        const TwitterIcon = generateShareIcon('twitter');
        const GooglePlusIcon = generateShareIcon('google');
        const LinkedInIcon = generateShareIcon('linkedin');
        const WhatsappIcon = generateShareIcon('whatsapp');
        const EmailIcon = generateShareIcon('email');

        let shareData = {
            url: 'http://www.google.com',
            size: 50,
            iconBgStyle: {
                fill: 'transparent'
            }
        };

        if (this.props.created) {
            shareData.url = `${window.location.origin}/gallery/${this.props.created._id}`;
        }

        console.log('rendered');
        return (
            <div className="canvas-outer-wrapper">
                <div className="container">
                    <div className="creator-top-actions">
                        <div className="columns">
                            <div className="column">
                                <div className="creator-action-group has-text-centered has-text-left-desktop">
                                    <button className={classNames({
                                        'creator-action-button': true,
                                        'active': !isMultiple
                                    })} onClick={e => this.setState({ isMultiple: false})}>Single image</button>
                                    <button className={classNames({
                                        'creator-action-button': true,
                                        'active': isMultiple
                                    })} onClick={e => this.setState({ isMultiple: true})}>Multiple image</button>
                                </div>
                            </div>
                            <div className="column is-flex is-multiline">
                                <div className="creator-pan-tip">
                                    <img src="/images/icons/move-icon.png" alt="move"/>
                                    <span>Hold and drag the uploaded image to pan around</span>
                                </div>
                            </div>
                            <div className="column">
                                <div className="creator-action-group has-text-centered has-text-right-desktop">
                                    <button className={classNames({
                                        'creator-action-button': true,
                                        'active': isBlackBg
                                    })} onClick={e => this.setState({ isBlackBg: true})}>Black background</button>
                                    <button className={classNames({
                                        'creator-action-button': true,
                                        'active': !isBlackBg
                                    })} onClick={e => this.setState({ isBlackBg: false})}>White background</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div ref="canvasWrapper" className={classNames({
                        'canvas-wrapper': true,
                        'black-canvas': isBlackBg
                    })}>
                        <div className={classNames({'is-hidden': isMultiple})}>
                            { this.renderSingleStage() }
                        </div>
                        <div className={classNames({'is-hidden': !isMultiple})}>
                            { this.renderMultipleStage() }
                        </div>
                    </div>
                    <div className="creator-bottom-actions">
                        <div className={classNames({
                            'columns': true,
                            'is-hidden': !isMultiple
                        })}>
                            <div className="column">
                                {this.renderActions(multipleImageState.a)}
                            </div>
                            <div className="column">
                                {this.renderActions(multipleImageState.c)}
                            </div>
                            <div className="column">
                                {this.renderActions(multipleImageState.d)}
                            </div>
                            <div className="column">
                                {this.renderActions(multipleImageState.f)}
                            </div>
                        </div>
                        <div className="columns is-centered">
                            <div className={classNames({
                                'column is-half': true,
                                'is-hidden': isMultiple
                            })}>
                                <div className="canvas-zoom-slider-wrapper">
                                    <img className="canvas-zoom-out-icon" src="/images/icons/image-icon.png" alt="zoom out"/>
                                    <ZoomSlider
                                        min={0}
                                        max={10}
                                        tooltip={false}
                                        step={0.1}
                                        value={zoomDx}
                                        onChange={val => this.handleZoom(val)}
                                    />
                                    <img className="canvas-zoom-in-icon" src="/images/icons/image-icon.png" alt="zoom in"/>
                                </div>
                                <div className="canvas-file-btn-wrapper has-text-centered">
                                    <input className="canvas-file-input" id="canvas_single_file" type="file" accept="image/*" onChange={e => this.getImage(e)}/>
                                    <label htmlFor="canvas_single_file" className="canvas-file-btn">Upload image</label>
                                </div>
                            </div>
                        </div>
                        <div className='columns is-centered'>
                            <div className="column is-half">
                                <div className="creator-save-btn-wrapper has-text-centered">
                                    <button className="creator-save-btn" onClick={e => this.showUserDetailsForm(e)}>Save and Preview</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classNames({
                    'creator-preview-wrapper show-ease': true,
                    'hide-ease': !showPreviewOverlay
                })}>
                    <div className="creator-preview-overlay"/>
                    <div className={classNames({
                        'creator-preview-form-wrapper show-ease': true,
                        'hide-ease': !showUserDetailsForm
                    })} style={{ top: this.getPreviewDialogTop() }}>
                        <div className="creator-preview-form-inner-wrapper">
                            <div className="creator-preview-form-close" onClick={e => this.goBackToCanvas(e)}>&times;</div>
                            <div className="creator-preview-form-title">
                                Let's help you personalise your collage.
                            </div>
                            <form action="./preview" onSubmit={e => this.saveAndPreview(e)}>
                                <div className="field">
                                    <div className="control">
                                        <input ref={input => this.userNameInput = input} type="text" className="input creator-preview-form-input" placeholder="What's your name?" required='required'/>
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control">
                                        <input ref={input => this.userScreenNameInput = input} type="text" className="input creator-preview-form-input" placeholder="What’s your screen name?" required='required'/>
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control">
                                        <input ref={input => this.userProfessionInput = input} type="text" className="input creator-preview-form-input" placeholder="What do you do?" required='required'/>
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control">
                                        <input ref={input => this.userEmailInput = input} type="email" className="input creator-preview-form-input" placeholder="What’s your email address?" required='required'/>
                                    </div>
                                </div>
                                <div className="field">
                                    <button className="button is-medium creator-preview-form-button">Continue</button>
                                </div>
                            </form>
                        </div>
                        {this.renderBrands()}
                    </div>
                    <div className={classNames({
                        'creator-preview-inner-wrapper': true,
                        'is-hidden': !showImagePreview
                    })} style={{ top: this.getPreviewDialogTop() }}>
                        <div className="creator-preview-inner-inner">
                            <div className="creator-preview-title">Preview</div>
                            <div className="creator-preview-actions">
                                <button className="creator-preview-action-button" onClick={e => this.goBackToCanvas(e)}>Go Back</button>
                                <button className="creator-preview-action-button share-btn" onClick={e => this.shareImage(e)}>Share!</button>
                            </div>
                            <div className="creator-preview-image-container">
                                <div className={classNames({
                                    'app-loader show-ease': true,
                                    'hide-ease': !this.state.isLoadingResult
                                })}/>
                                <PreviewCanvas
                                    ref={canvas => this.previewCanvas = canvas}
                                    imageSrc={this.state.canvasImageUrl}
                                    canvasAspectRatio={this.getAspectRatio()}
                                    black={this.state.isBlackBg}
                                    userName={this.state.userName}
                                    screenName={this.state.userScreenName}
                                    profession={this.state.userProfession}
                                />
                            </div>
                        </div>
                        {this.renderBrands()}
                    </div>
                    <div className={classNames({
                        'creator-preview-saved-wrapper show-ease': true,
                        'hide-ease': !this.props.created
                    })}>
                        <div className="creator-preview-saved-inner">
                            <div className="creator-preview-saved-title">
                                Your collage looks awesome!<br/> Now share
                                with your friends.
                            </div>
                            <div className="creator-preview-saved-share-wrapper">
                                <FacebookShareButton url={shareData.url}>
                                    <FacebookIcon size={shareData.size} iconBgStyle={shareData.iconBgStyle} />
                                </FacebookShareButton>
                                <TwitterShareButton url={shareData.url}>
                                    <TwitterIcon size={shareData.size} iconBgStyle={shareData.iconBgStyle} />
                                </TwitterShareButton>
                                <GooglePlusShareButton url={shareData.url}>
                                    <GooglePlusIcon size={shareData.size} iconBgStyle={shareData.iconBgStyle} />
                                </GooglePlusShareButton>
                                <LinkedinShareButton url={shareData.url}>
                                    <LinkedInIcon size={shareData.size} iconBgStyle={shareData.iconBgStyle} />
                                </LinkedinShareButton>
                                <WhatsappShareButton url={shareData.url}>
                                    <WhatsappIcon size={shareData.size} iconBgStyle={shareData.iconBgStyle} />
                                </WhatsappShareButton>
                                <EmailShareButton url={shareData.url} subject={shareData.subject} body={shareData.body}>
                                    <EmailIcon size={shareData.size} iconBgStyle={shareData.iconBgStyle} />
                                </EmailShareButton>
                                <a className="creator-preview-saved-share-icon" download='acdf-collage.jpg' href={this.state.finalImage}>
                                    <img src="/images/icons/download-icon.png" alt="download"/>
                                </a>
                            </div>
                            <div className="creator-preview-saved-actions">
                                <div className="columns">
                                    <div className="column">
                                        <a className="create-another-button" onClick={e => this.resetCollage()}>Create another collage</a>
                                    </div>
                                    <div className="column">
                                        <Link to="/gallery" className="explore-button">Explore the gallery</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Canvas;
