#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod cmd;

#[cfg(target_os = "windows")]
use winapi::um::shellscalingapi::{SetProcessDpiAwareness, PROCESS_PER_MONITOR_DPI_AWARE};

fn main() {
    #[cfg(target_os = "windows")]
    unsafe {
        SetProcessDpiAwareness(PROCESS_PER_MONITOR_DPI_AWARE);
    }

    tauri::AppBuilder::new()
        .invoke_handler(|_webview, arg| {
            use cmd::Cmd::*;
            match serde_json::from_str(arg) {
                Err(e) => Err(e.to_string()),
                Ok(command) => {
                    match command {
                        // definitions for your custom commands from Cmd here
                        MyCustomCommand { argument } => {
                            //  your command code
                            println!("{}", argument);
                        }
                    }
                    Ok(())
                }
            }
        })
        .build()
        .run();
}
