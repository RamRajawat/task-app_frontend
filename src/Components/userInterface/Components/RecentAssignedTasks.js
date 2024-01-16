import '../../../.././src/App.css'
import * as React from 'react';
import { useState, useEffect } from 'react';
import { postData } from '../../../Services/FetchNodeServices';
import { makeStyles } from '@material-ui/core/styles';
import EmptyPage from './EmptyPage';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function RecentAssignedTasks(props) {

    var navigate = useNavigate()
    const classes = useStyles();
    const theme = useTheme();
    const matches_md = useMediaQuery(theme.breakpoints.down('md'));
    const matches_sm = useMediaQuery(theme.breakpoints.down('sm'));
    const [userId, setUserId] = useState(props.userid)
    const [assignedTask, setAssignedTask] = useState([])

    const fetchAssignedTask = async () => {
        var body = { 'sharedto': userId }
        var response = await postData('share/display_assigned_task_by_user', body)
        setAssignedTask(response.data)
    }

    useEffect(function () {
        fetchAssignedTask()
    }, [])

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    const recentTasks = () => {
        return (
            <div style={{padding: '5%'}}>
                <h3 style={{ margin: 0, fontWeight: 600, fontSize: 20 }}>Task you have been Assigned</h3>
                {
                    assignedTask.length == 0 ?
                        <>
                            <EmptyPage title="You haven't added any Task" />
                        </>
                        :
                        <>
                            {
                                assignedTask.slice(0, 2).map((item, i) => {

                                    var date = new Date(item.deadline)
                                    var year = date.getFullYear()
                                    var month = date.getMonth() + 1
                                    var day = date.getDate()

                                    return (
                                        <div style={{ background: 'white', padding: '6% 5%', boxShadow: '0px 10px 20px #d9d9d9', borderRadius: 25, margin: '3% 0', display: 'flex', justifyContent: 'left', flexDirection: 'column', textAlign: 'left' }}>
                                            <h3 style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>{item.taskname}</h3>
                                            <p style={{ padding: 0, fontWeight: 600, fontSize: 14, color: 'black', opacity: '50%' }}>Deadline - {`${months[month - 1]} ${day}, ${year}`}</p>
                                        </div>
                                    )
                                })
                            }
                        </>
                }
            </div>
        )
    }

    return (
        <div style={{ width: '100%', background: '#F1EEE4' }}>
            {recentTasks()}
        </div>
    )
}