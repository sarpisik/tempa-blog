import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import 'react-perfect-scrollbar/dist/css/styles.css';

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <p>Hello world!</p>
        </ThemeProvider>
    );
}
