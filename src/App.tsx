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
import {VersionButton} from "./components/action/VersionButton";
import {Version} from "./interfaces/Version";
import {MCVersions} from "./components/menu/SwitchVersion";

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
  const [version, setVersion] = useState<Version>(MCVersions[2]);
  const [skinRender, setSkinRender] = useState<any>();

  useEffect(() => {
    // @ts-ignore
    const skin = new SkinRender({canvas: {width: "500", height: "500"}}, document.getElementById("3d-skin"))
    if (profile?.minecraftProfile?.name) {
      console.log(skin)
      skin.render(profile.minecraftProfile.name, () => {
        setSkinRender((prevState: any) => {
          if (prevState !== undefined) {
            prevState.style.display = 'none';
          }
          setInterval(() => {
            skin.playerModel.rotation.y += 0.01;
          }, 10)
          console.log(skin.playerModel)
          return skin._renderer.domElement
        });

        console.log(skinRender)
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
        <div className={"yo"} id={"3d-skin"}/>
        <Grid
          container
          direction="column"
          justify="space-around"
          alignItems="center">
          <Grid item xs={12} sm={6}>
          </Grid>
          <Grid item xs={12} sm={6}>
            <VersionButton setVersion={setVersion} version={version}/>
            <StartButton version={version} profile={profile}/>
          </Grid>
          <Grid item xs={12} sm={6}>
          </Grid>
        </Grid>
        <Progress/>
      </Box>
    </ThemeProvider>
  )
}