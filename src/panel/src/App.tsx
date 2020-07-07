import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';

import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import { useDispatch } from 'react-redux';
import { fetchAuth } from '@app/authSlice';
import { FeedbackDialog } from './components';

import 'react-perfect-scrollbar/dist/css/styles.css';
import '@assets/scss/index.scss';
import { CssBaseline } from '@material-ui/core';

const BASE_NAME = process.env.NODE_ENV === 'development' ? '' : 'panel';

export default function App() {
    const dispatch = useDispatch();

    React.useEffect(function fetchAuthOnMounted() {
        dispatch(
            fetchAuth({
                id: '12345',
                name: 'Test user',
                email: 'test@example.com',
                avatar_url: { src: '', lqip: '', webp: '' },
                bio: 'Awsome user',
                created_at: '10.10.2020',
            })
        );
    }, []);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <FeedbackDialog />
            <Router basename={BASE_NAME}>
                <Routes />
            </Router>
        </ThemeProvider>
    );
}
