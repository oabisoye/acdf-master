import React, { Component } from 'react';
import classNames from 'classnames';
import axios from 'axios';

import ReactImageGallery from 'react-image-gallery';
import GallerySlider from 'react-slick';
import {
    ShareButtons,
    generateShareIcon
} from 'react-share';

import formatDate from '../utils/format_date';
import getDialogTop from '../utils/get_dialog_top';

import ShowcaseItem from '../components/ShowcaseItem';

class ImageGallery extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isGalleryOpen: false,
            curGalleryIndex: 0,
            galleryTop: 0,
            images: this.props.images
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            images: nextProps.images
        });
    }

    getGalleryTop(isOpen) {
        return isOpen || this.state.isGalleryOpen ? getDialogTop() - 50 : 0;
    }

    renderGalleryLightboxItem(item) {

        const media_url = process.env.REACT_APP_IMAGE_BUCKET_URL;
        const {
            FacebookShareButton,
            GooglePlusShareButton,
            LinkedinShareButton,
            TwitterShareButton,
            TelegramShareButton,
            WhatsappShareButton,
            PinterestShareButton,
            EmailShareButton,
        } = ShareButtons;

        const FacebookIcon = generateShareIcon('facebook');
        const TwitterIcon = generateShareIcon('twitter');
        const GooglePlusIcon = generateShareIcon('google');
        const LinkedInIcon = generateShareIcon('linkedin');
        const TelegramIcon = generateShareIcon('telegram');
        const WhatsappIcon = generateShareIcon('whatsapp');
        const PinterestIcon = generateShareIcon('pinterest');
        const EmailIcon = generateShareIcon('email');

        let shareData = {
            url: `${window.location.origin}/gallery/${item._id}`,
            media: `${media_url}${item.image_link}`,
            subject: 'ACDF Collage',
            size: 32,
            iconBgStyle: {
                fill: 'transparent'
            }
        };
        shareData.body = `Here's the ACDF collage: ${shareData.url}`;

        return (
            <div className="showcase-gallery-item">
                <div className="showcase-gallery-item-top">
                    <div className="showcase-gallery-item-author">{item.user_name}</div>
                    <div className="showcase-gallery-item-date">{formatDate(new Date(item.created_at))}</div>
                </div>
                <div className="showcase-gallery-item-inner">
                    <div className='image-gallery-image'>
                        <img
                            src={`${media_url}${item.image_link}`}
                            alt={item.originalAlt}
                            srcSet={item.srcSet}
                            sizes={item.sizes}
                            title={item.originalTitle}
                        />
                        <div className="showcase-gallery-actions">
                            <div className="showcase-gallery-actions-left">
                                <div className="showcase-gallery-views">
                                    <img src="/images/icons/eye-icon.png" alt="views"/>
                                    <span>{item.views.length}</span>
                                </div>
                                <div className={classNames({
                                    'showcase-gallery-likes': true,
                                    'is-liked': item.hasLiked
                                })} onClick={e => this.likeGalleryImage(item._id, item.hasLiked)}>
                                    <img src={`/images/icons/${item.hasLiked ? 'heart-active-icon.png': 'heart-icon.png'}`} alt="likes"/>
                                    <span>{item.likes.length}</span>
                                </div>
                            </div>
                            <div className="showcase-gallery-actions-right">
                                <div className="showcase-gallery-share">
                                    <FacebookShareButton url={`${window.location.origin}/gallery/${item._id}`}>
                                        Share
                                    </FacebookShareButton>
                                    <div className="showcase-gallery-share-box">
                                        <FacebookShareButton url={shareData.url}>
                                            <FacebookIcon size={shareData.size} />
                                        </FacebookShareButton>
                                        <TwitterShareButton url={shareData.url}>
                                            <TwitterIcon size={shareData.size} />
                                        </TwitterShareButton>
                                        <GooglePlusShareButton url={shareData.url}>
                                            <GooglePlusIcon size={shareData.size} />
                                        </GooglePlusShareButton>
                                        <LinkedinShareButton url={shareData.url}>
                                            <LinkedInIcon size={shareData.size} />
                                        </LinkedinShareButton>
                                        <TelegramShareButton url={shareData.url}>
                                            <TelegramIcon size={shareData.size} />
                                        </TelegramShareButton>
                                        <WhatsappShareButton url={shareData.url}>
                                            <WhatsappIcon size={shareData.size} />
                                        </WhatsappShareButton>
                                        <PinterestShareButton url={shareData.url} media={shareData.media}>
                                            <PinterestIcon size={shareData.size} />
                                        </PinterestShareButton>
                                        <EmailShareButton url={shareData.url} subject={shareData.subject} body={shareData.body}>
                                            <EmailIcon size={shareData.size} />
                                        </EmailShareButton>
                                    </div>
                                </div>
                                <a href={shareData.media} download='acdf-collage.jpg' className="showcase-gallery-download">Download</a>
                            </div>
                        </div>
                        {
                            item.description &&
                            <span className='image-gallery-description'>
                          {item.description}
                        </span>
                        }
                    </div>
                </div>
            </div>
        );
    }

    goToGalleryImage(index, entryId) {
        this.recordGalleryImageView(entryId);
        this.setState({
            isGalleryOpen: true,
            curGalleryIndex: index,
            galleryTop: this.getGalleryTop(true)
        });
        this.imageGallery.slideToIndex(index);
    }

    recordGalleryImageView(entryId) {
        axios.post('/api/view', {
            entryId
        }).then(res => {
            console.log(res.data);
        });
    }

    likeGalleryImage(entryId, hasLiked) {
        if (!hasLiked) {
            axios.post('/api/like', {
                entryId
            }).then(res => {
                console.log(res.data);
            });
        } else {
            axios.post('/api/unlike', {
                entryId
            }).then(res => {
                console.log(res.data);
            });
        }
        this.setState({
            images: this.state.images.map(image => {
                if (image._id === entryId) {
                    image.hasLiked = !hasLiked;
                    if (hasLiked) image.likes.pop();
                    else image.likes.push({ _id: 0, _entry: entryId })
                }
                return image;
            })
        });
    }

    onSlideGallery(index) {
        const curImageData = this.state.images[index];

        this.recordGalleryImageView(curImageData._id);
    }

    renderGalleryImage(image, idx) {
        return (
            <div key={image._id} className="column is-4">
                <ShowcaseItem
                    data={image}
                    onClick={e => this.goToGalleryImage(idx, image._id)}
                />
            </div>
        );
    }
    render() {
        const gallerySliderSettings = {
            dots: false,
            infinite: true,
            autoplay: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [
                { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
            ]
        };
        return (
            <div className="columns is-multiline">
            {
                this.state.images.length ?
                    this.props.slider ?
                        <GallerySlider {...gallerySliderSettings}>
                            {this.state.images.map((image, i) => (
                                this.renderGalleryImage(image, i)
                            ))}
                        </GallerySlider>
                        :
                        this.state.images.map((image, i) => (
                            this.renderGalleryImage(image, i)
                        ))
                    : null
            }
                <div className={classNames({
                    'home-showcase-gallery': true,
                    'is-hidden': !this.state.isGalleryOpen
                })} onClick={e => this.setState({isGalleryOpen: false})}>
                    <div className="home-showcase-gallery-overlay"/>
                    <div
                        className="home-showcase-gallery-inner"
                        style={{ top: this.state.galleryTop }}
                    >
                        <div className="home-showcase-gallery-inner-inner"
                             onClick={e => e.stopPropagation()}
                        >
                            <ReactImageGallery
                                ref={gallery => this.imageGallery = gallery}
                                items={this.state.images}
                                showPlayButton={false}
                                showThumbnails={false}
                                showFullscreenButton={false}
                                startIndex={0}
                                renderItem={item => this.renderGalleryLightboxItem(item)}
                                onSlide={idx => this.onSlideGallery(idx)}
                            />
                        </div>
                        <div className="home-showcase-gallery-brands">
                            <div className="home-showcase-gallery-brand-item">
                                <img src="/images/brands/ifi.png" alt="ifi"/>
                            </div>
                            <div className="home-showcase-gallery-brand-item">
                                <img src="/images/brands/idan.png" alt="idan"/>
                            </div>
                            <div className="home-showcase-gallery-brand-item">
                                <img src="/images/brands/diamond.png" alt="diamond"/>
                            </div>
                            <div className="home-showcase-gallery-brand-item">
                                <img src="/images/brands/intel.png" alt="intel"/>
                            </div>
                            <div className="home-showcase-gallery-brand-item">
                                <img src="/images/brands/ibm.png" alt="ibm"/>
                            </div>
                            <div className="home-showcase-gallery-brand-item">
                                <img src="/images/brands/samsung.png" alt="samsung"/>
                            </div>
                            <div className="home-showcase-gallery-brand-item">
                                <img src="/images/brands/insecta.png" alt="insecta"/>
                            </div>
                            <div className="home-showcase-gallery-brand-item">
                                <img src="/images/brands/microsoft.png" alt="microsoft"/>
                            </div>
                            <div className="home-showcase-gallery-brand-item">
                                <img src="/images/brands/xkojimedia.png" alt="xkojimedia"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ImageGallery;
