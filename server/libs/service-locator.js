class ServiceLocator {
    constructor() {
        this._registry = new Map();
    }

    get(svc) {
        if (this._registry.has(svc)) {
            return this._registry.get(svc);
        }
        throw new Error(`No dependency for '${svc}' was found.`);
    }

    register(svc, fn) {
        return this._registry.set(svc, fn());
    }
}

module.exports = new ServiceLocator();
