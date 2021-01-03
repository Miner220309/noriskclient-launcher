#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

pub mod user;

use platform_dirs::AppDirs;
use serde::{Deserialize, Serialize};
use std::{
    env, fs,
    path::{Path, PathBuf},
    process::Command,
    sync::Arc,
};
use tauri::{Result, Webview};
use user::LauncherAccounts;
use uuid::Uuid;
#[cfg(target_os = "windows")]
use winapi::um::shellscalingapi::{SetProcessDpiAwareness, PROCESS_PER_MONITOR_DPI_AWARE};

fn main() -> Result<()> {
    #[cfg(target_os = "windows")]
    unsafe {
        SetProcessDpiAwareness(PROCESS_PER_MONITOR_DPI_AWARE);
    }

    let state = Arc::new(State::create(
        AppDirs::new(Some("noriskclient"), true).expect("failed to determine app dirs"),
    )?);

    tauri::AppBuilder::new()
        .invoke_handler(move |webview, arg| {
            serde_json::from_str::<Cmd>(arg)
                .map_err(|err| err.to_string())?
                .handle(state.clone(), webview)
                .map_err(|err| err.to_string())?;
            Ok(())
        })
        .build()
        .run();
    Ok(())
}

pub struct State {
    config: Config,
    launcher_accounts: LauncherAccounts,
}

impl State {
    pub fn create(dirs: AppDirs) -> Result<Self> {
        let config = Config::load(dirs.config_dir.join("config.json"));
        match config {
            Ok(config) => {
                let launcher_accounts = LauncherAccounts::load(&config.minecraft_dir)
                    .unwrap_or_else(|_| LauncherAccounts::default());
                Ok(Self {
                    config,
                    launcher_accounts,
                })
            }
            Err(_) => {
                let minecraft_dir = default_minecraft_dir()?;
                let launcher_accounts = LauncherAccounts::load(&minecraft_dir)
                    .unwrap_or_else(|_| LauncherAccounts::default());
                let config = Config {
                    minecraft_dir,
                    active_account: launcher_accounts.active_account_local_id,
                };
                Ok(Self {
                    config,
                    launcher_accounts,
                })
            }
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct Config {
    pub minecraft_dir: PathBuf,
    pub active_account: Uuid,
}

impl Config {
    pub fn load<P: AsRef<Path>>(path: P) -> tauri::Result<Self> {
        Ok(serde_json::from_str(&fs::read_to_string(path)?)?)
    }
}

#[derive(Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
    ListAccounts { callback: String, error: String },
    MinecraftDir { callback: String, error: String },
    StartGame { program: String, args: Vec<String> },
}

impl Cmd {
    pub fn handle(self, state: Arc<State>, webview: &mut Webview) -> Result<()> {
        match self {
            Cmd::ListAccounts { callback, error } => {
                tauri::execute_promise(
                    webview,
                    move || {
                        Ok(serde_json::to_string(
                            &state.launcher_accounts.minecraft_accounts(),
                        )?)
                    },
                    callback,
                    error,
                );
            }
            Cmd::MinecraftDir { callback, error } => {
                tauri::execute_promise(
                    webview,
                    move || Ok(state.config.minecraft_dir.as_os_str().to_owned()),
                    callback,
                    error,
                );
            }
            Cmd::StartGame { program, args } => {
                Command::new(program).args(args).spawn()?;
            }
        }
        Ok(())
    }
}

fn default_minecraft_dir() -> Result<PathBuf> {
    Ok(if cfg!(target_os = "windows") {
        format!(r"{}\.minecraft", env::var("APPDATA")?).into()
    } else if cfg!(target_os = "macos") {
        format!(
            "{}/Library/Application Support/minecraft",
            env::var("HOME")?
        )
        .into()
    } else {
        format!("{}/.minecraft", env::var("HOME")?).into()
    })
}
