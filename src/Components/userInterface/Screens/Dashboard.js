import '../../../.././src/App.css'
import * as React from 'react';
import { Grid, Button, TextField, Box } from "@mui/material";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import PushPinIcon from '@mui/icons-material/PushPin';
import ListIcon from '@mui/icons-material/List';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateTask from '../Components/CreateTask'
import CategoryIcon from '@mui/icons-material/Category';
import CreateCategory from '../Components/CreateCategory';
import TaskList from '../Components/TaskList';
import CategoryList from '../Components/CategoryList';
import SideDrawer from '../Components/SideDrawer';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import AssignedTasks from '../Components/AssignedTasks';
import ShareIcon from '@mui/icons-material/Share';
import SharedTasks from '../Components/SharedTasks';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import TrashList from '../Components/TrashList';
import SideDrawerMobile from '../Components/SideDrawerMobile';

const useStylesTextField = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 15
        },
    },
}))

export default function Dashboard(props) {

    var user = JSON.parse(localStorage.getItem("User"))
    var navigate = useNavigate()
    const theme = useTheme();
    const matches_md = useMediaQuery(theme.breakpoints.down('md'));
    const matches_sm = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStylesTextField()

    const checkUser = () => {
        try {
            var userData = JSON.parse(localStorage.getItem('User'))
            if (userData == null) {
                return false
            }
            else {
                return userData
            }
        }
        catch (e) {
            return false
        }
    }

    const [selectedItemIndex, setSelectedItemIndex] = useState('')
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    };
    const handleClose = () => {
        setAnchorEl(null)
    }

    useEffect(() => {
        setSelectedItemIndex(0)
    }, [])

    const listItems = [
        {
            icon: <PushPinIcon />,
            title: 'Add Task',
            link: '/dashboard'
        },
        {
            icon: <ListIcon />,
            title: 'Task List',
            link: '/dashboard/list'
        },
        {
            icon: <CategoryIcon />,
            title: 'Category',
            link: '/dashboard/category'
        },
        {
            icon: <ListIcon />,
            title: 'Category List',
            link: '/dashboard/category-list'
        },
        {
            icon: <MarkUnreadChatAltIcon />,
            title: 'Assigned Tasks',
            link: '/dashboard/assigned-tasks'
        },
        {
            icon: <ShareIcon />,
            title: 'Shared Tasks',
            link: '/dashboard/shared-tasks'
        },
        {
            icon: <AutoDeleteIcon />,
            title: 'Trash',
            link: '/dashboard/deleted-tasks'
        }
    ]

    return (
        <div className='root' style={{ height: '100%' }}>
            <Grid container spacing={1} style={{ width: '100%', margin: 0, height: '100%' }}>
                <Grid item xs={2}
                    style={{
                        padding: '3% 1% 3% 0',
                        color: 'black',
                        height: '100vh',
                        background: '#2c2c2c',
                        position: 'sticky',
                        top: 0
                    }}
                >
                    <Grid style={{ background: '#f1f1f1', color: 'black', borderRadius: '10px', display: "flex", justifyContent: matches_md ? "center" : "left", alignItems: 'center', padding: '3%', marginLeft: '5%' }}>
                        {
                            matches_md ?
                                <>
                                    <SideDrawerMobile userid={user[0]._id}/>
                                </> : <>
                                    <img src='/images/user-image.png' style={{ width: 50, height: 50, borderRadius: '50%', marginRight: '6%' }} />
                                    <div>
                                        <div style={{ fontSize: '16px', fontWeight: '500', padding: 0, margin: 0 }}>{user[0]?.name}</div>
                                        <div style={{ fontSize: '11px', fontWeight: '500', opacity: '70%', padding: 0, margin: 0 }}>{user[0]?.email}</div>
                                    </div>
                                </>
                        }
                    </Grid>

                    <Grid style={{ marginTop: '20%' }}>
                        <List sx={{ width: '100%', maxWidth: 360 }} component="nav">
                            {listItems.map((item, i) => {
                                var handleListItem = (i) => {
                                    navigate(item.link);
                                    window.scrollTo(0, 0)
                                    setSelectedItemIndex(i);
                                }
                                return (
                                    <div>
                                        <ListItemButton
                                            key={i}
                                            onClick={() => handleListItem(i)}
                                            style={{
                                                margin: '6% 0',
                                                color: selectedItemIndex === i ? 'white' : 'black',
                                                borderLeft: selectedItemIndex === i ? '3px solid #f6d78b' : 'none'
                                            }}
                                        >
                                            <ListItemIcon style={{ color: selectedItemIndex === i ? '#A2A7FD' : 'white', opacity: '100%', fontSize: '15px', opacity: selectedItemIndex === i ? '100%' : '75%' }}>
                                                {item.icon}
                                            </ListItemIcon>
                                            {
                                                matches_md ?
                                                    <></>
                                                    :
                                                    <><p style={{ margin: 0, opacity: '100%', fontSize: '15px', color: selectedItemIndex === i ? '#f6d78b' : 'white' }}>{item.title}</p>
                                                    </>
                                            }
                                        </ListItemButton>
                                    </div>
                                );
                            })}
                        </List>
                    </Grid>
                </Grid>

                <Grid item xs={matches_md ? 10 : 7} style={{ padding: '2% 1.5%', height: '100%', background: '#f8f7f1', width: '100%', position: 'sticky', top: 0 }}>
                    <Grid container spacing={1} style={{ zIndex: 99, width: '100%', padding: 0, marginBottom: matches_md ? '10%' : 0 }}>
                        <Grid item xs={matches_md ? 9 : 10}>
                            <h3 style={{ fontWeight: '600', fontSize: matches_md ? 20 : 25, textAlign: 'left', margin: 0, marginLeft: '3%' }}>Hi, Welcome back {user[0]?.name} 👋</h3>
                        </Grid>
                        <Grid item xs={matches_md ? 3 : 2} style={{ display: "flex", justifyContent: "center", alignItems: 'center' }}>
                            <Badge showZero variant="dot" color="error" style={{ marginRight: matches_md ? '20%' : '10%', marginLeft: 'auto' }}>
                                <NotificationsIcon onClick={() => navigate('/dashboard/assigned-tasks')} color="action" style={{ cursor: 'pointer', width: 30, height: 30 }} />
                            </Badge>
                        </Grid>
                    </Grid>

                    <Grid container spacing={1}
                        style={{
                            height: '100%',
                            width: '100%',
                            marginTop: '2%'
                        }} >
                        <Grid item xs={12} style={{
                            height: '100%', width: '100%'
                        }}>
                            <Routes>
                                <Route element={<CreateTask />} path='/' />
                                <Route element={<CreateCategory />} path="/category" />
                                <Route element={<TaskList />} path="/list" />
                                <Route element={<CategoryList />} path="/category-list" />
                                <Route element={<AssignedTasks />} path="/assigned-tasks" />
                                <Route element={<SharedTasks />} path="/shared-tasks" />
                                <Route element={<TrashList />} path="/deleted-tasks" />
                            </Routes>
                        </Grid>
                    </Grid>
                </Grid>
                {
                    matches_md ? <></> :
                        <Grid item xs={3} style={{ padding: 0, height: '100%', background: 'white', width: '100%' }}>
                            <SideDrawer name={user[0].name} email={user[0].email} password={user[0].password} userid={user[0]._id} />
                        </Grid>
                }
            </Grid>
        </div>
    )
}