import * as React from 'react';
import { Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { serverURL, postData } from "../../../Services/FetchNodeServices";
import Swal from 'sweetalert2'
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import RestoreIcon from '@mui/icons-material/Restore';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function TrashList() {

    var user = JSON.parse(localStorage.getItem("User"))
    const [userId, setUserId] = useState(user[0]._id)
    const classes = useStyles()
    const theme = useTheme()
    var navigate = useNavigate()
    const matches_md = useMediaQuery(theme.breakpoints.down('md'));
    const matches_sm = useMediaQuery(theme.breakpoints.down('sm'));
    const [trashTaskID, setTrashTaskId] = useState('')
    const [trashList, setTrashList] = useState([])
    const [restoreTask, setRestoreTask] = useState({})
    const [open, setOpen] = useState(false)
    const [chipData, setChipData] = useState([])
    const [file, setFile] = useState({ bytes: '', filename: '' })
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openOptions = Boolean(anchorEl);

    const handleClick = (event, item) => {
        setTrashTaskId(item._id)
        setRestoreTask(item)
        setChipData(item.tags.split(','))
        setAnchorEl(event.currentTarget);
    };

    const handleCloseOptions = () => {
        setAnchorEl(null);
    };

    useEffect(function () {
        fetchTrashTasks()
    }, [])

    const fetchTrashTasks = async () => {
        var body = { 'userid': userId }
        var response = await postData('trash/display_all_trash_task_by_user', body)
        setTrashList(response.data)
    }

    const handleDeleteTask = (rowData) => {
        setAnchorEl(null);
        Swal.fire({
            title: 'Do you want to delete the Task Permanently?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            denyButtonText: `Don't delete`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var body = { '_id': trashTaskID }
                var response = await postData('trash/delete-trash-task', body)
                fetchTrashTasks()
                Swal.fire('Task Deleted Permanently!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Task not Deleted', '', 'info')
            }
        })
    }

    var tagsString = chipData.join(',');

    const handleRestoreTask = (rowData) => {
        setAnchorEl(null);
        Swal.fire({
            title: 'Do you want to restore the Task?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Restore',
            denyButtonText: `Don't restore`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var body = { '_id': trashTaskID }
                var response = await postData('task/restore-task',
                    { 'taskname': restoreTask.taskname, 'description': restoreTask.description, 'deadline': restoreTask.deadline, 'category': restoreTask.category, 'tags': tagsString, 'file': restoreTask.file, 'userid': userId }
                )
                var responseTrash = await postData('trash/delete-trash-task', body)
                fetchTrashTasks()
                Swal.fire('Task restore Permanently!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Task not restore', '', 'info')
            }
        })
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

    const months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ]

    const displayTrashTasksListMobile = () => {
        return (
            trashList.map((item, i) => {

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
                                <MenuItem onClick={() => handleRestoreTask(item)}><RestoreIcon style={{ marginRight: '12%' }} /> Restore</MenuItem>
                                <MenuItem onClick={() => handleDeleteTask(item)}><DeleteIcon style={{ marginRight: '12%' }} /> Delete</MenuItem>
                            </Menu>
                        </Grid>
                        <Grid item xs={10}>
                            <h3 style={{ margin: 0, fontWeight: 600, fontSize: 18 }}>{item.taskname.charAt(0).toUpperCase() + item.taskname.slice(1)}</h3>
                        </Grid>
                        <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>Category: {item.categoryData[0].categoryname}</h3>
                        </Grid>
                        <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                            <h3 style={{ margin: 0, fontWeight: 500, fontSize: 16, color: 'green' }}>Deadline: {formattedDate}</h3>
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

    const displayTrashTaskList = () => {
        return (
            trashList.map((item, i) => {

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
                                    File <CloudDownloadIcon style={{ marginLeft: '3%', color: '#2c2c2c' }} />
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
                                    <MenuItem onClick={() => handleRestoreTask(item)}><RestoreIcon style={{ marginRight: '12%' }} /> Restore</MenuItem>
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
            <div style={{ margin: matches_md ? '0 3%' : '7% 0 0', height: matches_md ? '100%' : '100vh' }}>
                <h3 style={{ margin: 0, fontWeight: 600, fontSize: 26 }}>Trash Task List</h3><br />
                {
                    matches_md ? displayTrashTasksListMobile() : displayTrashTaskList()
                }
            </div>
        </div>
    )
}