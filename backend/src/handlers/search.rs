use axum::{extract::Query, http::StatusCode, response::Json};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

#[derive(Deserialize)]
pub struct SearchParams {
    q: String,
    limit: Option<usize>,
}

#[derive(Serialize)]
pub struct SearchResult {
    query: String,
    results: Vec<Value>,
    total: usize,
}

pub async fn search(Query(params): Query<SearchParams>) -> Result<Json<SearchResult>, StatusCode> {
    // Simple mock search response
    let results = vec![
        json!({"id": 1, "title": "Sample Result 1", "content": "This matches your search"}),
        json!({"id": 2, "title": "Sample Result 2", "content": "Another matching result"}),
    ];

    Ok(Json(SearchResult {
        query: params.q,
        results,
        total: 2,
    }))
}
