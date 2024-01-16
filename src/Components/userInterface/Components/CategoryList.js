import * as React from 'react';
import { Grid, TextField, Button, Avatar } from "@mui/material";
import { useState, useEffect } from "react";
import { postData } from "../../../Services/FetchNodeServices";
import Swal from 'sweetalert2'
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@mui/icons-material/Edit';
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

export default function CategoryList() {

    var user = JSON.parse(localStorage.getItem("User"))
    const [userId, setUserId] = useState(user[0]._id)
    const classes = useStyles();
    const theme = useTheme()
    var navigate = useNavigate()
    const matches_md = useMediaQuery(theme.breakpoints.down('md'));
    const matches_sm = useMediaQuery(theme.breakpoints.down('sm'));
    const [categoryId, setCategoryId] = useState('')
    const [description, setDescription] = useState('')
    const [categoryName, setCategoryName] = useState('')
    const [databaseCategory, setDatabaseCategory] = useState([])
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState('')
    const [getErrors, setErrors] = useState({})

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openOptions = Boolean(anchorEl);
    const handleClick = (event, item) => {
        setCategoryId(item._id)
        setCategoryName(item.categoryname)
        setDescription(item.description)
        setAnchorEl(event.currentTarget);
    };
    const handleCloseOptions = () => {
        setAnchorEl(null);
    };

    const fetchCategories = async () => {
        var body = { 'userid': userId }
        var response = await postData('category/display_all_category_by_user', body)
        setDatabaseCategory(response.data)
    }

    useEffect(function () {
        fetchCategories()
    }, [])

    const handleError = (error, label) => {
        setErrors((prev) => ({ ...prev, [label]: error }))
    }

    const validation = () => {
        var error = false
        if (categoryName.length === 0) {
            error = true
            handleError('Please enter Task Name', 'categoryName')
        }
        return error
    }

    const handleOpen = () => {
        setOpen(true)
        setAnchorEl(null);
        setAnchorEl(null);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdateCategory = () => {
        setAnchorEl(null);
        Swal.fire({
            title: 'Do you want to update the Category?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Update',
            denyButtonText: `Don't update`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var body = { '_id': categoryId, 'categoryname': categoryName, 'description': description }
                var response = await postData('category/update-category', body)
                fetchCategories()
                Swal.fire('Category Updated!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Category not updated', '', 'info')
            }
        })
    }

    const handleDelete = (rowData) => {
        Swal.fire({
            title: 'Do you want to delete the Category?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'delete',
            denyButtonText: `Don't delete`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var body = { '_id': categoryId }
                var response = await postData('category/delete-category', body)
                fetchCategories()
                Swal.fire('Category Deleted!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Category not Deleted', '', 'info')
            }
        })
    }

    const EditCategoryDialog = () => {
        return (
            <div>
                <Dialog fullWidth open={open}
                    onClose={handleClose}>
                    <DialogContent>
                        <DialogContentText>
                            {EditCategory()}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleUpdateCategory} variant='contained' style={{ width: 100, background: '#2C2C2C', padding: '1.5% 9%', margin: '0 1%', boxShadow: 'none' }}>
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

    const EditCategory = () => {
        return (
            <div>
                <Grid container spacing={1} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Grid item md={12} style={{ background: 'white', borderRadius: 30, width: '100%', padding: '4%' }}>
                        <Grid item md={12}>
                            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 23, color: 'black', opacity: '100%' }}>Edit Category :<font style={{ color: '#2C2C2C' }}> {categoryName} </font> </h2><br />
                        </Grid>
                        <Grid item md={12}>
                            <TextField
                                value={categoryName}
                                onFocus={() => handleError('', 'categoryName')}
                                error={getErrors.taskName}
                                helperText={getErrors.taskName}
                                onChange={(e) => setCategoryName(e.target.value)} label="Category name" variant="outlined" fullWidth className={classes.roundedTextField} />
                        </Grid>
                        <Grid item md={12} style={{ marginTop: '3%' }}>
                            <TextField
                                value={description}
                                onChange={(e) => setDescription(e.target.value)} label="Description" variant="outlined" fullWidth className={classes.roundedTextField} />
                        </Grid>
                    </Grid>
                </Grid>
            </div >
        )
    }

    const displayCategoryListMobile = () => {
        return (
            databaseCategory.map((item, i) => {
                return (
                    <Grid container spacing={1} style={{ position: 'relative', padding: '5% 3%', borderRadius: 15, background: i % 2 == 0 ? '#F1EEE4' : 'white', display: 'flex', alignItems: 'center', margin: '3% 0 6%', boxShadow: i % 2 == 0 ? 'none' : '0px 3px 20px #d9d9d9',  display: 'flex', alignItems: 'center'  }}>
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
                            <h3 style={{ margin: 0, fontWeight: 600, fontSize: 18 }}>{item.categoryname.charAt(0).toUpperCase() + item.categoryname.slice(1)}</h3>
                        </Grid>
                        <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>Description: {item.description}</h3>
                        </Grid>
                    </Grid>
                )
            })
        )
    }

    const displayCategoryList = () => {
        return (
            databaseCategory.map((item, i) => {
                return (
                    <div style={{ width: '100%' }}>
                        <Grid container spacing={1} style={{ width: '100%', margin: '1% 0', padding: i % 2 == 0 ? '0.5% 1%' : '1% 1%', borderRadius: 20, background: i % 2 == 0 ? 'transparent' : 'white', boxShadow: i % 2 == 0 ? 'none' : '0px 3px 15px #d9d9d9' }}>
                            <Grid item xs={1}>
                                <img src="http://localhost:3000/images/user-image.png" style={{ width: 30, height: 30 }} />
                            </Grid>
                            <Grid item xs={6} style={{ display: 'flex', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>{item.categoryname.charAt(0).toUpperCase() + item.categoryname.slice(1)}</h3>
                            </Grid>
                            <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>{item.description}</h3>
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
            {EditCategoryDialog()}
            <div style={{ margin: matches_md ? '0 3%' : '7% 0 0', height: matches_md ? '100%' : '100vh' }}>
                <h3 style={{ margin: 0, fontWeight: 600, fontSize: 26 }}>Category List</h3><br />
                {
                    matches_md ? displayCategoryListMobile() : displayCategoryList()
                }
            </div>
        </div>
    )
}