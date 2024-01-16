import * as React from 'react';
import { Grid, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { getData, serverURL, postData } from "../../../Services/FetchNodeServices";
import Swal from 'sweetalert2'
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@mui/icons-material/Edit';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function SharedTasks() {

    var user = JSON.parse(localStorage.getItem("User"))
    const [userId, setUserId] = useState(user[0]._id)
    const theme = useTheme();
    const classes = useStyles();
    const matches_md = useMediaQuery(theme.breakpoints.down('md'));
    const matches_sm = useMediaQuery(theme.breakpoints.down('sm'));
    const [taskName, setTaskName] = useState('')
    const [users, setUsers] = useState([])
    const [open, setOpen] = useState(false)
    const [sharedTask, setSharedTask] = useState([])
    const [sharedTaskId, setSharedTaskId] = useState('')
    const [sharedTo, setSharedTo] = useState('')

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openOptions = Boolean(anchorEl);

    const handleClick = (event, item) => {
        setTaskName(item.taskname)
        setSharedTaskId(item._id)
        setSharedTo(item.sharedto)
        setAnchorEl(event.currentTarget);
    };
    const handleCloseOptions = () => {
        setAnchorEl(null);
    };

    const fetchSharedTask = async () => {
        var body = { 'sharedby': user[0].name }
        var response = await postData('share/display_shared_task_by_user', body)
        setSharedTask(response.data)
    }

    const fetchUsers = async () => {
        var response = await getData('user/display_all_user')
        setUsers(response.data)
    }

    var currentUserId = userId
    var filteredUsers = users.filter((item, i) => {
        if (currentUserId !== item._id) {
            return item
        }
    })

    useEffect(function () {
        fetchSharedTask()
        fetchUsers()
    }, [])

    const handleOpen = (rowData) => {
        setOpen(true)
        setAnchorEl(null)
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdateSharedTask = () => {
        Swal.fire({
            title: "Do you want to update the Taks's user?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Update',
            denyButtonText: `Don't update`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var body = { '_id': sharedTaskId, 'sharedto': sharedTo }
                var response = await postData('share/update_shared_task', body)
                fetchSharedTask()
                Swal.fire('Shared Task Updated!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Shared Task not updated', '', 'info')
            }
        })
    }

    const handleDelete = () => {
        setAnchorEl(null)
        Swal.fire({
            title: 'Do you want to delete the Shared Task?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'delete',
            denyButtonText: `Don't delete`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var body = { '_id': sharedTaskId }
                var response = await postData('share/delete_shared_task', body)
                fetchSharedTask()
                Swal.fire('Task Deleted!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Task not Deleted', '', 'info')
            }
        })
    }

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

    const EditSharedTaskDialog = () => {
        return (
            <div>
                <Dialog fullWidth open={open}
                    onClose={handleClose}>
                    <DialogContent>
                        <DialogContentText>
                            {EditSharedTask()}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleUpdateSharedTask} variant='contained' style={{ width: 100, background: '#2C2C2C', padding: '1.5% 9%', margin: '0 1%', boxShadow: 'none' }}>
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

    const allUsers = () => {
        return (
            filteredUsers.map((item) => {
                return (
                    <MenuItem value={item._id}>{item.name}</MenuItem>
                )
            })
        )
    }

    const handleShareUser = (event) => {
        setSharedTo(event.target.value)
    }

    const EditSharedTask = () => {
        return (
            <div>
                <Grid container spacing={1} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Grid item md={12} style={{ background: 'white', borderRadius: 30, width: '100%', padding: '4%' }}>
                        <Grid item md={12}>
                            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 23, color: 'black', opacity: '100%' }}>Edit Shared Task :<font style={{ color: '#2C2C2C' }}> {taskName} </font> </h2><br />
                        </Grid>
                        <Grid item md={12}>
                            <div style={{ marginTop: '4%' }}>
                                <FormControl fullWidth className={classes.roundedTextField}>
                                    <InputLabel id="demo-simple-select-label">Users</InputLabel>
                                    <Select
                                        value={sharedTo}
                                        label="Users"
                                        onChange={handleShareUser}
                                    >
                                        {allUsers()}
                                    </Select>
                                </FormControl>
                            </div>
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

    const displaySharedTasksListMobile = () => {
        return (
            sharedTask.map((item, i) => {

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
                                <MenuItem onClick={() => handleDelete(item)}><DeleteIcon style={{ marginRight: '12%' }} /> Delete</MenuItem>
                            </Menu>
                        </Grid>
                        <Grid item xs={10}>
                            <h3 style={{ margin: 0, fontWeight: 600, fontSize: 18 }}>{item.taskname.charAt(0).toUpperCase() + item.taskname.slice(1)}</h3>
                        </Grid>
                        <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>Shared To: {item.sharedtoData[0].name}</h3>
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

    const displaySharedTasksList = () => {
        return (
            sharedTask.map((item, i) => {

                var date = new Date(item.deadline);
                var month = date.getMonth()
                var day = date.getDate().toString().padStart(2, '0')
                var formattedDate = `${day} ${months[month].slice(0, 3)}`

                return (
                    <div style={{ width: '100%' }}>
                        <Grid container spacing={1} style={{ width: '100%', margin: '1% 0', padding: i % 2 == 0 ? '0.5% 1%' : '1% 1%', borderRadius: 20, background: i % 2 == 0 ? 'transparent' : 'white', boxShadow: i % 2 == 0 ? 'none' : '0px 3px 15px #d9d9d9',  display: 'flex', alignItems: 'center'  }}>
                            <Grid item xs={1}>
                                <img src="http://localhost:3000/images/user-image.png" style={{ width: 30, height: 30 }} />
                            </Grid>
                            <Grid item xs={1} style={{ display: 'flex', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>{item.sharedtoData[0].name}</h3>
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
                                    <MenuItem onClick={() => handleDelete(item)}><DeleteIcon style={{ marginRight: '12%' }} /> Delete</MenuItem>
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
            {EditSharedTaskDialog()}
            <div style={{ margin: matches_md ? '0 3%' : '7% 0 0', height: matches_md ? '100%' : '100vh' }}>
                <h3 style={{ margin: 0, fontWeight: 600, fontSize: 26 }}>Shared Task List</h3><br />
                {
                    matches_md ? displaySharedTasksListMobile() : displaySharedTasksList()
                }
            </div>
        </div>
    )
}