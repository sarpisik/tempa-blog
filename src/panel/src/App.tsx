import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';

import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import { useDispatch } from 'react-redux';
import { setUserAsync } from './app/slice';

import 'react-perfect-scrollbar/dist/css/styles.css';
import '@assets/scss/index.scss';

export default function App() {
    const dispatch = useDispatch();

    React.useEffect(function fetchUser() {
        dispatch(
            setUserAsync({
                id: '12345',
                name: 'Test user',
                avatar_url: '',
                description: 'Awsome user',
                created_at: '10.10.2020',
            })
        );
    }, []);
    return (
        <ThemeProvider theme={theme}>
            <Router basename="panel">
                <Routes />
            </Router>
        </ThemeProvider>
    );
}
