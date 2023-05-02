// /src/App.js
import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import axios from 'axios';
import {Container} from '@mui/material';
import TaskList from './components/TaskList';
import UserList from './components/UserList';
import Header from './components/Header';
import Home from './components/Home'; // Importe o componente Home
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {CssBaseline} from '@mui/material';

axios.defaults.baseURL = 'http://localhost:5000';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        const localDarkMode = localStorage.getItem('darkMode');
        return localDarkMode === 'true';
    });

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);
    };

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            setIsLoggedIn(true);
        } else {
            axios.defaults.headers.common.Authorization = null;
        }
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        axios.defaults.headers.common.Authorization = null;
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Router>
                {!isLoggedIn && <Navigate to="/"/>}
                <div>
                    {isLoggedIn &&
                        <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} toggleDarkMode={toggleDarkMode}/>}

                    <Container className="mt-3">
                        <Routes>
                            {isLoggedIn ? (
                                <>
                                    <Route path="/" element={<TaskList/>}/>
                                    
                                    <Route path="/usuarios" element={<UserList/>}/>
                                </>
                            ) : (
                                <>
                                    <Route path="/" exact
                                           element={<Home onLogin={handleLogin} toggleDarkMode={toggleDarkMode}/>}/>
                                </>
                            )}
                        </Routes>
                    </Container>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
