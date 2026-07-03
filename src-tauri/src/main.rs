// MOGUL desktop shell (ROADMAP P7.1). The game is entirely web-side;
// the shell provides the window, offline packaging, and (next) file-backed
// saves via the existing export/import path for Steam Cloud.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running MOGUL");
}
