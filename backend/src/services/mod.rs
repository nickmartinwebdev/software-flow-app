use std::sync::Arc;

#[derive(Clone)]
pub struct AppState {}

pub type SharedState = Arc<AppState>;
