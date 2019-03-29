import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import './App.css';

import HomePage from './pages/Home';
import BrandPage from './pages/BrandPage';
import CreatePage from './pages/Create';
import GalleryPage from './pages/Gallery';

class App extends Component {
    render() {
        return (
            <div className="wrapper">
                <Route render={({location}) => (
                    <CSSTransitionGroup
                        transitionName='page_route'
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={500}
                    >
                        <Switch key={location.key} location={location}>
                            <Route exact path='/' component={HomePage} />
                            <Route exact path='/acdf' component={BrandPage} />
                            <Route exact path='/create' component={CreatePage} />
                            <Route exact path='/gallery' component={GalleryPage} />
                        </Switch>
                    </CSSTransitionGroup>
                )} />
            </div>
        );
    }
}

export default App;
