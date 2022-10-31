import "antd/dist/antd.min.css";
import { useEffect, useState, useRef } from "react";
import {
  Layout,
  Row,
  Col,
  Button,
  PageHeader,
  Input,
  Space,
  Statistic,
} from "antd";
import { GithubOutlined } from "@ant-design/icons";
import "./App.less";

const { Header, Footer, Content } = Layout;

//Enter parameters here (Token contract address; Expiration data; Strike Price)
//Output the result of the equation here

function App() {
  const [underlyingPrice, setUnderlyingPrice] = useState();
  const [time, setTime] = useState();
  const [volatility, setVolatility] = useState();
  const [contractAddress, setContractAddress] = useState();
  const [ratio, setRatio] = useState();
  const [bondValue, setBondValue] = useState();
  const inputRef = useRef(null);

  // const contractAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

  useEffect(() => {
    const getMarketData = async () => {
      const marketData = await fetch(
        `api/coinGeckoApi?contractAddress=${contractAddress}`
      );
      const marketDataJson = await marketData?.json();
      const prices = marketDataJson.data.prices;

      const priceArray = [];
      prices?.map((array) => priceArray.push(array[1]));

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
        const mean = naturalLogsPrices?.reduce((a, b) => a + b) / n;
        const std = Math.sqrt(
          naturalLogsPrices
            ?.map((x) => Math.pow(x - mean, 2))
            ?.reduce((a, b) => a + b) / n
        );
        return std;
      };

      const stdPriceDifferences = getSd();
      const historicalVolitility = stdPriceDifferences * Math.sqrt(365);
      setVolatility(historicalVolitility);
    };
    getMarketData();
  }, [contractAddress]);

  const v = volatility;
  const t = time;
  const fs = underlyingPrice * ratio;

  useEffect(() => {
    const getBSData = async () => {
      const data = await (
        await fetch(`api/getBSEstimate?fs=${fs}&t=${t}&v=${v}`)
      ).json();
      const value = await data[0];
      setBondValue(value);
    };
    getBSData();
  }, [fs, t, v]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ backgroundColor: "#f6ffed" }}>
        <Row justify="space-between">
          <Col>
            <img
              style={{
                float: "left",
                height: 31,
                // width: 200,
                margin: "16px 0px 16px 0",
              }}
              src="https://tse3.mm.bing.net/th?id=OIP.XYaeDXspGLV6vl4xFh7CDgHaHa"
              alt="abg logo"
            />
            <b> Always Be Growing</b>
          </Col>
          <Col>
            {" "}
            <Button
              onClick={() => {
                window.open(
                  "https://github.com/alwaysbegrowing/conv-bonds-pricing"
                );
              }}
              type="text"
            >
              <GithubOutlined />
            </Button>
          </Col>
        </Row>
      </Header>
      <Content>
        <PageHeader style={{ backgroundColor: "#fff" }} title="Bonds Pricing">
          <p>
            This is a tool to help price Arbor bonds. Using the
            Bjerksund-Stensland (2002) model of call option pricing, this tool
            will provide an estimate of the price of the bond as a call option.
          </p>
          <p>
            <b>This is only an estimate.</b> Due to the volatility of blockchain
            tokens as well as the assumptions required to calculate the option
            pricing, exact calculations cannot be made and caution should be
            used when considering pricing bonds.
          </p>
          <b>Assumptions</b>
          <p>
            This model considers the current market price of the selected token,
            the historical volitility of the token, and the amount of time until
            the bond expires. Risk free rate is set to 0.03% and the strike
            price is set to $1. Due to no bonds being currently offerred on the
            market, historical volitility is used instead of implied volitility.
            The algorithm was forked from{" "}
            <a href="https://github.com/dedwards25/Python_Option_Pricing/blob/master/GBS.ipynb">
              this repo
            </a>
            .
          </p>
          Three inputs are accepted:
          <p>
            <li>
              <b>1. Contract Address:</b> This is the address of the token you
              are interested in using as collateral.
            </li>
            <li>
              <b>2. Time Until Bond Expiration:</b> This is the amount of time
              (in years) until the bonds will expire.
            </li>
            <li>
              <b>3. Convertability Ratio:</b> This is how much of the underlying
              collateral you plan to allow bond holders to redeem their bond
              for.
            </li>
          </p>
          <p>
            For example, ABC DAO is interested in selling to bonds and will be
            using 15 million USD worth of their native token (ABC) as
            collateral. ABC DAO would enter their contract address
            (0x000000000), how long until they plan for the bonds to expire
            (e.g. 1 for 1 year), and the convertability ratio. Since one ABC
            token is work 0.05 USD, they plan to allow bond holders to pay $1
            for 10 tokens (i.e. 0.50 USD). If ABC DAO's token rises above 0.10
            USD per token, bond holders could then pay $1 for 10 ABC tokens,
            thereby earning converting their bond into ABC tokens and earning a
            yield.
          </p>
        </PageHeader>
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          <Row>
            <Col span={2}></Col>
            <Col span={20}>
              <div>Contract Address:</div>
              <Input
                placeholder="Contract Address"
                value={contractAddress}
                onChange={(event) => {
                  setContractAddress(event.target.value);
                }}
                ref={inputRef}
              />
            </Col>
            <Col span={2}></Col>
          </Row>
          <Row>
            <Col span={2}></Col>
            <Col span={20}>
              <div>Time Until Bond Expiration:</div>
              <Input
                placeholder="Time to Expiration"
                value={time}
                onChange={(event) => {
                  setTime(event.target.value);
                }}
                ref={inputRef}
              />
            </Col>
            <Col span={2}></Col>
          </Row>
          <Row>
            <Col span={2}></Col>
            <Col span={20}>
              <div>Convertability Ratio:</div>
              <Input
                placeholder="Convertability Ratio"
                value={ratio}
                onChange={(event) => {
                  setRatio(event.target.value);
                }}
                ref={inputRef}
              />
            </Col>
            <Col span={2}></Col>
          </Row>
          <Row>
            <Col span={2}></Col>
            <Col span={20}>
              <Statistic title="Recommended Bond Price" value={bondValue} />
            </Col>
          </Row>
        </Space>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Created by <a href="https://abg.garden">Always Be Growing</a>
      </Footer>
    </Layout>
  );
}

export default App;
