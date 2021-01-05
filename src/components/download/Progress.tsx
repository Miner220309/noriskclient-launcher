import React from "react";
import {Box, Button, LinearProgress, LinearProgressProps, Typography} from "@material-ui/core";
import axios from "axios";
import {promisified} from "tauri/api/tauri";
import {writeBinaryFile} from "tauri/api/fs";
import {bytesToBase64} from "byte-base64";

export const Progress = () => {
  const [progress, setProgress] = React.useState(0);
  return (
    <div>
      <Button variant={"contained"} onClick={async () => {
        let response = await axios({
          url: '/downloads/client/latest.jar',
          method: 'GET',
          responseType: 'arraybuffer', // Important
        });
        const mcDir = await promisified({cmd: "minecraftDir"});
        const result = await promisified({
          cmd: 'writeBinFile',
          path: mcDir + "/norisk/client.jar",
          contents: bytesToBase64(new Uint8Array(response.data)),
        });
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
