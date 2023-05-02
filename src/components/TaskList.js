// /src/components/TaskList.js
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    Box,
    Card,
    CardContent,
    CardActions,
    Button,
    TextField,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    MenuItem
} from '@mui/material';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

axios.defaults.baseURL = 'http://localhost:5000';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [prioridadesList, setPrioridadesList] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [newTask, setNewTask] = useState({
        titulo: '',
        descricao: '',
        status: 0,
        prioridade: 0,
        usuario: 1,
    });
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchPrioridades();
        fetchStatus();
        fetchTasks();
    }, []);

    const moveTask = (taskId, newStatus) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === taskId ? {...task, status: newStatus} : task))
        );
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
    };

    const handleCloseDetails = () => {
        setSelectedTask(null);
    };

    const fetchPrioridades = async () => {
        const response = await axios.get('/prioridade');
        setPrioridadesList(response.data);
    };

    const fetchStatus = async () => {
        const response = await axios.get('/status');
        setStatusList(response.data);
    };

    const fetchTasks = async () => {
        const response = await axios.get('/tarefa');
        setTasks(response.data);
    };

    const addTask = async () => {
        if (newTask.titulo.trim() === '') {
            return;
        }

        await axios.post('/tarefa', newTask);
        setNewTask({titulo: '', descricao: '', status: statusList[0], prioridade: prioridadesList[0], usuario: 0});
        fetchTasks();
        handleClose();
    };

    const deleteTask = async (id) => {
        await axios.delete(`/tarefa/${id}`);
        fetchTasks();
    };

    const updateTask = async (id, task, newStatus) => {
        try {
            await axios.put(`/tarefa/${id}`, {...task, status: newStatus});
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
            moveTask(id, task.status);
        }
    };


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onDragEnd = (result) => {
        const {destination, source, draggableId} = result;
        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const task = tasks.find((t) => t.id === parseInt(draggableId));
        moveTask(task.id, destination.droppableId);
        updateTask(task.id, task, destination.droppableId);
    };


    const getTasksByStatus = (status) => {
        return tasks.filter((task) => task.status === status);
    };

    return (
        <Box>
            <Typography variant="h4" align="center">
                Lista de Tarefas
            </Typography>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                Adicionar Tarefa
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Adicionar Tarefa</DialogTitle>
                <DialogContent>
                    <DialogContentText>Preencha os campos abaixo para adicionar uma nova tarefa.</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Título"
                        fullWidth
                        value={newTask.titulo}
                        onChange={(e) => setNewTask({...newTask, titulo: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="Descrição"
                        fullWidth
                        value={newTask.descricao}
                        onChange={(e) => setNewTask({...newTask, descricao: e.target.value})}
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Prioridade"
                        fullWidth
                        value={newTask.prioridade}
                        onChange={(e) => setNewTask({...newTask, prioridade: e.target.value})}
                    >
                        {prioridadesList.map((prioridade) => (
                            <MenuItem key={prioridade} value={prioridade}>
                                {prioridade}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        margin="dense"
                        label="Status"
                        fullWidth
                        value={newTask.status}
                        onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                    >
                        {statusList.map((status) => (
                            <MenuItem key={status} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={addTask}>Adicionar</Button>
                </DialogActions>
            </Dialog>
            <DragDropContext onDragEnd={onDragEnd}>
                <Grid container spacing={2} justifyContent="center" style={{marginTop: '16px'}}>
                    {statusList.map((status) => (
                        <Grid item key={status} xs={12} sm={6} md={4}>
                            <Typography variant="h6" align="center">
                                {status} ({getTasksByStatus(status).length})
                            </Typography>
                            <Droppable droppableId={status}>
                                {(provided) => (
                                    <Box
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        minHeight="200px"
                                        bgcolor="grey.200"
                                        borderRadius="4px"
                                        p={1}
                                    >
                                        {getTasksByStatus(status).map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                {(provided) => (
                                                    <Card
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            marginBottom: '8px',
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <Typography
                                                                variant="h6"
                                                                component="div"
                                                                noWrap
                                                                sx={{
                                                                    textOverflow: 'ellipsis',
                                                                    overflow: 'hidden',
                                                                    maxHeight: '3em', // Limite a altura para, por exemplo, 3 linhas
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={() => handleTaskClick(task)}
                                                            >
                                                                {task.titulo}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                component="div"
                                                                noWrap
                                                                sx={{
                                                                    textOverflow: 'ellipsis',
                                                                    overflow: 'hidden',
                                                                    maxHeight: '3em', // Limite a altura para, por exemplo, 3 linhas
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={() => handleTaskClick(task)}
                                                            >
                                                                {task.descricao}
                                                            </Typography>
                                                        </CardContent>

                                                        <CardActions>
                                                            <Button size="small" color="secondary"
                                                                    onClick={() => deleteTask(task.id)}>
                                                                Excluir
                                                            </Button>
                                                        </CardActions>
                                                    </Card>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        </Grid>
                    ))}
                </Grid>
            </DragDropContext>
            <Dialog open={Boolean(selectedTask)} onClose={handleCloseDetails}>
                <DialogTitle>{selectedTask?.titulo}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{selectedTask?.descricao}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetails}>Fechar</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default TaskList;