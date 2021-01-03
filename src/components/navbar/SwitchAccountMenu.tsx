import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {Avatar} from "@material-ui/core";
import {testAccounts} from "../Utils";

interface ISwitchAccountMenu {
    open: boolean,
    handleClose: () => void
    anchorEl: HTMLElement | null;
}

export const SwitchAccountMenu = (props: ISwitchAccountMenu) => {
    return (
        <Menu
            id="menu-appbar"
            anchorEl={props.anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={props.open}
            onClose={props.handleClose}>
            {testAccounts.map(value => {
                return (
                    <MenuItem key={value.uuid} onClick={props.handleClose}>
                        <Avatar
                            variant={"square"} alt="Remy Sharp"
                            src={"https://crafatar.com/avatars/" + value.uuid}/>
                            <h1>{value.username}</h1>
                    </MenuItem>
                )
            })}
        </Menu>
    )
}