import React from "react";
import LinearProgress, {LinearProgressProps} from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {Button} from "@material-ui/core";
import axios from "axios";
import {writeBinaryFile} from "tauri/api/fs";
import {promisified} from "tauri/api/tauri";
import {dialog} from "tauri/api/bundle";

export const Progress = () => {
  const [progress, setProgress] = React.useState(0);
  return (
    <div>
      <Button variant={"contained"} onClick={async () => {
        await axios({
          url: '/downloads/client/latest.jar',
          method: "GET",
          responseType: "blob", // important
          onDownloadProgress: (progressEvent) => {
            setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        }).then(async value => {
          const mcDir = await promisified({cmd: "minecraftDir"});
          console.log(mcDir)
          console.log(value)
          const xd = value.data as ArrayBuffer
          console.log(xd)
          await writeBinaryFile({
            contents: value.data, path: mcDir + "/norisk/test.jar"
          }, {});
        })
      }}>Test</Button>
      <LinearProgressWithLabel value={progress}/>
    </div>
  )
}

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
