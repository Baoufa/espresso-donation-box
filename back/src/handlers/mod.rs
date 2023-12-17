use anyhow::Error;
use axum::{extract::State, response::IntoResponse, response::Result, Json};
use ethers::types::U256;

use crate::AppState;

#[derive(Debug, serde::Serialize)]
pub struct Donation {
    eth_usd_price: f64,
    donation_total: U256,
}

#[derive(Debug, thiserror::Error)]
pub enum DonationError {
    #[error("Failed to get donation total: {0}")]
    FailedToGetDonation(Error),
}

impl IntoResponse for DonationError {
    fn into_response(self) -> axum::response::Response {
        let status_code = match self {
            DonationError::FailedToGetDonation(_) => axum::http::StatusCode::INTERNAL_SERVER_ERROR,
        };
        (status_code, self.to_string()).into_response()
    }
}

pub async fn donation(State(app_state): State<AppState>) -> Result<Json<Donation>, DonationError> {
    let eth_usd_price_future = app_state.eth_usd_price.get_eth_usd_price();
    let donation_total_future = app_state.donation_box.read_total_donation();

    let (eth_usd_price, donation_total) =
        tokio::try_join!(eth_usd_price_future, donation_total_future)
            .map_err(|e| DonationError::FailedToGetDonation(e.into()))?;

    let donation = Donation {
        eth_usd_price,
        donation_total,
    };

    Ok(Json(donation))
}

pub async fn health_check() -> &'static str {
    "OK"
}
