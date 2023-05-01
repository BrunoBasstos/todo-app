import React from 'react';
import {Link} from 'react-router-dom';
import {AppBar, Toolbar, Typography, Button} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';

const Header = ({isLoggedIn, handleLogout, toggleDarkMode}) => {
    return (
        // definir margem inferior para evitar que o conteúdo seja ocultado pelo cabeçalho
        <AppBar position="static" sx={{mb: 5}} >
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
                        <Button color="inherit" onClick={handleLogout} to="/">
                            Logout
                        </Button>
                    </>
                ) : (
                    <Button color="inherit" component={Link} to="/login">
                        Login
                    </Button>
                )}
                <IconButton edge="end" color="inherit" onClick={toggleDarkMode}>
                    <Brightness4Icon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
