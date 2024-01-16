import * as React from 'react';
import { Grid, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { getData, serverURL, postData } from "../../../Services/FetchNodeServices";
import Swal from 'sweetalert2'
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useNavigate } from 'react-router-dom';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function TaskList() {

    var user = JSON.parse(localStorage.getItem("User"))
    const [userId, setUserId] = useState(user[0]._id)
    const classes = useStyles()
    const theme = useTheme();
    const matches_md = useMediaQuery(theme.breakpoints.down('md'));
    const matches_sm = useMediaQuery(theme.breakpoints.down('sm'));
    var navigate = useNavigate()
    const [taskId, setTaskId] = useState('')
    const [taskList, setTaskList] = useState([])
    const [taskName, setTaskName] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState('')
    const [category, setCategory] = useState('')
    const [tags, setTags] = useState('')
    const [chipData, setChipData] = useState([])
    const [databaseCategory, setDatabaseCategory] = useState([])
    const [users, setUsers] = useState([])
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState('')
    const [getErrors, setErrors] = useState({})
    const [shareDialog, setShareDialog] = useState(false)
    const [shareUserId, setShareUserId] = useState('')
    const [sharedTo, setSharedTo] = useState('')
    const [sharedBy, setSharedBy] = useState(user[0].name)
    const [file, setFile] = useState({ bytes: '', filename: '' })
    const [fileName, setFileName] = useState('')

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openOptions = Boolean(anchorEl);

    const handleClick = (event, item) => {
        setUserId(userId)
        setTaskId(item._id)
        setTaskName(item.taskname)
        setDescription(item.description)
        setDeadline(item.deadline)
        setChipData(item.tags.split(','))
        setCategory(item.category)
        setFile(item.file)
        setAnchorEl(event.currentTarget);
    };
    const handleCloseOptions = () => {
        setAnchorEl(null);
    };

    useEffect(function () {
        fetchTasks()
        fetchUsers()
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        var body = { 'userid': userId }
        var response = await postData('category/display_all_category_by_user', body)
        setDatabaseCategory(response.data)
    }

    var currentUserId = userId
    var filteredUsers = users.filter((item, i) => {
        if (currentUserId !== item._id) {
            return item
        }
    })

    const fetchUsers = async () => {
        var response = await getData('user/display_all_user')
        setUsers(response.data)
    }

    const fetchTasks = async () => {
        var body = { 'userid': userId }
        var response = await postData('task/display_all_task_by_user', body)
        setTaskList(response.data)
    }

    const handleError = (error, label) => {
        setErrors((prev) => ({ ...prev, [label]: error }))
    }

    const validation = () => {
        var error = false
        if (taskName.length === 0) {
            error = true
            handleError('Please enter Task Name', 'taskName')
        }
        if (deadline.length === 0) {
            error = true
            handleError('Please select Deadline', 'deadline')
        }
        return error
    }

    const handleDeadline = (deadline) => {
        setDeadline(deadline)
        handleError('', 'deadline')
    }

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    }

    const handleTagsInputChange = (event) => {
        setTags(event.target.value);
    }

    const handleShareUser = (event) => {
        setSharedTo(event.target.value)
    }

    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
    }))

    const handleAddTags = () => {
        if (tags.trim() !== '') {
            const newTag = tags
            setChipData([...chipData, newTag])
            setTags('')
        }
    }

    var tagsString = chipData.join(',');

    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip !== chipToDelete));
    }

    const handleTagsInputKeyPress = (event) => {
        if (event.key === 'Enter' || event.key === ',') {
            setTags('');
            handleAddTags();
        }
    }

    const categoryItems = () => {
        return (
            databaseCategory.map((item) => {
                return (
                    <MenuItem value={item._id}>{item.categoryname}</MenuItem>
                )
            })
        )
    }

    const handleOpen = () => {
        setOpen(true)
        setAnchorEl(null)
    }

    const handleShareDialog = (rowData) => {
        setShareDialog(true)
        setFileName(rowData.file)
        setAnchorEl(null)
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleCloseShareDialog = () => {
        setShareDialog(false);
    }

    const handleFile = (event) => {
        setFile({ bytes: event.target.files[0], filename: URL.createObjectURL(event.target.files[0]) })
    }

    const handleDownloadFile = async (filename) => {
        const fileUrl = `${serverURL}/images/${filename}`
        const response = await fetch(fileUrl)
        const blob = await response.blob()
        const link = document.createElement('a')
        const blobUrl = window.URL.createObjectURL(blob);
        link.href = blobUrl;
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl);
    }

    const handleDeleteTask = (rowData) => {
        setAnchorEl(null)
        Swal.fire({
            title: 'Do you want to delete the Task?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            denyButtonText: `Don't delete`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var taskid = { 'taskid': taskId, 'userid': userId, 'taskname': taskName, 'deadline': deadline, 'category': category, 'description': description, 'tags': tagsString, 'file': file }
                var body = { '_id': taskId }
                var response = await postData('task/delete-task', body)
                var responseTrash = await postData('trash/create_trash_task', taskid)
                fetchTasks()
                Swal.fire('Task Deleted!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Task not Deleted', '', 'info')
            }
        })
    }

    const handleShareTask = async () => {

        var error = validation()
        if (error === false) {
            var body = {
                'sharedto': sharedTo,
                'taskid': taskId,
                'taskname': taskName,
                'description': description,
                'category': category,
                'tags': tags,
                'deadline': deadline,
                'sharedby': sharedBy,
                'status': 'Pending',
                'file': fileName
            }
            var response = await postData('share/share-task', body)
            if (response.status === true) {
                Swal.fire({
                    icon: 'success',
                    toast: true,
                    title: 'Task shared!'
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Task not shared!'
                })
            }
        }
    }

    const handleUpdateTask = () => {
        Swal.fire({
            title: 'Do you want to update the Task?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Update',
            denyButtonText: `Don't update`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var body = { '_id': taskId, 'taskname': taskName, 'description': description, 'deadline': deadline, 'category': category, 'tags': tagsString }
                var response = await postData('task/update-task', body)
                fetchTasks()
                Swal.fire('Task Updated!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Task not updated', '', 'info')
            }
        })
    }

    const shareDialogBox = () => {
        return (
            <div>
                <Dialog fullWidth open={shareDialog}
                    onClose={handleCloseShareDialog}>
                    <DialogContent>
                        <DialogContentText>
                            {shareTask()}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleShareTask} variant='contained' style={{ width: 100, background: '#2C2C2C', padding: '1.5% 9%', margin: '0 1%', boxShadow: 'none' }}>
                            SHARE
                        </Button>
                        <Button onClick={handleCloseShareDialog} variant='outlined' style={{ width: 100, background: 'white', padding: '1.5% 9%', margin: '0 1%', boxShadow: 'none', border: '1px solid #2C2C2C', color: '#2C2C2C' }}>
                            CANCEL
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    const editTaskDialog = () => {
        return (
            <div>
                <Dialog fullWidth open={open}
                    onClose={handleClose}>
                    <DialogContent>
                        <DialogContentText>
                            {editTask()}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleUpdateTask} variant='contained' style={{ width: 100, background: '#2C2C2C', padding: '1.5% 9%', margin: '0 1%', boxShadow: 'none' }}>
                            UPDATE
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

    const shareTask = () => {
        return (
            <div>
                <Grid container spacing={1} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Grid item md={12} style={{ background: 'white', borderRadius: 30, width: '100%', padding: '4%' }}>
                        <h2 style={{ margin: 0, fontWeight: 600, fontSize: 23, color: 'black', opacity: '100%' }}> Share Task :<font style={{ color: '#2C2C2C' }}> {taskName} </font></h2>

                        <div style={{ marginTop: '5%' }}>
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
            </div>
        )
    }

    const editTask = () => {
        return (
            <div>
                <Grid container spacing={1} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Grid item md={12} style={{ background: 'white', borderRadius: 30, width: '100%', padding: '4%' }}>
                        <Grid item md={12}>
                            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 23, color: 'black', opacity: '100%' }}>Edit Task :<font style={{ color: '#2C2C2C' }}> {taskName} </font> </h2><br />
                        </Grid>
                        <Grid item md={12}>
                            <TextField
                                value={taskName}
                                onFocus={() => handleError('', 'taskName')}
                                error={getErrors.taskName}
                                helperText={getErrors.taskName}
                                onChange={(e) => setTaskName(e.target.value)} label="Task name" variant="outlined" fullWidth className={classes.roundedTextField} />
                        </Grid>
                        <Grid item md={12} style={{ marginTop: '3%' }}>
                            <TextField
                                value={description}
                                onChange={(e) => setDescription(e.target.value)} label="Description" variant="outlined" fullWidth className={classes.roundedTextField} />
                        </Grid>
                        <Grid item md={12} style={{ marginTop: '3%' }}>
                            <FormControl fullWidth className={classes.roundedTextField}>
                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                    value={category}
                                    label="Category"
                                    onChange={handleCategoryChange}>
                                    {categoryItems()}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={12} style={{ marginTop: '3%' }}>
                            <TextField
                                className={classes.roundedTextField}
                                fullWidth
                                label='Tags'
                                variant='outlined'
                                value={tags}
                                onChange={handleTagsInputChange}
                                onKeyPress={handleTagsInputKeyPress}
                            />
                            <Paper
                                sx={{
                                    background: 'transparent',
                                    display: 'flex',
                                    justifyContent: 'left',
                                    flexWrap: 'wrap',
                                    listStyle: 'none',
                                    boxShadow: 'none',
                                    p: 0.5,
                                    m: 0,
                                }}
                                component="ul"
                            >
                                {chipData.map((item, i) => {
                                    let icon;

                                    if (item === 'React') {
                                        icon = <TagFacesIcon />;
                                    }

                                    return (
                                        <ListItem key={i}>
                                            <Chip
                                                icon={icon}
                                                label={item}
                                                onDelete={item === 'React' ? undefined : handleDelete(item)}
                                            />
                                        </ListItem>
                                    );
                                })}
                            </Paper>
                        </Grid>
                        <Grid container spacing={1} style={{ display: 'flex', alignItems: 'center' }}>
                            <Grid item md={6} style={{ marginTop: '2%' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker label="Deadline" onChange={handleDeadline} value={dayjs(deadline)} className={classes.roundedTextField} />
                                    </DemoContainer>
                                </LocalizationProvider>
                                <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: 0 }}>{getErrors.deadline}</p>
                            </Grid>
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

    const displayTasksListMobille = () => {
        return (
            taskList.map((item, i) => {

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
                                <MenuItem onClick={() => handleShareDialog(item)}><ShareIcon style={{ marginRight: '12%' }} /> Share</MenuItem>
                                <MenuItem onClick={() => handleDeleteTask(item)}><DeleteIcon style={{ marginRight: '12%' }} /> Delete</MenuItem>
                            </Menu>
                        </Grid>
                        <Grid item xs={10}>
                            <h3 style={{ margin: 0, fontWeight: 600, fontSize: 18 }}>{item.taskname.charAt(0).toUpperCase() + item.taskname.slice(1)}</h3>
                        </Grid>
                        <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontWeight: 500, fontSize: 15 }}>Category: {item.categoryData[0].categoryname.charAt(0).toUpperCase() + item.categoryData[0].categoryname.slice(1)}</h3>
                        </Grid>
                        <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                            <h3 style={{ margin: 0, fontWeight: 500, fontSize: 16, color: 'green' }}>Deadline: {formattedDate}</h3>
                        </Grid>
                        <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                            <div
                                style={{ cursor: 'pointer', padding: '3% 13%', background: '#ffeab8', borderRadius: 5, justifyContent: 'center', display: 'flex', alignItems: 'center' }}
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

    const displayTasksList = () => {
        return (
            taskList.map((item, i) => {

                var date = new Date(item.deadline);
                var month = date.getMonth()
                var day = date.getDate().toString().padStart(2, '0')
                var formattedDate = `${day} ${months[month].slice(0, 3)}`

                return (
                    <div style={{ width: '100%' }}>
                        <Grid container spacing={1} style={{ width: '100%', margin: '1% 0', padding: i % 2 == 0 ? '0.5% 1%' : '1%', borderRadius: 20, background: i % 2 == 0 ? 'transparent' : 'white', boxShadow: i % 2 == 0 ? 'none' : '0px 3px 15px #d9d9d9', display: 'flex', alignItems: 'center' }}>
                            <Grid item xs={1}>
                                <img src="http://localhost:3000/images/user-image.png" style={{ width: 30, height: 30 }} />
                            </Grid>
                            <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>{item.taskname.charAt(0).toUpperCase() + item.taskname.slice(1)}</h3>
                            </Grid>
                            <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>{item.categoryData[0].categoryname.charAt(0).toUpperCase() + item.categoryData[0].categoryname.slice(1)}</h3>
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
                                    <MenuItem onClick={() => handleShareDialog(item)}><ShareIcon style={{ marginRight: '12%' }} /> Share</MenuItem>
                                    <MenuItem onClick={() => handleDeleteTask(item)}><DeleteIcon style={{ marginRight: '12%' }} /> Delete</MenuItem>
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
            {editTaskDialog()}
            {shareDialogBox()}
            <div style={{ margin: matches_md ? '0 3%' : '7% 0 0', height: matches_md ? '100%' : '100vh' }}>
                <h3 style={{ margin: 0, fontWeight: 600, fontSize: 26 }}>Task List</h3><br />
                {
                    matches_md ? displayTasksListMobille() : displayTasksList()
                }
            </div>
        </div>
    )
}