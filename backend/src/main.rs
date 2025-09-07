use axum::{
    response::Json,
    routing::{get, post},
    Router,
};
use serde::Serialize;
use std::{net::SocketAddr, sync::Arc};
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;

mod handlers;
mod models;
mod services;

use handlers::{health, search, users};
use services::AppState;

#[derive(Serialize)]
struct ApiResponse<T> {
    success: bool,
    data: T,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Load environment variables
    dotenvy::dotenv().ok();

    // Create application state
    let state = Arc::new(AppState {});

    // Build our application with routes
    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health::health_check))
        .route(
            "/api/users",
            get(users::list_users).post(users::create_user),
        )
        .route("/api/users/:id", get(users::get_user))
        .route("/api/search", get(search::search))
        .with_state(state)
        .layer(CorsLayer::permissive());

    // Get port from environment or default to 8000
    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "8000".to_string())
        .parse::<u16>()?;

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let listener = TcpListener::bind(addr).await?;

    println!("Server running on {}", addr);

    axum::serve(listener, app).await?;

    Ok(())
}

async fn root() -> Json<ApiResponse<&'static str>> {
    Json(ApiResponse {
        success: true,
        data: "Software Flow App Backend API",
    })
}
