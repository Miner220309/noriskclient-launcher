import React from "react";
import {Button} from "@material-ui/core";
import {SwitchVersion} from "../menu/SwitchVersion";

export const VersionButton = () => {
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
      <Button onClick={handleMenu} variant="contained" color="primary">Version</Button>
      <SwitchVersion open={open} handleClose={handleClose} anchorEl={anchorEl}/>
    </>
  )
}