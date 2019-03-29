import React, { Component } from 'react';

import formatDate from '../utils/format_date';

class ShowcaseItem extends Component {
    render() {
        const media_url = process.env.REACT_APP_IMAGE_BUCKET_URL;
        const {
            onClick,
            data
        } = this.props;
        return (
            <div className="home-showcase-item" onClick={ e => onClick(e) }>
                <div className="home-showcase-item-image">
                    <img src={`${media_url}${data.image_link}`} alt="showcase"/>
                </div>
                <div className="home-showcase-item-details">
                    <div className="home-showcase-item-author">{data.user_name}</div>
                    <div className="home-showcase-item-metrics">
                        <div className="home-showcase-item-views">
                            <img src="/images/icons/eye-icon.png" alt="views"/>
                            <span>{data.views.length}</span>
                        </div>
                        <div className="home-showcase-item-likes">
                            <img src="/images/icons/heart-icon.png" alt="likes"/>
                            <span>{data.likes.length}</span>
                        </div>
                    </div>
                    <div className="home-showcase-item-date">{formatDate(new Date(data.created_at))}</div>
                </div>
            </div>
        );
    }
}

export default ShowcaseItem;
