import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import asyncComponent from './Utilities/asyncComponent';

const Email = asyncComponent(() => import(/* webpackChunkName: "SamplePage" */ './PresentationalComponents/Email/Email'));

const paths = {
    email: '/email'
};

const InsightsRoute = ({ component: Component, rootClass, ...rest }) => {
    const root = document.getElementById('root');
    root.removeAttribute('class');
    root.classList.add(`page__${rootClass}`, 'pf-c-page__main');
    root.setAttribute('role', 'main');

    return (<Route { ...rest } component={ Component } />);
};

InsightsRoute.propTypes = {
    component: PropTypes.func,
    rootClass: PropTypes.string
};

export const Routes = () => {
    return (
        <Switch>
            <InsightsRoute path={ paths.email } component={ Email } rootClass='email'/>

            { /* Finally, catch all unmatched routes */ }
            <Redirect path='*' to={ paths.email } push />
        </Switch>
    );
};
