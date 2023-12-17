# API

## Requirement

You need to install [Shuttle CLI](https://docs.shuttle.rs/getting-started/installation).

## Run locally

You can launch the API at http://localhost:8000 with the following command:

```bash
cargo shuttle run

# in another terminal, you can test the API with
curl http://localhost:8000/ -v
curl http://localhost:8000/donation -v
```

## Deploy

Run `cargo shuttle deploy` to deploy your Shuttle service.
