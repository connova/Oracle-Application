import React from 'react';
import Web3 from 'web3';
import { STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS } from './quotecontract.js';

const web3 = new Web3("http://localhost:7545");


class StockContract extends React.Component {

    constructor() {
        super();
        this.change = this.change.bind(this);
        this.apiData = this.apiData.bind(this);
        this.enterInfo = this.enterInfo.bind(this);
        this.priceInfo = this.priceInfo.bind(this);
        this.volumeInfo = this.volumeInfo.bind(this);
        this.state = {
            priceFromABI: '',
            volumeFromABI: '',
            data: []
        }


    }
    change(event) {
        this.setState({ symbol: event.target.value });
    }
    apiData(event) {

        try {
            fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${this.state.symbol}&apikey=KEY`).then(res => res.json())
                .then((result) => {
                    this.setState({
                        symbol: result["Global Quote"]["01. symbol"],
                        price: result["Global Quote"]["05. price"],
                        volume: result["Global Quote"]["06. volume"]
                    });
                }
                )

        }
        catch (error) {
            console.log('failure to retreive data from API', error);
        }
        event.preventDefault();
    }
    async enterInfo(event) {
        event.preventDefault();
        try {

            const accounts = await web3.eth.getAccounts()
            const stockQuote = new web3.eth.Contract(STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS)
            const retval = await stockQuote.methods.setStock(web3.utils.fromAscii(this.state.symbol), parseInt(this.state.price * 100), parseInt(this.state.volume)).send({ from: accounts[0] });
            console.log(retval);

        }
        catch (error) {
            console.log('failed to enter info', error);
        }
    }
    async priceInfo(event) {
        event.preventDefault();
        try {
            const accounts = await web3.eth.getAccounts()
            console.log("Account 0 = ", accounts[0])
            const stockQuote = new web3.eth.Contract(STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS)
            let conPrice = await stockQuote.methods.getStockPrice(web3.utils.fromAscii(this.state.symbol)).call();
            this.setState({ priceFromABI: parseFloat(conPrice / 100) });

        }
        catch (error) {
            console.log('failure to retreive price', error);
        }
    }
    async volumeInfo(event) {
        event.preventDefault();
        try {
            const accounts = await web3.eth.getAccounts()
            console.log("Account 0 = ", accounts[0])
            const stockQuote = new web3.eth.Contract(STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS)
            let conVolume = await stockQuote.methods.getStockVolume(web3.utils.fromAscii(this.state.symbol)).call();
            this.setState({ volumeFromABI: conVolume });
        }
        catch (error) {
            console.log('failure to retreive volume', error);
        }
    }
    render() {
        return (
            <div>
                <h1>Oracle App</h1>
                <h3>API Data</h3>
                    <b>Symbol:</b> {this.state.symbol}&nbsp;
                    <b>Price:</b> {this.state.price}&nbsp;
                    <b>Volume:</b> {this.state.volume}<br />   
                <h3>Contract Info</h3>
                    <b>Symbol:</b> {this.state.symbol}&nbsp;
                    <b>Price:</b> {this.state.priceFromABI}&nbsp;
                    <b>Volume:</b> {this.state.volumeFromABI} <br />
                
                <label>Enter Symbol:
                    <input type="text" value={this.state.symbol} onChange={this.change} />
                </label><br />
                    <button type="button" onClick={this.apiData}>Stock Price(API)</button>
                    <button type="button" onClick={this.enterInfo}>Set Stock(Smart Contract)</button>
                    <button type="button" onClick={this.priceInfo}>Get Stock Price(Smart Contract)</button>
                    <button type="button" onClick={this.volumeInfo}>Get Stock Volume(Smart Contract)</button>
            
            </div>

        );
    }
}
export default StockContract;