use serde::Deserialize;

#[derive(Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
    MinecraftDir { callback: String, error: String },
    StartGame { program: String, args: Vec<String> },
}
