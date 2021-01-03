import React from "react";
import {Button, createStyles, makeStyles, Theme, useTheme} from "@material-ui/core";
import {BaseDirectory, readDir, readTextFile} from "tauri/api/fs";
import {PlayArrow} from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
            position: "absolute",
            bottom: 0,
        },
    }),
);

export const StartButton = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    return (
        <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
                console.log(BaseDirectory.App)
                readTextFile("AppData/Roaming/.minecraft/launcher_profiles.json",{dir: BaseDirectory.Home}).then(value => {
                    console.log(value)
                }).catch(reason => {
                    console.log(reason)
                })
            }}
            startIcon={<PlayArrow/>}>
            Start
        </Button>
    )
}