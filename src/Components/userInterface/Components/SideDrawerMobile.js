import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import SideDrawer from './SideDrawer';
import CloseIcon from '@mui/icons-material/Close';

export default function SideDrawerMobile(props) {

    const [state, setState] = React.useState({ right: false })
    var user = JSON.parse(localStorage.getItem("User"))

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            style={{ width: 350, position: 'relative' }}
            role="presentation"
            onKeyDown={(event) => {
                if (event.key === 'Escape') {
                    toggleDrawer(anchor, false)(event);
                }
            }}
        >
            <CloseIcon onClick={toggleDrawer('right', false)} style={{ position: 'absolute', right: '2%', top: '1%', cursor: 'pointer', opacity: '70%' }} />
            <SideDrawer name={user[0].name} email={user[0].email} password={user[0].password} userid={user[0]._id} />
        </Box>
    );


    return (
        <div>
            <React.Fragment key={'right'}>
                <img onClick={toggleDrawer('right', true)} src='/images/user-image.png' style={{ width: 50, height: 50, borderRadius: '50%', marginRight: '6%', cursor: 'pointer' }} />
                <Drawer
                    anchor={'right'}
                    open={state['right']}
                    onClose={toggleDrawer('right', false)}
                >
                    {list('right')}
                </Drawer>
            </React.Fragment>
        </div>
    );
}