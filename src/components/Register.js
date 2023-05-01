import React, {useState} from 'react';
import axios from 'axios';
import {Box, TextField, Button, Typography} from '@mui/material';
import {Link} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from 'react-toastify';
import ErrorToast from './ErrorToast';

axios.defaults.baseURL = 'http://localhost:5000';

const Register = ({onRegister, navigate}) => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
    });
    const [errors, setErrors] = useState(null);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        axios.post('/usuario', formData)
            .then(response => {
                const {access_token: token} = response.data;
                console.log(response);
                localStorage.setItem('token', token);
                onRegister();
                navigate('/');
            })
            .catch(error => {
                console.warn(error);
                if (error.response && error.response.data) {
                    const errorsArray = error.response.data.map(error => error.msg);
                    setErrors(errorsArray);
                    toast.error(<ErrorToast errors={errorsArray}/>); // Use o componente ErrorToast personalizado
                } else {
                    const errorMessage = 'Erro ao registrar usuário';
                    setErrors([errorMessage]);
                    toast.error(<ErrorToast errors={[errorMessage]}/>); // Use o componente ErrorToast personalizado
                }
            });

    };

    return (
        <Box sx={{width: '100%', maxWidth: 400, mx: 'auto'}}>
            <ToastContainer/>
            <Typography variant="h4" align="center" gutterBottom>
                Registrar-se
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    margin="normal"
                    name="nome"
                    label="Nome"
                    type="text"
                    value={formData.nome}
                    onChange={handleChange}
                />
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
                        Registrar
                    </Button>
                </Box>
                <Box sx={{mt: 2}}>
                    <Typography variant="body2" align="center">
                        Já possui uma conta?
                        {' '}
                        <Button component={Link} to="/login" color="primary">
                            Acesse agora
                        </Button>
                    </Typography>
                </Box>
            </form>
        </Box>
    );
};

export default Register;
