use std::path::PathBuf;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::BufReader;
use anyhow::Result;

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    openai_api_key: Option<String>,
}

fn config_file_location() -> PathBuf {
    PathBuf::from("~/.config/csv-query-tool/config.json")
}

pub fn load_config() -> Result<Config> {
    let path = config_file_location();
    let f = File::open(path)?;
    let r = BufReader::new(f);

    let config: Config = serde_json::from_reader(r)?;

    Ok(config)
}