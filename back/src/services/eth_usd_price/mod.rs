use anyhow::Error;
use reqwest::Client;
use serde_json::Value;
use std::{
    sync::Arc,
    time::{Duration, Instant},
};
use tokio::sync::Mutex;

#[derive(Clone)]
pub struct EthUsdPrice {
    pub client: Arc<Client>,
    pub cached_price: Arc<Mutex<Option<(f64, Instant)>>>,
    pub mock_base_url: Option<String>,
}

impl EthUsdPrice {
    pub fn new(client: Arc<Client>, mock_base_url: Option<&str>) -> Self {
        EthUsdPrice {
            client,
            cached_price: Arc::new(Mutex::new(None)),
            mock_base_url: match mock_base_url {
                Some(url) => Some(url.to_string()),
                None => None,
            },
        }
    }

    pub async fn get_eth_usd_price(&self) -> Result<f64, Error> {
        let mut cached_price = self.cached_price.lock().await;

        if let Some((price, timestamp)) = *cached_price {
            if timestamp.elapsed() < Duration::from_secs(600) {
                println!("Using cached price");
                return Ok(price);
            }
        }

        let url = if let Some(base_url) = &self.mock_base_url {
            format!(
                "{}/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
                base_url
            )
        } else {
            "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
                .to_string()
        };

        let resp = self.client.get(url).send().await?;
        let body = resp.text().await?;
        let json: Value = serde_json::from_str(&body)?;
        let new_price = json["ethereum"]["usd"]
            .as_f64()
            .ok_or_else(|| Error::msg("Failed to parse ETH/USD price"))?;

        // Update the cache
        *cached_price = Some((new_price, Instant::now()));

        println!("Updating cached price");
        Ok(new_price)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use wiremock::matchers::{method, path};
    use wiremock::{Mock, MockServer, ResponseTemplate};

    #[tokio::test]
    async fn test_get_eth_usd_price() {
        let mock_server = MockServer::start().await;

        let response_body = r#"{"ethereum": {"usd": 2000.0}}"#;
        Mock::given(method("GET"))
            .and(path("/api/v3/simple/price"))
            .respond_with(ResponseTemplate::new(200).set_body_string(response_body))
            .mount(&mock_server)
            .await;

        let client = Client::new();
        let base_url = mock_server.uri();
        let service = EthUsdPrice::new(Arc::new(client), Some(&base_url));

        let price = service
            .get_eth_usd_price()
            .await
            .expect("Failed to get ETH/USD price");
        assert_eq!(price, 2000.0);

        let cached_price = service
            .get_eth_usd_price()
            .await
            .expect("Failed to get ETH/USD cached price");
        assert_eq!(cached_price, 2000.0);
    }
}
