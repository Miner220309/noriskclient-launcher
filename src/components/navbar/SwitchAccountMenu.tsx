import React, {useEffect, useState} from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {Avatar} from "@material-ui/core";
import {readTextFile} from "tauri/api/fs";
import {promisified} from "tauri/api/tauri";
import {LauncherProfile} from "../interfaces/LauncherAccount";

interface ISwitchAccountMenu {
    open: boolean,
    handleClose: () => void,
    switchProfile: (profile: LauncherProfile) => void,
    anchorEl: HTMLElement | null;
}

export const SwitchAccountMenu = (props: ISwitchAccountMenu) => {
    const [accounts, setAccounts] = useState<Array<LauncherProfile>>();
    useEffect(() => {
        const fetchUserProfiles = async () => {
            const mcDir = await promisified({cmd: "minecraftDir"});
            const profiles = await readTextFile(`${mcDir}/launcher_accounts.json`);
            const profilesData = await JSON.parse(profiles);
            setAccounts(await Object.entries(profilesData.accounts).map(value => {
                return value[1] as LauncherProfile;
            }))
        }
        fetchUserProfiles();
    }, [])
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
            {accounts?.map(account => {
                return (
                    <MenuItem key={account.minecraftProfile.id} onClick={() => {
                        props.switchProfile(account);
                        props.handleClose();
                    }}>
                        <Avatar
                            variant={"square"} alt="Remy Sharp"
                            src={"https://crafatar.com/avatars/" + account.minecraftProfile.id}/>
                        <h1>{account.minecraftProfile.name}</h1>
                    </MenuItem>
                )
            })}
        </Menu>
    )
}