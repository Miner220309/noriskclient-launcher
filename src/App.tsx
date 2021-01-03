import React, {useEffect, useState} from 'react';
import './App.css'
import {NavBar} from "./components/navbar/NavBar";
import {StartButton} from "./components/action/StartButton";
import {Box, createMuiTheme, ThemeProvider} from "@material-ui/core";
import {blue, cyan} from "@material-ui/core/colors";
import {LauncherProfile} from "./components/interfaces/LauncherAccount";
import {promisified} from "tauri/api/tauri";
import {readTextFile} from "tauri/api/fs";

const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: cyan,
    },
});

export const App = () => {
    const [profile, setProfile] = useState<LauncherProfile>({} as LauncherProfile);
    const [profiles, setProfiles] = useState<Array<LauncherProfile>>([]);

    const switchProfile = () => {

    }

    useEffect(() => {
        const fetchUserProfiles = async () => {
            const mcDir = await promisified({cmd: "minecraftDir"});
            const profiles = await readTextFile(`${mcDir}/launcher_accounts.json`);
            const profilesData = await JSON.parse(profiles);
            setProfiles(await Object.entries(profilesData.accounts).map(value => {
                if (value[0] === profilesData.activeAccountLocalId) {
                    setProfile(value[1] as LauncherProfile);
                }
                return value[1] as LauncherProfile;
            }))
        }
        fetchUserProfiles();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Box bgcolor={cyan} height={"100%"}>
                <NavBar profile={profile} setProfile={setProfile}/>
                <Box height={"auto"}>
                    <StartButton/>
                </Box>
            </Box>
        </ThemeProvider>
    )
}