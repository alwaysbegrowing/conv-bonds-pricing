import "antd/dist/antd.min.css";
import { useEffect, useState } from "react";
import { DatePicker } from "antd";

//Enter parameters here (Token contract address; Expiration data; Strike Price)
//Output the result of the equation here

function App() {
  const [underlyingPrice, setUnderlyingPrice] = useState();
  const [time, setTime] = useState();
  const [volatility, setVolatility] = useState();
  const contractAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

  useEffect(() => {
    const getMarketData = async () => {
      const marketData = await fetch(
        `api/coinGeckoApi?contractAddress=${contractAddress}`
      );
      const marketDataJson = await marketData.json();
      const prices = marketDataJson.data.prices;

      const priceArray = [];
      prices.map((array) => priceArray.push(array[1]));

      setUnderlyingPrice(priceArray[365]);

      const naturalLogsPrices = [];

      const arrayLength = priceArray.length - 1;

      for (let i = 0; i < arrayLength; i++) {
        const secondNumber = priceArray[i + 1];
        const priceDifference = Math.log(secondNumber / priceArray[i]);
        naturalLogsPrices.push(priceDifference);
      }

      const getSd = () => {
        const n = naturalLogsPrices.length;
        const mean = naturalLogsPrices.reduce((a, b) => a + b) / n;
        const std = Math.sqrt(
          naturalLogsPrices
            .map((x) => Math.pow(x - mean, 2))
            .reduce((a, b) => a + b) / n
        );
        return std;
      };

      const stdPriceDifferences = getSd();
      const historicalVolitility = stdPriceDifferences * Math.sqrt(365);
      setVolatility(historicalVolitility);
    };
    getMarketData();
  }, []);

  //

  const fs = underlyingPrice;
  const t = 0.5;
  const v = volatility;

  useEffect(() => {
    const getBSData = async () => {
      const data = await (
        await fetch(`api/getBSEstimate?fs=${fs}&t=${t}&v=${v}`)
      ).json();
      const value = await data[0];
      console.log(value);
    };
    getBSData();
  }, [fs, v]);

  return (
    <div className="App">
      <header className="App-header">
        <DatePicker>Blue</DatePicker>
      </header>
    </div>
  );
}

export default App;
