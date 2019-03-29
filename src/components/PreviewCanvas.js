import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import {Layer, Rect, Stage, Image, Text} from 'react-konva';
// import classNames from 'classnames';

class PreviewCanvas extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            maskScale: 1,
            imageScale: 1,
            stageScale: 1,
            stageWidth: 800,
            stageHeight: 618,
            previewAspectRatio: 1.5,

            image: null,
            textImage: null,
            saveTheDateImage: null,
            collageLogo: null,

            collageLogoWidth: 100,
            collageLogoHeight: 50,

            screenNameBoxHeight: 40,
            screenNameFontSize: 16,
            screenNameTop: 30,

            authorNameFontSize: 12,
        };

        this.setImages(this.props);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.imageSrc !== nextProps.imageSrc) {
            // Update image
            this.setImages(nextProps);
            this.setStageDimensions();
        }
    }

    setImages(props) {
        const image = new window.Image();
        // image.src = '/images/xk.svg';
        this.imagePromise = new Promise(resolve => {
            image.onload = () => {
                this.setState({
                    image
                });
                resolve();
            }
        });
        image.src = props.imageSrc || '/images/oi.jpg';

        const saveTheDateImage = new window.Image();
        this.saveTheDateImagePromise = new Promise(resolve => {
            saveTheDateImage.onload = () => {
                this.setState({
                    saveTheDateImage
                });
                resolve();
            }
        });
        saveTheDateImage.src = props.saveTheDateImageSrc || '/images/acdf-std.png';

        const textImage = new window.Image();
        this.textImagePromise = new Promise(resolve => {
            textImage.onload = () => {
                this.setState({
                    textImage
                });
                resolve();
            }
        });
        textImage.src = props.textImageSrc || '/images/acdf-text.png';

        const collageLogo = new window.Image();
        this.collageLogoPromise = new Promise(resolve => {
            collageLogo.onload = () => {
                this.setState({
                    collageLogo
                });
                resolve();
            }
        });
        collageLogo.src = props.collageLogoSrc || '/images/collage_insecta.png';

        // Wait for the mask image and the background image to be loaded
        Promise.all([this.imagePromise, this.saveTheDateImagePromise, this.textImagePromise, this.collageLogoPromise]).then(() => {
            console.log('Preview ready.');
            this.setState({
                isReady: true
            });
        });
    }
    setStageDimensions() {

        // Get the width to fit the stage into
        // Calculate the scale based on the fitWidth and the specified stage width
        //Set the width and height based on the responsive width of the container
        const fitWidth = findDOMNode(this).parentNode.clientWidth;
        const stageScale = fitWidth / this.state.stageWidth;
        this.setState({
            stageScale
        });
    }
    getFitWidth() {
        return this.state.stageScale * this.state.stageWidth;
    }
    getFitHeight() {
        return this.state.stageScale * this.state.stageHeight;
    }
    getCanvasImageHeight() {
        return this.state.stageWidth / this.props.canvasAspectRatio;
    }
    getBgColor() {
        return (this.props.black) ? '#000000' : '#ffffff';
    }
    getScreenNameText() {
        return this.props.screenName + ' will be at';
    }
    getScreenNameWidth() {
        return (this.getScreenNameText().length * this.state.screenNameFontSize * .5) + 50;
    }
    getAuthorText() {
        return `by ${this.props.userName} (${this.props.profession})`;
    }
    getAuthorFill() {
        return '#606062';
        // return (this.props.black) ? '#ffffff': '#000000';
    }
    getAuthorWidth() {
        return (this.getAuthorText().length * this.state.authorNameFontSize) + 50;
    }
    getTextImageHeight() {
        const { textImage, stageWidth } = this.state;
        if (textImage) {
            return textImage.height / textImage.width * stageWidth;
        }

        return 100;
    }
    getSaveTheDateHeight() {
        const { saveTheDateImage, stageWidth } = this.state;
        if (saveTheDateImage) {
            return saveTheDateImage.height / saveTheDateImage.width * stageWidth;
        }

        return 100;
    }
    getFinalImage() {

        const stage = this.refs.previewStage.getStage();
        stage.scale({
            x: 1,
            y: 1
        });
        stage.width(this.state.stageWidth);
        stage.height(this.state.stageHeight);
        // Get the dataURL from the preview layer after scaling the stage
        // Get the image as a JPEG
        const previewImageUrl =  this.refs.previewLayer.toDataURL('image/jpeg');
        // Scale it back down
        stage.scale({
            x: this.state.stageScale,
            y: this.state.stageScale
        });
        console.log(previewImageUrl);
        return previewImageUrl;
    }

    render() {
        const {
            stageScale,
            stageWidth,
            stageHeight,
            image,
            screenNameBoxHeight,
            screenNameFontSize,
            screenNameTop,
            authorNameFontSize,

            collageLogo,
            collageLogoWidth,
            collageLogoHeight,

            textImage,
            saveTheDateImage
        } = this.state;
        return (
            <div ref='previewWrapper' className="preview-canvas-wrapper">
                <Stage ref='previewStage' width={this.getFitWidth()} height={this.getFitHeight()} scaleX={stageScale} scaleY={stageScale}>
                    <Layer ref='previewLayer'>
                        {/*bg*/}
                        <Rect
                            fill={this.getBgColor()}
                            width={stageWidth} height={stageHeight}
                        />

                        {/*canvas image*/}
                        <Image
                            y={50}
                            width={stageWidth}
                            height={this.getCanvasImageHeight()}
                            image={image}
                        />

                        {/* logo watermark */}
                        <Image
                            x={stageWidth - collageLogoWidth - 20}
                            y={20}
                            width={collageLogoWidth}
                            height={collageLogoHeight}
                            opacity={.4}
                            image={collageLogo}
                        />

                        {/*screen name bg + text*/}
                        {/*<Rect*/}
                            {/*y={screenNameTop}*/}
                            {/*fillLinearGradientStartPoint={{ x : 0, y : 0}}*/}
                            {/*fillLinearGradientEndPoint={{ x : 100, y : 100}}*/}
                            {/*fillLinearGradientColorStops={[0, '#C3C3C3', 1, '#C3C3C3']}*/}
                            {/*width={this.getScreenNameWidth()}*/}
                            {/*height={screenNameBoxHeight}*/}
                        {/*/>*/}
                        <Text
                            height={screenNameBoxHeight}
                            x={20}
                            y={screenNameTop + (screenNameBoxHeight - screenNameFontSize) / 2}
                            text={this.getScreenNameText()}
                            fontSize={screenNameFontSize}
                            fontStyle='italic'
                            fontFamily='Ubuntu, Arial'
                            fill='#606062'
                            textBaseline='middle'
                            align='left'
                        />

                        {/*text image*/}
                        <Image
                            y={this.getCanvasImageHeight()}
                            width={stageWidth}
                            height={this.getTextImageHeight()}
                            image={textImage}
                        />

                        {/*author name + profession*/}
                        <Text
                            width={this.getAuthorWidth()}
                            height={40}
                            x={stageWidth - this.getAuthorWidth() - 50}
                            y={(this.getCanvasImageHeight() + this.getTextImageHeight()) + 15}
                            text={this.getAuthorText()}
                            fontSize={authorNameFontSize}
                            fontFamily='Ubuntu, Arial'
                            fill={this.getAuthorFill()}
                            textBaseline='middle'
                            align='right'
                        />

                        {/*save the date banner*/}
                        <Image
                            y={this.getCanvasImageHeight() + this.getTextImageHeight() + 50}
                            width={stageWidth}
                            height={this.getSaveTheDateHeight()}
                            image={saveTheDateImage}
                        />
                    </Layer>
                </Stage>
            </div>
        );
    }
}

export default PreviewCanvas;
