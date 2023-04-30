import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes, Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {AppBar, Toolbar, Typography, Button, Container} from '@mui/material';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import UserList from './components/UserList';

axios.defaults.baseURL = 'http://localhost:5000';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleRegister = () => {
        navigate('/login');
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        axios.defaults.headers.common.Authorization = null;
        navigate('/login');
    };

    return (
        <Router>
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            Todo App
                        </Typography>
                        {isLoggedIn ? (
                            <>
                                <Button color="inherit" component={Link} to="/">
                                    Tarefas
                                </Button>
                                <Button color="inherit" component={Link} to="/usuarios">
                                    Usuários
                                </Button>
                                <Button color="inherit" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button color="inherit" component={Link} to="/login">
                                Login
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>

                <Container className="mt-3">
                    <Routes>
                        {
                            isLoggedIn ? (
                                <>
                                    <Route path="/" element={<TaskList/>}/>
                                    <Route path="/usuarios" element={<UserList/>}/>
                                </>
                            ) : (
                                <>
                                    <Route path="/register" element={<Register/>} onRegister={handleRegister}
                                           navigate={navigate}/>
                                    <Route path="/login" element={<Login onLogin={handleLogin} navigate={navigate}/>}/>
                                </>
                            )
                        }
                    </Routes>
                </Container>
            </div>
        </Router>
    );
}

export default App;
