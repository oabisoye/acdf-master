import React, { Component } from 'react';
import {Layer, Shape} from 'react-konva';

class CanvasItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageScale: 1,
            stageWidth: this.props.width || this.getWindowDimension().width,
            stageHeight: this.props.height || this.getWindowDimension().height,
            showResult: false,
            maskX: 0,
            maskY: 0,
            layerX: this.props.x || 0,
            layerY: this.props.y || 0,
        };

        this.setImages(this.props);
    }

    setImages(props) {
        const maskImage = new window.Image();
        this.maskImagePromise = new Promise(resolve => {
            maskImage.onload = () => {
                this.setState({
                    maskImage
                });
                resolve();
            };
        });
        maskImage.src = props.mask || '/images/xk.svg';

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
        image.src = props.image || '/images/acdf-grey-holder.png';
        // console.log('image src', this.props.image);

        // Wait for the mask image and the background image to be loaded
        Promise.all([this.maskImagePromise, this.imagePromise]).then(() => {
            console.log('We are ready.');
            this.setState({
                isReady: true,
                maskX: this.getMaskX(),
                maskY: this.getMaskY(),
                imageX: this.getMaskX(),
                imageY: this.getMaskY()
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        let newState = {
            ...this.state,
            stageWidth: nextProps.width || this.state.stageWidth,
            stageHeight: nextProps.height || this.state.stageHeight
        };
        if (this.props.image !== nextProps.image) {
            // Update image
            this.setImages(nextProps);
        }

        this.setState({
            ...newState,
            maskX: this.getMaskX(newState),
            maskY: this.getMaskY(newState)
        });

        //this.setState({
        //    imageX: this.getImageX(),
        //    imageY: this.getImageY()
        //});
    }

    getWindowDimension() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    /**
     * Get the mask width
     */
    getMaskWidth() {
        return this.state.maskImage.width * this.props.maskScale;
    }

    /**
     * Get the mask height
     */
    getMaskHeight() {
        return this.state.maskImage.height * this.props.maskScale;
    }

    /**
     * Get the mask x position after centering the mask
     */
    getMaskX(state) {
        const _state = state || this.state;

        console.log(_state.stageWidth);
        if (_state.maskImage) {
            return (_state.stageWidth / 2) - ((this.getMaskWidth()) / 2);
        }
        return 0;
    }

    /**
     * Get the mask y position after centering the mask
     */
    getMaskY(state) {
        const _state = state || this.state;

        if (_state.maskImage) {
            return (_state.stageHeight / 2) - ((this.getMaskHeight()) / 2);
        }
        return 0;
    }

    /**
     * The x position of the mask when updating the position of the shape
     */
    getMaskDiffX() {
        return -this.refs.cShape.x() + this.state.maskX;
    }

    /**
     * The y position of the mask when updating the position of the shape
     */
    getMaskDiffY() {
        return -this.refs.cShape.y() + this.state.maskY;
    }

    /**
     * Get the x position of the image
     */
    getImageX() {
        if (this.state.imageX == null) {
            return this.state.maskX;
        }
        return this.state.imageX;
    }

    /**
     * Get the y position of the image
     */
    getImageY() {
        if(this.state.imageY == null) {
            return this.state.maskY;
        }
        return this.state.imageY;
    }

    /**
     * Get the original image width relative to the mask's size.
     * The original image width is set to fit the width of the mask
     * @returns {*}
     */
    getImageWidth() {
        return this.getMaskWidth() * this.props.imageScale;
    }

    /**
     * Get the original image height relative to the mask's size.
     * The original image height is set based on the original image width,
     * maintains the aspect ratio of the image.
     * @returns {*}
     */
    getImageHeight() {
        if (this.state.image) {
            return (this.state.image.height / this.state.image.width) * this.getMaskWidth() * this.props.imageScale;
        }
        return this.getMaskHeight() * this.props.imageScale;
    }

    /**
     * Get the x position of the clipped image.
     * The clipped image is positioned relative to the mask
     */
    getClippedImageX() {
        return this.getImageX() - this.state.maskX;
    }

    /**
     * Get the y position of the clipped image.
     * The clipped image is positioned relative to the mask
     */
    getClippedImageY() {
        return this.getImageY() - this.state.maskY;
    }

    customShapeSceneFunc(ctx){
        // This is called everytime anything is moved

        // Draw the image mask, specify width and height
        ctx.drawImage(this.state.maskImage, this.getMaskDiffX(), this.getMaskDiffY(), this.getMaskWidth(), this.getMaskHeight());

        // Set the global composite operation for clipping
        ctx.globalCompositeOperation = 'source-in';

        // Draw the image inside
        ctx.drawImage(this.state.image, this.getClippedImageX(), this.getClippedImageY(), this.getImageWidth(), this.getImageHeight());

        ctx.fillStrokeShape(this.refs.cShape);
    }

    customShapeHitFunc(ctx){
        // Draw a rectangle around the mask image; the same pos and dimensions as the mask image
        ctx.rect(this.getMaskDiffX(), this.getMaskDiffY(), this.getMaskWidth(), this.getMaskHeight());

        // Fill out the hit region
        ctx.fillStrokeShape(this.refs.cShape);
        console.log('hit', this.getMaskDiffX(), this.getMaskDiffY(), this.getMaskWidth(), this.getMaskHeight());
    }

    moveImage(e) {
        this.setState({
            imageX: e.target.attrs.x,
            imageY: e.target.attrs.y
        });
        console.log(this.state.imageX, this.state.imageY, e.target.attrs);
    }

    moveShape(e) {
        this.setState({
            imageX: e.target.attrs.x,
            imageY: e.target.attrs.y
        });
        console.log(this.state.imageX, this.state.imageY);
    }

    getDataURL() {
        return this.refs.layerRef.toDataURL();
    }

    render() {

        console.log(this.state.showResult);
        return (
            <Layer ref="layerRef" x={this.state.layerX} y={this.state.layerY}>
                {this.state.isReady ?
                <Shape
                    ref='cShape'
                    x={this.state.imageX}
                    y={this.state.imageY}
                    sceneFunc={this.customShapeSceneFunc.bind(this)}
                    hitFunc={this.customShapeHitFunc.bind(this)}
                    draggable={true}
                    listening={true}
                    onDragMove={e => this.moveShape(e)}
                /> : null}
            </Layer>
        );
    }
}

CanvasItem.defaultProps = {
    maskScale: 1,
    imageScale: 1
};

export default CanvasItem;
