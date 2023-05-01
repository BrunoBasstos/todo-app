import React, {useEffect, useState} from 'react';
import axios from 'axios';

import {
    Box,
    Button,
    TextField,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

axios.defaults.baseURL = 'http://localhost:5000';

const UserList = () => {
    const [userList, setUserList] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        const response = await axios.get('/usuario');
        setUserList(response.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEditUser = async (user) => {
        await axios.put(`/usuario/${user.id}`, user);
        fetchUsers();
    };

    const handleDeleteUser = async (id) => {
        await axios.delete(`/usuario/${id}`);
        fetchUsers();
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setSelectedUser(null);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setSelectedUser(null);
    };

    return (
        <Box>
            <Typography variant="h4" align="center" gutterBottom>
                Lista de Usuários
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>E-mail</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userList.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.nome}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setEditDialogOpen(true);
                                        }}
                                    >
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setDeleteDialogOpen(true);
                                        }}
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
                <DialogTitle>Editar Usuário</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nome"
                        type="text"
                        fullWidth
                        value={selectedUser?.nome || ''}
                        onChange={(e) => setSelectedUser({...selectedUser, nome: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="E-mail"
                        type="email"
                        fullWidth
                        value={selectedUser?.email || ''}
                        onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        handleCloseEditDialog();
                    }}
                            color="secondary"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => {
                            handleEditUser(selectedUser);
                            handleCloseEditDialog();
                        }}
                        color="primary"
                    >
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {'Deseja excluir o usuário?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Ao confirmar, o usuário será excluído permanentemente.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => {
                            handleDeleteUser(selectedUser.id);
                            handleCloseDeleteDialog();
                        }}
                        color="secondary"
                        autoFocus
                    >
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );

};

export default UserList;
