// /src/components/Logout.js
import React, {useState} from 'react';
import axios from 'axios';
import {Box, TextField, Button, Typography} from '@mui/material';
import {Link} from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:5000';

const Logout = ({onLogin, navigate}) => {
    const [formData, setFormData] = useState({
        email: '',
        senha: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/login', formData);
            const {access_token: token} = response.data[0];
            localStorage.setItem('token', token);
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            onLogin();
            navigate('/');
        } catch (error) {
            setError('Credenciais inválidas');
        }
    };

    return (
        <Box sx={{width: '100%', maxWidth: 400, mx: 'auto'}}>
            <Typography variant="h4" align="center" gutterBottom>
                Login
            </Typography>
            {error && (
                <Typography variant="body1" color="error">
                    {error}
                </Typography>
            )}
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    margin="normal"
                    name="email"
                    label="E-mail"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    name="senha"
                    label="Senha"
                    type="password"
                    value={formData.senha}
                    onChange={handleChange}
                />
                <Box sx={{mt: 3}}>
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disableElevation
                    >
                        Entrar
                    </Button>
                </Box>
                <Box sx={{mt: 2}}>
                    <Typography variant="body2" align="center">
                        Ainda não tem uma conta?
                        {' '}
                        <Button component={Link} to="/register" color="primary">
                            Registre-se aqui
                        </Button>
                    </Typography>
                </Box>
            </form>
        </Box>
    );
};

export default Logout
