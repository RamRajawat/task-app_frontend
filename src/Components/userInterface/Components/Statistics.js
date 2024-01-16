import React, { useRef } from 'react';
import { Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import { postData } from '../../../Services/FetchNodeServices';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ShareIcon from '@mui/icons-material/Share';
import ChecklistIcon from '@mui/icons-material/Checklist';
import DrawIcon from '@mui/icons-material/Draw';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function Statistics(props) {

    var navigate = useNavigate()
    var user = JSON.parse(localStorage.getItem("User"))
    const classes = useStyles()
    const theme = useTheme();
    const matches_md = useMediaQuery(theme.breakpoints.down('md'));
    const matches_sm = useMediaQuery(theme.breakpoints.down('sm'));
    const [userId, setUserId] = useState(user[0]._id)
    const [taskList, setTaskList] = useState([])
    const [assignedTask, setAssignedTask] = useState([])
    const [sharedTask, setSharedTask] = useState([])

    const fetchTasks = async () => {
        var body = { 'userid': userId }
        var response = await postData('task/display_all_task_by_user', body)
        setTaskList(response.data)
    }

    const fetchAssignedTask = async () => {
        var body = { 'sharedto': userId }
        var response = await postData('share/display_assigned_task_by_user', body)
        setAssignedTask(response.data)
    }

    const fetchSharedTask = async () => {
        var body = { 'sharedby': user[0].name }
        var response = await postData('share/display_shared_task_by_user', body)
        setSharedTask(response.data)
    }

    useEffect(function () {
        fetchTasks()
        fetchAssignedTask()
        fetchSharedTask()
    }, [])

    const statisticsItems = [
        {
            title: 'Your Task',
            length: taskList.length,
            icon: <ChecklistIcon style={{ position: 'absolute', width: 50, height: 50, opacity: '20%', top: '6%', right: '6%' }} />,
            bg: '#c6d0bc',
            link: '/dashboard/list'
        },
        {
            title: 'Shared Task',
            length: sharedTask.length,
            icon: <ShareIcon style={{ position: 'absolute', width: 50, height: 50, opacity: '20%', top: '6%', right: '6%' }} />,
            bg: '#f6d78b',
            link: '/dashboard/shared-tasks'
        },
        {
            title: 'Assigned Task',
            length: assignedTask.length,
            icon: <DrawIcon style={{ position: 'absolute', width: 50, height: 50, opacity: '20%', top: '6%', right: '6%' }} />,
            bg: '#a2a7fd',
            link: '/dashboard/assigned-tasks'
        }
    ]

    const handleClick = (item) => {
        navigate(item.link)
    }

    return (
        <div style={{ padding: 0, margin: '0 0 5%', height: '100%' }}>
            <Grid container spacing={1} style={{ width: '100%' }}>
                {
                    statisticsItems.map((item, i) => {
                        return (
                            <Grid item md={3} onClick={() => handleClick(item)} style={{ cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'start', background: item.bg, borderRadius: matches_md ? 15 : 30, padding: '4% 3%', flexDirection: 'column', marginRight: '2%', width: '100%', marginBottom: matches_md ? '3%' : 0 }}>
                                {item.icon}
                                <p>{item.title}</p>
                                <h3 style={{ fontWeight: 600, fontSize: 35, margin: 0 }}>{item.length}</h3>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </div >
    );
}
