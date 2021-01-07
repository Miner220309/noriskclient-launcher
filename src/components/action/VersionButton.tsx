import React from "react";
import {Button} from "@material-ui/core";
import {SwitchVersion} from "../menu/SwitchVersion";
import {Version} from "../../interfaces/Version";
import {setFlagsFromString} from "v8";

interface Props {
  version: Version
  setVersion: (version: Version) => void;
}

export const VersionButton = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Button onClick={handleMenu} variant="contained" color="primary">{props.version.name}</Button>
      <SwitchVersion setVersion={props.setVersion} open={open} handleClose={handleClose} anchorEl={anchorEl}/>
    </>
  )
}