use axum::http::{self, HeaderValue};
use http::Method;
use tower_http::cors::{Any, CorsLayer};

pub fn cors_layer() -> CorsLayer {
    CorsLayer::new()
        .allow_methods([Method::GET])
        .allow_origin([
            HeaderValue::from_static("https://benjamin-espresso-donation-box.vercel.app"),
            HeaderValue::from_static("http://localhost:3000"),
        ])
        .allow_headers(Any)
}
