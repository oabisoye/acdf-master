class GalleryController {
    constructor(config, entryService) {
        this.config = config;
        this.entryService = entryService;
    }

    renderGalleryImage(req, res) {
        const media_url = process.env.REACT_APP_IMAGE_BUCKET_URL;
        this.entryService.getEntryById(req.params.id).then(entry => {
            this.entryService.viewEntry(req.params.id, require('request-ip').getClientIp(req));
            return res.render('templates/image', Object.assign({}, entry, {media_url: media_url}));
        }).catch(err => {
            console.log(err);
            return res.redirect('/');
        });
    }
}

module.exports = GalleryController;
