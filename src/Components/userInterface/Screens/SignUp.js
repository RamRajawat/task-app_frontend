import * as React from 'react';
import { Typography } from '@material-ui/core';
import { Grid, TextField, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Swal from 'sweetalert2'
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { postData } from '../../../Services/FetchNodeServices';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function SignUp() {

    var navigate = useNavigate()
    const classes = useStyles();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [getErrors, setErrors] = useState('')
    const [name, setName] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const handleClickShowPassword = () => setShowPassword((show) => !show)
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
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

    const handleCreateAccount = async () => {
        var error = validation()
        if (error === false) {
            var body = { 'name': name, 'email': email, 'password': password }
            var response = await postData('user/create-account', body)
            if (response.status === true) {
                localStorage.setItem('User', JSON.stringify(response.data))
                Swal.fire({
                    icon: 'success',
                    toast: true,
                    timer: 2000,
                    title: 'Account created!'
                })
                navigate('/dashboard')
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Account not created!'
                })
            }
        }
    }

    const adminFormGrid = {
        backgroundColor: '#F1EEE4',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%'
    };

    const loginForm = {
        width: '50%',
        margin: 'auto',
        padding: '6% 3%',
        borderRadius: '15px',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        boxShadow: 'rgba(159, 162, 191, 0.18) 0px 9px 16px, rgba(159, 162, 191, 0.32) 0px 0px',
    }

    return (
        <div className='root' style={{ height: '100%' }}>
            <Grid container spacing={5} style={{ margin: 0 }}>
                <Grid item md={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5%', background: '#2c2c2c', color: 'white' }}>
                    <Grid container spacing={3}>
                        <Grid item md={12} style={{ marginTop: '5%' }}>
                            <img src='/images/login-image.png' style={{ width: '100%' }} />
                            <Typography style={{ fontWeight: '600', fontSize: 26 }}>Create account & manage Tasks easily</Typography>
                            <p style={{ marginTop: '6%', opacity: '70%', fontSize: '14px' }}>Choose between JSON Web Token, Firebase, AWS Amplify or Auth0. Regular login/register functionality is also available.</p>
                            <Typography style={{ marginTop: '15%', fontWeight: '600', fontSize: '16px' }}>Want to switch auth methods?</Typography>
                            <p style={{ marginTop: '2%', opacity: '70%', fontSize: '14px' }}>It only takes seconds. There is a documentation section showing how to do exactly that. Read docs</p>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={8} style={adminFormGrid}>
                    <Grid container spacing={3} style={loginForm}>
                        <Grid item md={12} style={{ padding: 0 }}>
                            <Typography style={{
                                fontSize: '26px',
                                fontWeight: '600',
                                marginBottom: '0',
                                textAlign: 'center'
                            }}>Sign up</Typography>
                            <p style={{ marginBottom: '4%', textAlign: 'center', opacity: '70%' }}>Fill in the fields below to create your account.</p><br />
                        </Grid>
                        <Grid item md={12} style={{ padding: 0 }}>
                            <TextField
                                error={getErrors.name}
                                helperText={getErrors.name}
                                onFocus={() => handleError('', 'name')}
                                label='Name' variant='outlined' fullWidth className={classes.roundedTextField} onChange={(event) => setName(event.target.value)} />
                        </Grid>
                        <Grid item md={12} style={{ padding: 0, marginTop: '5%' }}>
                            <TextField
                                error={getErrors.email}
                                helperText={getErrors.email}
                                onFocus={() => handleError('', 'email')}
                                label='Email' variant='outlined' fullWidth className={classes.roundedTextField} onChange={(event) => setEmail(event.target.value)} />
                        </Grid>
                        <Grid item md={12} style={{ padding: 0, marginTop: '5%' }}>
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
                        <Grid item md={12} style={{ padding: 0, marginTop: '3%' }}>
                            <div>
                                <Checkbox {...label} defaultChecked style={{ paddingLeft: 0 }} />
                                <font style={{ fontSize: '15px', opacity: '80%' }}>I accept the <font style={{ color: '#2c2c2c' }}>terms and conditions.</font></font>
                            </div>
                        </Grid>
                        <Grid item md={12} variant='contained' style={{ padding: 0, marginTop: '4%' }}>
                            <Button
                                onClick={handleCreateAccount}
                                fullWidth style={{
                                    background: '#2c2c2c',
                                    color: 'white',
                                    borderRadius: '15px',
                                    padding: '2% 0',
                                    fontSize: '18px',
                                    fontWeight: '600'
                                }}>Sign up</Button>
                        </Grid>
                        <Grid item md={8} style={{ padding: 0, marginTop: '6%', fontWeight: '600', cursor: 'pointer' }} onClick={() => navigate('/login')}>
                            <font style={{ fontSize: '15px', opacity: '80%' }}>Already have an account <font style={{ color: '#2c2c2c' }}>sign in here</font></font>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div >
    )

}