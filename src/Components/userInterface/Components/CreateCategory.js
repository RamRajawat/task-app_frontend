import React, { useRef } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import { useState } from 'react';
import { postData } from '../../../Services/FetchNodeServices';
import Swal from 'sweetalert2';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import RecentCategories from './RecentCategories';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function CreateCategory() {

    var user = JSON.parse(localStorage.getItem("User"))
    const theme = useTheme();
    const matches_md = useMediaQuery(theme.breakpoints.down('md'));
    const matches_sm = useMediaQuery(theme.breakpoints.down('sm'));
    const [userId, setUserId] = useState(user[0]._id)
    const classes = useStyles();
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [getErrors, setErrors] = useState('')

    const handleError = (error, label) => {
        setErrors((prev) => ({ ...prev, [label]: error }))
    }

    const validation = () => {
        var error = false
        if (category.length === 0) {
            error = true
            handleError('Please enter Categpry', 'category')
        }
        return error
    }

    const handleCreateCategory = async () => {
        var error = validation()
        if (error === false) {
            var body = { 'categoryname': category, 'description': description, 'userid': userId }
            var response = await postData('category/create-category', body)
            if (response.status === true) {
                Swal.fire({
                    icon: 'success',
                    toast: true,
                    title: 'Category Created!'
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Category not Created!'
                })
            }
        }
    }

    const handleReset = () => {
        setCategory('')
        setDescription('')
    }

    return (
        <div style={{ padding: '2%', margin: matches_md ? '0 3%' : '7% 0 0', height: '100vh' }}>
            <Grid container spacing={1} style={{ display: 'flex', alignItems: 'center' }}>
                <Grid item md={7} style={{ boxShadow: '0px 5px 20px #d9d9d9', background: 'white', borderRadius: matches_md ? 20 : 25, width: '100%', padding: matches_md ? '6%' : '4%' }}>
                    <Grid item md={12}>
                        <h2 style={{ margin: 0, fontWeight: 600, fontSize: 23 }}>Create Category</h2><br />
                    </Grid>
                    <Grid item md={12}>
                        <TextField
                            onFocus={() => handleError('', 'category')}
                            error={getErrors.category}
                            helperText={getErrors.category}
                            onChange={(e) => setCategory(e.target.value)} label="Category name" variant="outlined" fullWidth className={classes.roundedTextField} />
                    </Grid>
                    <Grid item md={12} style={{ marginTop: '3%' }}>
                        <TextField
                            onChange={(e) => setDescription(e.target.value)} label="Description" variant="outlined" fullWidth className={classes.roundedTextField} />
                    </Grid>
                    <Grid item md={7} style={{ marginTop: '2%' }}>
                        <Button onClick={handleCreateCategory} variant='contained' style={{ width: 100, background: '#2C2C2C', padding: '3% 9%', margin: '5% 2% 0', boxShadow: 'none' }}>
                            ADD
                        </Button>
                        <Button onClick={handleReset} variant='outlined' style={{ width: 100, background: 'white', padding: '3% 9%', margin: '5% 2% 0', boxShadow: 'none', border: '1px solid #2C2C2C', color: '#2C2C2C' }}>
                            CANCEL
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={1} style={{ display: 'flex', alignItems: 'start' }}>
                <Grid item md={12} style={{ marginTop: '3%' }}>
                    <RecentCategories userid={userId} />
                </Grid>
            </Grid>
        </div >
    );
}
