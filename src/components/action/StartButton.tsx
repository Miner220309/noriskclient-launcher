import React from "react";
import {Button, createStyles, makeStyles, Theme, useTheme,} from "@material-ui/core";
import {readTextFile} from "tauri/api/fs";
import {PlayArrow} from "@material-ui/icons";
import {promisified} from "tauri/api/tauri";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
            position: "absolute",
            bottom: 0,
        },
    })
);

export const StartButton = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    return (
        <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={async () => {
                const mcDir = await promisified({cmd: "minecraftDir"});
                const profiles = await readTextFile(`${mcDir}/launcher_profiles.json`);
                console.log(profiles);
            }}
            startIcon={<PlayArrow/>}
        >
            Start
        </Button>
    );
};

