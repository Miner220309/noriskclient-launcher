import React from 'react';
import './App.css'
import {NavBar} from "./components/navbar/NavBar";
import {StartButton} from "./components/action/StartButton";
import {Box, createMuiTheme, ThemeProvider} from "@material-ui/core";
import {blue, cyan} from "@material-ui/core/colors";

const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: cyan,
    },
});


export const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Box bgcolor={cyan} height={"100%"}>
                <NavBar/>
                <Box height={"auto"}>
                    <StartButton/>
                </Box>
            </Box>
        </ThemeProvider>
    )
}