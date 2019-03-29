import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>, document.getElementById('root'));
// registerServiceWorker();

// Uninstall all service workers
navigator.serviceWorker.getRegistrations().then(registrations => {
    for(let registration of registrations) {
        registration.unregister();
    }
});
