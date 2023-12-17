mod handlers;
mod middlewares;
mod services;

use std::sync::Arc;

use axum::{routing::get, Router};
use handlers::donation;
use middlewares::cors_layer;
use reqwest::Client;
use services::donation_box::DonationBox;
use services::eth_usd_price::EthUsdPrice;

#[derive(Clone)]
pub struct AppState {
    pub client: Arc<Client>,
    pub eth_usd_price: EthUsdPrice,
    pub donation_box: DonationBox,
}

impl AppState {
    fn new() -> Self {
        let client = Arc::new(Client::new());
        let eth_usd_price = EthUsdPrice::new(Arc::clone(&client), None);
        let donation_box = DonationBox::new(
            Arc::clone(&client),
            "https://sepolia.gateway.tenderly.co",
            "0x2642381fdf335501897a31d0f96de374b4d8d237",
        );
        AppState {
            client,
            eth_usd_price,
            donation_box: donation_box.unwrap(),
        }
    }
}

#[shuttle_runtime::main]
async fn main() -> shuttle_axum::ShuttleAxum {
    let router = Router::new()
        .route("/", get(handlers::health_check))
        .route("/donation", get(donation))
        .layer(cors_layer())
        .with_state(AppState::new());

    Ok(router.into())
}
