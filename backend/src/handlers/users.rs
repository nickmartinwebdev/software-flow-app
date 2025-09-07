use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use uuid::Uuid;

use crate::services::SharedState;

#[derive(Serialize)]
pub struct User {
    id: Uuid,
    name: String,
    email: String,
}

#[derive(Deserialize)]
pub struct CreateUserRequest {
    name: String,
    email: String,
}

pub async fn list_users(State(_state): State<SharedState>) -> Result<Json<Vec<User>>, StatusCode> {
    // Mock users data
    let users = vec![
        User {
            id: Uuid::new_v4(),
            name: "John Doe".to_string(),
            email: "john@example.com".to_string(),
        },
        User {
            id: Uuid::new_v4(),
            name: "Jane Smith".to_string(),
            email: "jane@example.com".to_string(),
        },
    ];

    Ok(Json(users))
}

pub async fn get_user(
    Path(id): Path<Uuid>,
    State(_state): State<SharedState>,
) -> Result<Json<User>, StatusCode> {
    // Mock user data
    let user = User {
        id,
        name: "John Doe".to_string(),
        email: "john@example.com".to_string(),
    };

    Ok(Json(user))
}

pub async fn create_user(
    State(_state): State<SharedState>,
    Json(payload): Json<CreateUserRequest>,
) -> Result<Json<User>, StatusCode> {
    let user = User {
        id: Uuid::new_v4(),
        name: payload.name,
        email: payload.email,
    };

    Ok(Json(user))
}
