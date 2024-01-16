import React, { useRef } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import { postData, getData } from '../../../Services/FetchNodeServices';
import Swal from 'sweetalert2';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AppCalendar from './AppCalendar';
import AttachmentIcon from '@mui/icons-material/Attachment';
import Statistics from './Statistics';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function CreateTask(props) {

    var user = JSON.parse(localStorage.getItem("User"))
    const classes = useStyles()
    const theme = useTheme();
    const matches_md = useMediaQuery(theme.breakpoints.down('md'));
    const matches_sm = useMediaQuery(theme.breakpoints.down('sm'));
    const [userId, setUserId] = useState(user[0]._id)
    const [taskName, setTaskName] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState('')
    const [category, setCategory] = useState('')
    const [tags, setTags] = useState('')
    const [chipData, setChipData] = useState([]);
    const [getErrors, setErrors] = useState('')
    const [file, setFile] = useState({ bytes: '', filename: '' })
    const [databaseCategory, SetDatabaseCategory] = useState([])

    const fetchCategories = async () => {
        var body = { 'userid': userId }
        var response = await postData('category/display_all_category_by_user', body)
        SetDatabaseCategory(response.data)
    }

    useEffect(function () {
        fetchCategories()
    }, [])

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

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    }

    const handleTagsInputChange = (event) => {
        setTags(event.target.value);
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

    const handleFile = (event) => {
        setFile({ bytes: event.target.files[0], filename: URL.createObjectURL(event.target.files[0]) })
    }

    const handleCreateTask = async () => {
        var error = validation()
        if (error === false) {
            var formData = new FormData()
            formData.append('userid', userId)
            formData.append('taskname', taskName)
            formData.append('description', description)
            formData.append('category', category)
            formData.append('tags', tagsString)
            formData.append('deadline', deadline)
            formData.append('file', file.bytes)
            var response = await postData('task/create-task', formData)
            if (response.status === true) {
                Swal.fire({
                    icon: 'success',
                    toast: true,
                    title: 'Task added!'
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Task not added!'
                })
            }
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

    return (
        <div style={{ padding: matches_md ? '1% 0 0 1%' : '1.5%', margin: matches_md ? '0 3%' : 0, height: matches_md ? '100%' : '100vh', width: '100%' }}>
            <div style={{ width: '100%' }}>
                <Statistics />
            </div>
            <Grid container spacing={2} style={{ display: 'flex', alignItems: 'start', width: '100%', marginTop: matches_md ? '5%' : 0, justifyContent: 'center' }}>
                <Grid item md={7} style={{ boxShadow: '0px 5px 20px #d9d9d9', width: '100%', background: 'white', borderRadius: matches_md ? 20 : 30, padding: matches_md ? '6%' : '4%', margin: 0 }}>
                    <Grid item md={12}>
                        <h2 style={{ margin: 0, fontWeight: 600, fontSize: 23 }}>Create Task</h2><br />
                    </Grid>
                    <Grid item md={12}>
                        <TextField
                            onFocus={() => handleError('', 'taskName')}
                            error={getErrors.taskName}
                            helperText={getErrors.taskName}
                            onChange={(e) => setTaskName(e.target.value)} label="Task name" variant="outlined" fullWidth className={classes.roundedTextField} />
                    </Grid>
                    <Grid item md={12} style={{ marginTop: '3%' }}>
                        <TextField
                            onChange={(e) => setDescription(e.target.value)} label="Description" variant="outlined" fullWidth className={classes.roundedTextField} />
                    </Grid>
                    <Grid item md={12} style={{ marginTop: '3%' }}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
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
                            <Grid item xs={6}>
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
                        </Grid>
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: '2%', display: 'flex', width: '100%', gap: '3%', alignItems: 'center' }}>
                        <div style={{ width: matches_md ? '100%' : '50%' }}>
                            <Button
                                onChange={handleFile}
                                fullWidth component='label'
                                style={{
                                    border: '2px dotted gainsboro',
                                    fontWeight: '500',
                                    color: 'gray',
                                    padding: '3% 0'
                                }}>
                                <input type='file' hidden accept='*/*' />
                                <AttachmentIcon style={{ marginRight: '2%' }} />
                                Attach File
                            </Button>
                        </div>
                        <div style={{ width: '70%' }}>
                            <p style={{ color: '#53569A', fontWeight: 500 }}>{file.bytes.name}</p>
                        </div>
                    </Grid>
                    <Grid item md={9} style={{ marginTop: '2%' }}>
                        <Button onClick={handleCreateTask} variant='contained' style={{ width: 100, background: '#2c2c2c', padding: '3% 9%', margin: '5% 2% 0', boxShadow: 'none' }}>
                            ADD
                        </Button>
                        <Button onClick={handleCreateTask} variant='outlined' style={{ width: 100, background: 'white', padding: '3% 9%', margin: '5% 2% 0', boxShadow: 'none', border: '1px solid #2C2C2C', color: '#2C2C2C' }}>
                            CANCEL
                        </Button>
                    </Grid>
                </Grid>
                <Grid item md={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'start', height: '100%', flexDirection: 'column', width: '100%' }}>
                    <AppCalendar deadline={deadline} setDeadline={setDeadline} />
                    <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: 0 }}>{getErrors.deadline}</p>
                </Grid>
            </Grid>
        </div >
    );
}
