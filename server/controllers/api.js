class ApiController {
    constructor(config, entryService, mailService) {
        this.config = config;
        this.entryService = entryService;
        this.mailService = mailService;
    }

    getEntries(req, res) {
        return this.entryService.getEntries(res.locals.userIp).then(entries => {
            return res.send({
                status: 'success',
                entries
            });
        }).catch(err => {
            return res.status(400).send({
                status: 'error',
                error: err
            });
        });
    }

    searchEntries(req, res) {
        return this.entryService.searchEntries(res.locals.userIp, req.query.term).then(entries => {
            return res.send({
                status: 'success',
                entries
            });
        }).catch(err => {
            return res.status(400).send({
                status: 'error',
                error: err
            });
        });
    }

    saveEntry(req, res) {
        return this.entryService.saveEntry(req.body).then(entry => {
            return res.send({
                status: 'success',
                entry
            });
        }).catch(err => {
            return res.status(400).send({
                status: 'error',
                error: err
            });
        });
    }

    likeEntry(req, res) {
        return this.entryService.likeEntry(req.body.entryId, res.locals.userIp).then(like => {
            return res.send({
                status: 'success',
                like
            });
        }).catch(err => {
            return res.status(400).send({
                status: 'error',
                error: err
            });
        });
    }

    unlikeEntry(req, res) {
        return this.entryService.unlikeEntry(req.body.entryId, res.locals.userIp).then(() => {
            return res.send({
                status: 'success'
            });
        }).catch(err => {
            return res.status(400).send({
                status: 'error',
                error: err
            });
        });
    }

    viewEntry(req, res) {
        return this.entryService.viewEntry(req.body.entryId, res.locals.userIp).then(view => {
            return res.send({
                status: 'success',
                view
            });
        }).catch(err => {
            return res.status(400).send({
                status: 'error',
                error: err
            });
        });
    }
}

module.exports = ApiController;
