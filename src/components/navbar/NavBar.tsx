import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {Avatar, Box, Typography} from '@material-ui/core';
import {SwitchAccountMenu} from "./SwitchAccountMenu";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(1),
        },
        title: {
            flexGrow: 1,
        },
        avatar: {
            boxShadow: theme.shadows[3],
        },
        username: {
            marginRight: "0.5em",
        },
        toolbarButtons: {
            marginLeft: 'auto',
        },
    }),
);

export const NavBar = () => {
    const classes = useStyles();
    const [auth, setAuth] = React.useState(true);
    const [username, setUsername] = React.useState("NoRisk");
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon/>
                    </IconButton>
                    {auth && (
                        <div style={{display: "flex", alignItems: "center", marginLeft: "auto"}}>
                            <Typography variant={"h6"}>NoRisk</Typography>
                            <>
                                <IconButton
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit">
                                    <Avatar
                                        className={classes.avatar}
                                        variant={"square"} alt="Remy Sharp"
                                        src="https://crafatar.com/avatars/26a4fcde-de39-4ff0-8ea1-786582b7d8ee"/>
                                </IconButton>
                                <SwitchAccountMenu open={open} handleClose={handleClose} anchorEl={anchorEl}/>
                            </>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
}