import React, {useEffect, useState} from 'react';
import './App.css'
import {NavBar} from "./components/navbar/NavBar";
import {StartButton} from "./components/action/StartButton";
import {Box, createMuiTheme, Grid, ThemeProvider} from "@material-ui/core";
import {blue, cyan} from "@material-ui/core/colors";
import {LauncherProfile} from "./interfaces/LauncherAccount";
import {promisified} from "tauri/api/tauri";
import {readTextFile} from "tauri/api/fs";
import {Progress} from "./components/download/Progress";

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: cyan,
  },
});

// @ts-ignore

export const App = () => {
  const [profile, setProfile] = useState<LauncherProfile>({} as LauncherProfile);
  const [profiles, setProfiles] = useState<Array<LauncherProfile>>([]);
  const [skinRender, setSkinRender] = useState<any>();

  useEffect(() => {
    // @ts-ignore
    const skin = new SkinRender({canvas: {width: "500", height: "500"}}, document.getElementById("3d-skin"))
    if (profile?.minecraftProfile?.name) {
      skin.render(profile.minecraftProfile.name, () => {
        setSkinRender((prevState: any) => {
          if (prevState !== undefined) {
            prevState.style.display = 'none';
          }
          return skin._renderer.domElement
        });
        console.log("FINISHED")
      })
    }
  }, [profile?.minecraftProfile?.name])

  // @ts-ignore


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
      <Box height={"100%"}>
        <NavBar profile={profile} setProfile={setProfile}/>
        <Grid
          container
          direction="column"
          justify="space-around"
          alignItems="center">
          <Grid item xs={12} sm={6}>
            <Progress/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <StartButton profile={profile}/>
          </Grid>
          <Grid item xs={12} sm={6}>
          </Grid>
        </Grid>
        <div className={"yo"} id={"3d-skin"}/>
      </Box>
    </ThemeProvider>
  )
}