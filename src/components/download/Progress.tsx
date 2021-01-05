import React from "react";
import {Box, Button, LinearProgress, LinearProgressProps, Typography} from "@material-ui/core";
import axios from "axios";
import {promisified} from "tauri/api/tauri";

export const Progress = () => {
  const [progress, setProgress] = React.useState(0);
  return (
    <div>
      <Button variant={"contained"} onClick={async () => {
        await axios({
          url: '/downloads/client/latest.jar',
          method: 'GET',
          responseType: 'arraybuffer', // Important
        }).then(async value => {
          const buffer = value.data as ArrayBuffer;
          const difference = new Uint8Array(buffer)
          console.log(buffer)
          console.log(difference)
          const mcDir = await promisified({cmd: "minecraftDir"});
          return await promisified({
            cmd: 'writeFile',
            path: mcDir + "/norisk/client.jar",
            contents: JSON.stringify(buffer),
          }).then(result => {
            console.log(result)
          });
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
