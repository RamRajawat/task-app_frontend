import * as React from 'react';
import { Grid, TextField, Button, Avatar } from "@mui/material";
import { useState, useEffect } from "react";
import { serverURL, postData } from "../../../Services/FetchNodeServices";
import Swal from 'sweetalert2'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@mui/icons-material/Edit';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function AssignedTasks(props) {

    var user = JSON.parse(localStorage.getItem("User"))
    const [userId, setUserId] = useState(user[0]._id)
    const theme = useTheme();
    const classes = useStyles();
    const matches_md = useMediaQuery(theme.breakpoints.down('md'));
    const matches_sm = useMediaQuery(theme.breakpoints.down('sm'));
    var navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [taskStatus, setTaskStatus] = useState('')
    const [getErrors, setErrors] = useState({})
    const [assignedTask, setAssignedTask] = useState([])
    const [assignedTaskId, setAssignedTaskId] = useState('')

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openOptions = Boolean(anchorEl);
    const handleClick = (event, item) => {
        setAssignedTaskId(item._id)
        setTaskStatus(item.status)
        setAnchorEl(event.currentTarget);
    };
    const handleCloseOptions = () => {
        setAnchorEl(null);
    };

    const fetchAssignedTask = async () => {
        var body = { 'sharedto': userId }
        var response = await postData('share/display_assigned_task_by_user', body)
        setAssignedTask(response.data)
    }

    useEffect(function () {
        fetchAssignedTask()
    }, [])

    const handleError = (error, label) => {
        setErrors((prev) => ({ ...prev, [label]: error }))
    }

    const validation = () => {
        var error = false
        if (taskStatus.length === 0) {
            error = true
            handleError('Please enter Task status', 'taskStatus')
        }
        return error
    }

    const handleOpen = () => {
        setOpen(true)
        setAnchorEl(null);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleDownloadFile = async (filename) => {
        const fileUrl = `${serverURL}/images/${filename}`;
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const link = document.createElement('a');
        const blobUrl = window.URL.createObjectURL(blob);
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    };

    const handleUpdateTaskSatus = async () => {
        var error = validation()
        if (error === false) {
            var body = { _id: assignedTaskId, status: taskStatus }
            var response = await postData('share/update_task_status', body)
            if (response.status === true) {
                fetchAssignedTask()
                Swal.fire({
                    icon: 'success',
                    toast: true,
                    title: 'Task status updated!'
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Task status not updated!'
                })
            }
        }
    }

    const EditTaskStatusDialog = () => {
        return (
            <div>
                <Dialog fullWidth open={open}
                    onClose={handleClose}>
                    <DialogContent>
                        <DialogContentText>
                            {EditTaskStatus()}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleUpdateTaskSatus} variant='contained' style={{ width: 100, background: '#2C2C2C', padding: '1.5% 9%', margin: '0 1%', boxShadow: 'none' }}>
                            Update
                        </Button>
                        <Button onClick={handleClose} variant='outlined' style={{ width: 100, background: 'white', padding: '1.5% 9%', margin: '0 1%', boxShadow: 'none', border: '1px solid #2C2C2C', color: '#2C2C2C' }}>
                            CANCEL
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    const EditTaskStatus = () => {
        return (
            <div>
                <Grid container spacing={1} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Grid item md={12} style={{ background: 'white', borderRadius: 30, width: '100%', padding: '4%' }}>
                        <Grid item md={12}>
                            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 23, color: 'black', opacity: '100%' }}>Edit Satus : <font style={{ color: '#2C2C2C' }}>Completed/Pending</font> </h2><br />
                        </Grid>
                        <Grid item md={12}>
                            <TextField
                                value={taskStatus}
                                onFocus={() => handleError('', 'taskStatus')}
                                error={getErrors.taskStatus}
                                helperText={getErrors.taskStatus}
                                onChange={(e) => setTaskStatus(e.target.value)} label="Task status" variant="outlined" fullWidth className={classes.roundedTextField} />
                        </Grid>
                    </Grid>
                </Grid>
            </div >
        )
    }

    const months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ]

    const displayAssignedTasksListMobile = () => {
        return (
            assignedTask.map((item, i) => {

                var date = new Date(item.deadline);
                var month = date.getMonth()
                var day = date.getDate().toString().padStart(2, '0')
                var formattedDate = `${day} ${months[month].slice(0, 3)}`

                return (
                    <Grid container spacing={1} style={{ position: 'relative', padding: '5% 3%', borderRadius: 15, background: i % 2 == 0 ? '#F1EEE4' : 'white', display: 'flex', alignItems: 'center', margin: '3% 0 6%', boxShadow: i % 2 == 0 ? 'none' : '0px 3px 20px #d9d9d9' }}>
                        <div style={{}}>
                            <h3 style={{ margin: 0, fontWeight: 500, fontSize: 40, opacity: '25%' }}>{i + 1}.</h3>
                        </div>
                        <Grid item xs={12} style={{ position: 'absolute', top: '3%', right: '3%' }}>
                            <MoreVertIcon style={{ cursor: 'pointer' }}
                                aria-controls={openOptions ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openOptions ? 'true' : undefined}
                                onClick={(event) => handleClick(event, item)}
                            />
                            <Menu
                                style={{ boxShadow: 'none' }}
                                anchorEl={anchorEl}
                                open={openOptions}
                                onClose={handleCloseOptions}
                            >
                                <MenuItem onClick={() => handleOpen(item)}><EditIcon style={{ marginRight: '12%' }} /> Edit</MenuItem>
                            </Menu>
                        </Grid>
                        <Grid item xs={10}>
                            <h3 style={{ margin: 0, fontWeight: 600, fontSize: 18 }}>{item.taskname.charAt(0).toUpperCase() + item.taskname.slice(1)}</h3>
                        </Grid>
                        <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>Shared By: {item.sharedby}</h3>
                        </Grid>
                        <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                            <h3 style={{ margin: 0, fontWeight: 500, fontSize: 16, color: 'green' }}>Deadline: {formattedDate}</h3>
                        </Grid>
                        <Grid item xs={8} style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: 120 }}>
                                <p style={{ padding: '4%', borderRadius: 5, background: item.status == 'Completed' ? '#b2f7b6' : '#ffe69c', color: 'black', textAlign: 'center' }}>{item.status}</p>
                            </div>
                        </Grid>
                        <Grid item xs={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                            <div
                                style={{ cursor: 'pointer', padding: '3% 8%', background: '#ffeab8', borderRadius: 5, justifyContent: 'center', display: 'flex', alignItems: 'center' }}
                                onClick={() => handleDownloadFile(item.file)}
                            >
                                File <CloudDownloadIcon style={{ marginLeft: '15%', color: '#2c2c2c' }} />
                            </div>
                        </Grid>
                    </Grid>
                )
            })
        )
    }

    const displayAssignedTasksList = () => {
        return (
            assignedTask.map((item, i) => {

                var date = new Date(item.deadline);
                var month = date.getMonth()
                var day = date.getDate().toString().padStart(2, '0')
                var formattedDate = `${day} ${months[month].slice(0, 3)}`

                return (
                    <div style={{ width: '100%' }}>
                        <Grid container spacing={1} style={{ width: '100%', margin: '1% 0', padding: i % 2 == 0 ? '0.5% 1%' : '1% 1%', borderRadius: 20, background: i % 2 == 0 ? 'transparent' : 'white', boxShadow: i % 2 == 0 ? 'none' : '0px 3px 15px #d9d9d9', display: 'flex', alignItems: 'center' }}>
                            <Grid item xs={1}>
                                <img src="http://localhost:3000/images/user-image.png" style={{ width: 30, height: 30 }} />
                            </Grid>
                            <Grid item xs={1} style={{ display: 'flex', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>{item.sharedby}</h3>
                            </Grid>
                            <Grid item xs={3} style={{ display: 'flex', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>{item.taskname.charAt(0).toUpperCase() + item.taskname.slice(1)}</h3>
                            </Grid>
                            <Grid item xs={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <h3 style={{ margin: 0, fontWeight: 500, fontSize: 16, color: 'green' }}>{formattedDate}</h3>
                            </Grid>
                            <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                                <div
                                    style={{ cursor: 'pointer', padding: '3% 8%', background: '#ffeab8', borderRadius: 5, justifyContent: 'center', display: 'flex', alignItems: 'center' }}
                                    onClick={() => handleDownloadFile(item.file)}
                                >
                                    File <CloudDownloadIcon style={{ marginLeft: '15%', color: '#2c2c2c' }} />
                                </div>
                            </Grid>
                            <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ width: 100 }}>
                                    <p style={{ padding: '4%', borderRadius: 5, background: item.status == 'Completed' ? '#b2f7b6' : '#ffe69c', color: 'black', textAlign: 'center' }}>{item.status}</p>
                                </div>
                            </Grid>
                            <Grid item xs={1}>
                                <MoreVertIcon style={{ cursor: 'pointer' }}
                                    aria-controls={openOptions ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={openOptions ? 'true' : undefined}
                                    onClick={(event) => handleClick(event, item)}
                                />
                                <Menu
                                    style={{ boxShadow: 'none' }}
                                    anchorEl={anchorEl}
                                    open={openOptions}
                                    onClose={handleCloseOptions}
                                >
                                    <MenuItem onClick={() => handleOpen(item)}><EditIcon style={{ marginRight: '12%' }} /> Edit</MenuItem>
                                </Menu>
                            </Grid>
                        </Grid>
                    </div>
                )
            })
        )
    }

    return (
        <div>
            {EditTaskStatusDialog()}
            <div style={{ margin: matches_md ? '0 3%' : '7% 0 0', height: matches_md ? '100%' : '100vh' }}>
                <h3 style={{ margin: 0, fontWeight: 600, fontSize: 26 }}>Assigned Task List</h3><br />
                {
                    matches_md ? displayAssignedTasksListMobile() : displayAssignedTasksList()
                }
            </div>
        </div>
    )
}