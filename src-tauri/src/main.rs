#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod cmd;

use cmd::Cmd;
use std::{env, fs, process::Command};

#[cfg(target_os = "windows")]
use winapi::um::shellscalingapi::{SetProcessDpiAwareness, PROCESS_PER_MONITOR_DPI_AWARE};

fn main() {
    #[cfg(target_os = "windows")]
    unsafe {
        SetProcessDpiAwareness(PROCESS_PER_MONITOR_DPI_AWARE);
    }

    tauri::AppBuilder::new()
        .invoke_handler(move |webview, arg| {
            match serde_json::from_str(arg).map_err(stringify)? {
                Cmd::MinecraftDir { callback, error } => {
                    tauri::execute_promise(webview, minecraft_dir, callback, error);
                }
                Cmd::StartGame { program, args } => {
                    Command::new(program)
                        .args(args)
                        .spawn()
                        .map_err(stringify)?;
                }
                Cmd::WriteBinFile {
                    path,
                    content,
                    callback,
                    error,
                } => {
                    tauri::execute_promise(
                        webview,
                        || Ok(fs::write(path, content)?),
                        callback,
                        error,
                    );
                }
            }
            Ok(())
        })
        .build()
        .run();
}

fn stringify<T: ToString>(value: T) -> String {
    value.to_string()
}

fn minecraft_dir() -> tauri::Result<String> {
    Ok(if cfg!(target_os = "windows") {
        format!(r"{}\.minecraft", env::var("APPDATA")?)
    } else if cfg!(target_os = "macos") {
        format!(
            "{}/Library/Application Support/minecraft",
            env::var("HOME")?
        )
    } else {
        format!("{}/.minecraft", env::var("HOME")?)
    })
}
