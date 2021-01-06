#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod cmd;
mod zips;

use cmd::Cmd;
use regex::Regex;
use std::{env, fs, process::Command};
use tauri::Result;

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
                Cmd::StartGame {
                    program,
                    args,
                    working_dir,
                    callback,
                    error,
                } => tauri::execute_promise(
                    webview,
                    move || {
                        Command::new(program)
                            .args(args)
                            .current_dir(working_dir.canonicalize()?)
                            .spawn()?;
                        Ok(())
                    },
                    callback,
                    error,
                ),
                Cmd::WriteBinFile {
                    path,
                    contents,
                    callback,
                    error,
                } => {
                    tauri::execute_promise(
                        webview,
                        || Ok(fs::write(path, base64::decode(contents)?)?),
                        callback,
                        error,
                    );
                }
                Cmd::MergeZip {
                    src,
                    dest,
                    exclude,
                    callback,
                    error,
                } => {
                    tauri::execute_promise(
                        webview,
                        move || {
                            zips::merge(
                                src,
                                dest,
                                exclude.map(|ex| Regex::new(&ex)).transpose()?.as_ref(),
                            )
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

fn stringify<T: ToString>(value: T) -> String {
    value.to_string()
}

fn minecraft_dir() -> Result<String> {
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
