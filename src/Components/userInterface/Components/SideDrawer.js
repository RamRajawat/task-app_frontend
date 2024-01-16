import '../../../.././src/App.css'
import * as React from 'react';
import { Grid, Button, TextField } from "@mui/material";
import { useState, useEffect } from 'react';
import { postData } from '../../../Services/FetchNodeServices';
import { makeStyles } from '@material-ui/core/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Swal from 'sweetalert2'
import EmptyPage from './EmptyPage';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import RecentAssignedTasks from './RecentAssignedTasks';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function SideDrawer(props) {

    var navigate = useNavigate()
    const classes = useStyles()
    const theme = useTheme();
    const matches_md = useMediaQuery(theme.breakpoints.down('md'));
    const matches_sm = useMediaQuery(theme.breakpoints.down('sm'));
    const [userId, setUserId] = useState(props.userid)
    const [name, setName] = useState(props.name)
    const [email, setEmail] = useState(props.email)
    const [password, setPassword] = useState(props.password)
    const [taskList, setTaskList] = useState([])
    const [getErrors, setErrors] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const handleClickShowPassword = () => setShowPassword((show) => !show)
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    }

    const handleLogout = () => {
        localStorage.clear()
        navigate('/login')
    }

    const handleError = (error, label) => {
        setErrors((prev) => ({ ...prev, [label]: error }))
    }

    const validation = () => {
        var error = false
        if (name.length === 0) {
            error = true
            handleError('Please enter name', 'name')
        }
        if (email.length === 0) {
            error = true
            handleError('Please enter email', 'email')
        }
        if (password.length === 0) {
            error = true
            handleError('Please enter password', 'password')
        }
        return error
    }

    const fetchTasks = async () => {
        var body = { 'userid': userId }
        var response = await postData('task/display_all_task_by_user', body)
        setTaskList(response.data)
    }

    useEffect(function () {
        fetchTasks()
    }, [])

    const handleUpdateAccount = async () => {
        var error = validation()
        if (error === false) {
            var body = { '_id': userId, 'name': name, 'email': email, 'password': password }
            var response = await postData('user/update-account', body)
            if (response.status === true) {
                fetchTasks()
                Swal.fire({
                    icon: 'success',
                    toast: true,
                    title: 'Profile update!'
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Profile not created!'
                })
            }
        }
    }

    const sideDrawerComponent = () => {
        return (
            <div
                style={{ width: '100%', height: '100%' }} >
                <Grid container spacing={1} style={{ padding: '10%', display: 'flex', justifyContent: 'center' }}>
                    <h2 style={{ margin: 0, fontWeight: 600, fontSize: 25 }}>My Profile</h2>
                    <Grid item xs={12} style={{ marginTop: '8%' }}>
                        <center>
                            <img className='profileImg' src='/images/user-image.png' style={{ width: 100, height: 100, borderRadius: '50%', cursor: 'pointer' }} />
                            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 20 }}>{props.name}</h2>
                            <p style={{ padding: 0, fontWeight: 600, color: '#F6D78B', fontSize: 14 }}>{props.email}</p>
                            <div style={{ marginTop: '10%', width: '100%' }}>
                                {editUser()}
                            </div>
                        </center>
                    </Grid>
                </Grid>
            </div>
        )
    }

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
            <div style={{ background: '#f1eee4', padding: '5%' }}>
                <h3 style={{ margin: 0, fontWeight: 600, fontSize: 20, textAlign: 'left' }}>Most Recent Tasks</h3>
                {
                    taskList.length == 0 ?
                        <>
                            <EmptyPage title="You haven't added any Task" />
                        </>
                        :
                        <>
                            {
                                taskList.slice(0, 2).map((item, i) => {

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
            </div >
        )
    }

    const editUser = () => {
        return (
            <div style={{ width: '100%' }}>
                <Grid container spacing={1} style={{ width: '100%' }}>
                    <Grid item xs={12} style={{ padding: 0 }}>
                        <TextField
                            value={name}
                            error={getErrors.name}
                            helperText={getErrors.name}
                            onFocus={() => handleError('', 'name')}
                            label='Name' variant='outlined' fullWidth className={classes.roundedTextField} onChange={(event) => setName(event.target.value)} />
                    </Grid>
                    <Grid item xs={12} style={{ padding: 0, marginTop: '5%' }}>
                        <TextField
                            value={email}
                            error={getErrors.email}
                            helperText={getErrors.email}
                            onFocus={() => handleError('', 'email')}
                            label='Email' variant='outlined' fullWidth className={classes.roundedTextField} onChange={(event) => setEmail(event.target.value)} />
                    </Grid>
                    <Grid item xs={12} style={{ padding: 0, marginTop: '5%' }}>
                        <FormControl fullWidth variant="outlined" className={classes.roundedTextField}>
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                error={getErrors.password}
                                onFocus={() => handleError('', 'password')}
                                onChange={(event) => setPassword(event.target.value)}
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>
                        <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: '0' }}>{getErrors.password}</p>
                    </Grid>
                    <Grid item xs={12} variant='contained' style={{ padding: 0, marginTop: '4%' }}>
                        <Button
                            onClick={handleUpdateAccount}
                            fullWidth style={{
                                background: '#2c2c2c',
                                color: 'white',
                                borderRadius: '15px',
                                padding: '2% 0',
                                fontSize: '18px',
                                fontWeight: '600'
                            }}>Update Profile</Button>
                    </Grid>
                </Grid>

            </div>
        )
    }

    return (
        <div style={{ width: '100%' }}>
            {sideDrawerComponent()}
            <div style={{ width: '100%' }}>
                {recentTasks()}
            </div>
            <div style={{ width: '100%' }}>
                <RecentAssignedTasks userid={userId} />
            </div>
            <div onClick={handleLogout} style={{ paddingBottom: '8%', cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'left', alignItems: 'center', color: '#ff6666', background: '#F1EEE4' }}>
                <div style={{ marginLeft: '5%', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Logout />
                    <h3 style={{ fontWeight: 500, fontSize: 20, marginLeft: '3%' }}>Logout</h3>
                </div>
            </div>
        </div>
    )
}