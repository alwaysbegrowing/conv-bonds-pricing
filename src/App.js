import "antd/dist/antd.min.css";
import { useEffect } from "react";
import { DatePicker } from "antd";

//Enter parameters here (Token contract address; Expiration data; Strike Price)
//Output the result of the equation here

function App() {
  useEffect(() => {
    const getMarketData = async () => {
      const marketData = await fetch("api/coinGeckoApi");
      const marketDataJson = await marketData.json();
      const prices = marketDataJson.data.prices;

      const priceArray = [];
      prices.map((array) => priceArray.push(array[1]));

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

      const historicalVolitility = getSd();
    };
    getMarketData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <DatePicker>Blue</DatePicker>
      </header>
    </div>
  );
}

export default App;
