import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {Version} from "../../interfaces/Version";

interface ISwitchAccountMenu {
  open: boolean,
  handleClose: () => void,
  anchorEl: HTMLElement | null;
}

export const MCVersions: Array<Version> = [{
  name: "1.8.9 Standalone",
  jsonPath: "/versions/1.8.9-NoRiskClient/1.8.9-NoRiskClient.json"
}, {
  name: "1.8.9 Forge",
  jsonPath: "/versions/1.8.9-NoRiskClient/1.8.9-NoRiskClient.json"
}, {
  name: "1.16.4 Fabric",
  jsonPath: "/versions/1.8.9-NoRiskClient/1.8.9-NoRiskClient.json"
}]

export const SwitchVersion = (props: ISwitchAccountMenu) => {
  return (
    <Menu
      id="menu-appbar"
      anchorEl={props.anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={props.open}
      onClose={props.handleClose}>

      {MCVersions.map(version => {
        return (
          <MenuItem key={version.name} onClick={() => {
            props.handleClose();
          }}>
            <h1>{version.name}</h1>
          </MenuItem>
        )
      })}
    </Menu>
  )
}
