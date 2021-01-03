#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod cmd;

use cmd::Cmd;
use std::env;

#[cfg(target_os = "windows")]
use winapi::um::shellscalingapi::{SetProcessDpiAwareness, PROCESS_PER_MONITOR_DPI_AWARE};

fn main() {
    #[cfg(target_os = "windows")]
    unsafe {
        SetProcessDpiAwareness(PROCESS_PER_MONITOR_DPI_AWARE);
    }

    tauri::AppBuilder::new()
        .invoke_handler(|webview, arg| {
            match serde_json::from_str(arg).map_err(|e| e.to_string())? {
                Cmd::MinecraftDir { callback, error } => {
                    tauri::execute_promise(
                        webview,
                        || {
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
                        },
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
