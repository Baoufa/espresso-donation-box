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
    #[error("Failed to get USD Price: {0}")]
    FailedToGetUSDPrice(Error),
    #[error("Failed to get donation total: {0}")]
    FailedToGetDonationTotal(Error),
}

impl IntoResponse for DonationError {
    fn into_response(self) -> axum::response::Response {
        let status_code = match self {
            DonationError::FailedToGetUSDPrice(_) => axum::http::StatusCode::INTERNAL_SERVER_ERROR,
            DonationError::FailedToGetDonationTotal(_) => {
                axum::http::StatusCode::INTERNAL_SERVER_ERROR
            }
        };
        (status_code, self.to_string()).into_response()
    }
}

pub async fn donation(State(app_state): State<AppState>) -> Result<Json<Donation>, DonationError> {
    let eth_usd_price = app_state
        .eth_usd_price
        .get_eth_usd_price()
        .await
        .map_err(|e| DonationError::FailedToGetUSDPrice(e))?;

    let donation_total = app_state
        .donation_box
        .read_total_donation()
        .await
        .map_err(|e| DonationError::FailedToGetDonationTotal(e.into()))?;

    let donation = Donation {
        eth_usd_price,
        donation_total,
    };

    Ok(Json(donation))
}
