<div align="center">
<h1 align="center" style="margin-bottom: 0">Espresso Donation Box</h1>
Live demo app: <a href="https://benjamin-espresso-donation-box.vercel.app
" target="_blank">benjamin-espresso-donation-box.vercel.app
</a></p>
</div>

</br>

<div align="center">

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-red.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Sepolia Testnet](https://img.shields.io/badge/Sepolia%20testnet-blue?&label=deployed%20on)](https://passkeys-4337.vercel.app/)</br>
[![Twitter Follow](https://img.shields.io/twitter/follow/ben.anoufa.eth?style=social)](https://twitter.com/Baoufa)

</div>

## Backend

### Requirements

You need to install [Shuttle CLI](https://docs.shuttle.rs/getting-started/installation).

### Run locally

You can launch the API at http://localhost:8000 with the following command:

```bash
cargo shuttle run

# in another terminal, you can test the API with
curl http://localhost:8000/ -v
curl http://localhost:8000/donation -v
```

### Deploy

Run `cargo shuttle deploy` to deploy your Shuttle service.

## Frontend

### Installation

Install the dependencies:

```bash
pnpm install
```

### Update environment variables

Copy `.env.example` to `.env.local` and update the values.

### Run locally

Run locally with the following command:

```bash
pnpm dev
```

and then open [localhost:3000](http://localhost:3000) in your browser.
