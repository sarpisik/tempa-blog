import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';

import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../assets/scss/index.scss';

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Routes />
            </Router>
        </ThemeProvider>
    );
}
