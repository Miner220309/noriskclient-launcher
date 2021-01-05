use serde::{Deserialize, Serialize};
use std::{fs, path::Path};
use tauri::Result;
use uuid::Uuid;

#[derive(Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct LauncherAccounts {
    pub accounts: Vec<LauncherAccount>,
    pub active_account_local_id: Uuid,
    pub mojang_client_token: Uuid,
}

impl LauncherAccounts {
    pub fn load<P: AsRef<Path>>(path: P) -> Result<Self> {
        Ok(serde_json::from_str(&fs::read_to_string(path)?)?)
    }

    pub fn minecraft_accounts(&self) -> Vec<&MinecraftAccount> {
        self.accounts
            .iter()
            .map(|acc| &acc.minecraft_account)
            .collect()
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LauncherAccount {
    pub access_token: String,
    pub eligible_for_migration: bool,
    pub has_multiple_profiles: bool,
    pub legacy: bool,
    pub local_id: Uuid,
    #[serde(rename = "mincraftProfile")]
    pub minecraft_account: MinecraftAccount,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MinecraftAccount {
    #[serde(rename = "id")]
    pub uuid: Uuid,
    pub name: String,
}
