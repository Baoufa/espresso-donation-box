use anyhow::Error;
use ethers::prelude::*;
use reqwest::Client;
use std::sync::Arc;

abigen!(
    ContractInterface, // You can name this as per your contract's functionality
    "./src/services/donation_box/ABI.json"
);

#[derive(Clone)]
pub struct DonationBox {
    pub client: Arc<Client>,
    pub provider: Arc<Provider<Http>>,
    pub contract: ContractInterface<Provider<Http>>,
}

impl DonationBox {
    pub fn new(client: Arc<Client>, rpc_url: &str, contract_address: &str) -> Result<Self, Error> {
        let provider = Arc::new(Provider::<Http>::try_from(rpc_url)?);

        let address = contract_address
            .parse::<H160>()
            .map_err(|_| Error::msg("Invalid H160 format"))?;

        println!("Contract address: {}", address);

        let contract = ContractInterface::new(address, Arc::clone(&provider));
        Ok(DonationBox {
            client,
            provider,
            contract,
        })
    }

    pub async fn read_total_donation(&self) -> Result<U256, anyhow::Error> {
        println!("Reading total donation");

        let total_donation = self
            .contract
            .get_total_donations()
            .call()
            .await
            .map_err(|e| anyhow::anyhow!("Failed to call getTotalDonation: {}", e))?;

        println!("Total donation: {}", total_donation);

        Ok(total_donation)
    }
}
