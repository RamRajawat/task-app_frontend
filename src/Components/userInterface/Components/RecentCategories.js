import '../../../.././src/App.css'
import * as React from 'react';
import { useState, useEffect } from 'react';
import { postData } from '../../../Services/FetchNodeServices';
import { makeStyles } from '@material-ui/core/styles';
import EmptyPage from './EmptyPage';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function RecentCategories(props) {

    const classes = useStyles();
    const [state, setState] = useState({ right: false })
    const theme = useTheme();
    const matches_md = useMediaQuery(theme.breakpoints.down('md'));
    const matches_sm = useMediaQuery(theme.breakpoints.down('sm'));
    const [userId, setUserId] = useState(props.userid)
    const [databaseCategory, setDatabaseCategory] = useState([])

    const fetchCategories = async () => {
        var body = { 'userid': userId }
        var response = await postData('category/display_all_category_by_user', body)
        setDatabaseCategory(response.data)
    }

    useEffect(function () {
        fetchCategories()
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
            <div style={{ marginTop: matches_md ? '5%' : 0 }}>
                {
                    databaseCategory.length == 0 ?
                        <>
                            <EmptyPage title="You haven't added any Task" />
                        </>
                        :
                        <>
                            <Grid container spacing={1}>
                                {
                                    databaseCategory.slice(0, 3).map((item, i) => {
                                        return (
                                            <Grid item xs={matches_md ? 5 : 3} style={{
                                                width: '100%', background: 'white', boxShadow: '0px 10px 20px #d9d9d9', padding: matches_md ? '3%' : '2% ', borderRadius: matches_md ? 10 : 15, margin: '2% ', display: 'flex', justifyContent: 'left'
                                            }}>
                                                <h3 style={{ margin: 0, fontWeight: 500, fontSize: 18 }}>{item.categoryname}</h3>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </>
                }
            </div >
        )
    }
    // var date = new Date(item.deadline)

    return (
        <div style={{ width: '100%', marginTop: '5%' }}>
            <h3 style={{ margin: 0, fontWeight: 600, fontSize: 20 }}>Recently created categories</h3>
            {recentTasks()}
        </div>
    )
}