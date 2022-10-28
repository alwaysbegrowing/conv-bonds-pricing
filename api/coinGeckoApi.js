//Coin Gecko serverless function to get the historical price of the (token?)
//Use /coins/{id}/history endpoint - will need to call /coins/{id}/contract/{contract_address}/market_chart for historical data
//id = ethereum (?)
//Review output with Russell to confirm which numbers - return array of arrays (price (first is UNIX timestamp, second is price), market_cap, 24hVolume)

const fetch = require("node-fetch");

export default async function handler(request, response) {
  //USDC contractAddress
  const contractAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

  //URL for obtaining the last 365 days of pricing for a particular contract on ethereum's network in USD

  const COINGECKO_URL = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${contractAddress}/market_chart/?vs_currency=usd&days=365`;

  //   const { contractAddress } = request.query;

  const result = await fetch(COINGECKO_URL);

  const data = await result.json();

  return response.status(200).json({ data });
}
