import React, { useEffect, useState } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Avatar } from "@material-ui/core";
import { promisified } from "tauri/api/tauri";
import { LauncherProfile } from "../interfaces/LauncherAccount";

interface ISwitchAccountMenu {
  open: boolean;
  handleClose: () => void;
  switchProfile: (profile: LauncherProfile) => void;
  anchorEl: HTMLElement | null;
}

interface MinecraftAccount {
  uuid: string;
  name: string;
}

export const SwitchAccountMenu = (props: ISwitchAccountMenu) => {
  const [accounts, setAccounts] = useState<Array<MinecraftAccount>>([]);

  useEffect(() => {
    //workaround but it works
    const fetchAccounts = async () => {
      const accs = await promisified({ cmd: "listAccounts" });
      console.log(accs);
      setAccounts(accs as Array<MinecraftAccount>);
    };
    fetchAccounts();
  }, []);

  return (
    <Menu
      id="menu-appbar"
      anchorEl={props.anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={props.open}
      onClose={props.handleClose}
    >
      {accounts.map((account) => {
        return (
          <MenuItem
            key={account.uuid}
            onClick={() => {
              // props.switchProfile(account);
              props.handleClose();
            }}
          >
            <Avatar
              variant={"square"}
              alt="Remy Sharp"
              src={"https://crafatar.com/avatars/" + account.uuid}
            />
            <h1>{account.name}</h1>
          </MenuItem>
        );
      })}
    </Menu>
  );
};
