use serde::Deserialize;
use std::path::PathBuf;

#[derive(Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
    MinecraftDir {
        callback: String,
        error: String,
    },
    StartGame {
        program: String,
        args: Vec<String>,
    },
    WriteBinFile {
        path: PathBuf,
        content: Vec<u8>,
        callback: String,
        error: String,
    },
}
