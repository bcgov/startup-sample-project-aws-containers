import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import MomentUtils from '@date-io/moment';
import LinearProgress from '@material-ui/core/LinearProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'react-app-polyfill/ie11';

import { Routes, Theme } from './constants';

import { PrivateRoute, PublicRoute } from './components/generic';

const Form = lazy(() => import('./pages/public/Form'));
const Confirmation = lazy(() => import('./pages/public/Confirmation'));
const PDF = lazy(() => import('./pages/public/PDF'));
const Login = lazy(() => import('./pages/public/Login'));
const Lookup = lazy(() => import('./pages/private/Lookup'));
const LookupConfirmationNumber = lazy(() => import('./pages/private/LookupConfirmationNumber'));
const LookupLastName = lazy(() => import('./pages/private/LookupLastName'));

const App = () => (
  <ThemeProvider theme={Theme}>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <CssBaseline />
      <BrowserRouter>
        <Suspense fallback={<LinearProgress />}>
          <Switch>
            {/* Public routes */}
            <PublicRoute exact path={Routes.Form} component={Form} />
            <PublicRoute exact path={Routes.Confirmation} component={Confirmation} />
            <PublicRoute exact path={Routes.RenderPDF.staticRoute} component={PDF} />
            <PublicRoute exact path={Routes.Login} component={Login} adminRedirect={Routes.Lookup} />
            
            {/* Private routes */}
            <PrivateRoute exact path={Routes.Lookup} component={Lookup} />
            <PrivateRoute exact path={Routes.LookupLastName.staticRoute} component={LookupLastName} />
            <PrivateRoute exact path={Routes.LookupConfirmationNumber.staticRoute} component={LookupConfirmationNumber} />

            {/* Invalid route - default to form */}
            <Route component={Form} />
          </Switch>
        </Suspense>
      </BrowserRouter>
    </MuiPickersUtilsProvider>
  </ThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
