use serde::Deserialize;
use std::path::PathBuf;

#[derive(Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
    #[serde(rename_all = "camelCase")]
    Os { callback: String, error: String },
    #[serde(rename_all = "camelCase")]
    MinecraftDir { callback: String, error: String },
    #[serde(rename_all = "camelCase")]
    StartGame {
        program: String,
        args: Vec<String>,
        working_dir: PathBuf,
        callback: String,
        error: String,
    },
    #[serde(rename_all = "camelCase")]
    FileExists {
        path: PathBuf,
        callback: String,
        error: String,
    },
    #[serde(rename_all = "camelCase")]
    WriteBinFile {
        path: PathBuf,
        /// Base64 encoded contents
        contents: String,
        callback: String,
        error: String,
    },
    #[serde(rename_all = "camelCase")]
    ExtractZip {
        src: PathBuf,
        dest: PathBuf,
        callback: String,
        error: String,
    },
    #[serde(rename_all = "camelCase")]
    MergeZip {
        src: PathBuf,
        dest: PathBuf,
        /// Regex for entries to exclude
        exclude: Option<String>,
        callback: String,
        error: String,
    },
}
