<h1>Call Option Pricing</h1>
<h2>Run yarn to install modules and yarn start to open a local server</h2>
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
