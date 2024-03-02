import React, { useState, useEffect } from "react";
import axios from "axios";
import Web3 from "web3";
import { styled } from "@mui/material/styles";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
  tableCellClasses,
  TableContainer,
  Paper,
} from "@mui/material";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [ethBalance, setEthBalance] = useState("0");
  const [cryptoPrices, setCryptoPrices] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.coingecko.com/api/v3/coins/markets?", {
        headers: {
          "x-cg-demo-api-key": "CG-dHDippPSk8LNVo8E8GAnSseg",
        },
        params: {
          vs_currency: "usd",
          ids: "bitcoin,ethereum,ripple,cardano,litecoin",
          price_change_percentage: "1h,24h,7d",
          precision: 2,
        },
      })
      .then((response) => {
        const data = response.data;
        setCryptoPrices(data);
      })
      .catch((error) => console.error("There was an error!", error));
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        const accounts = await web3.eth.requestAccounts();
        setWalletAddress(accounts[0]);
        const balance = await web3.eth.getBalance(accounts[0]);
        setEthBalance(web3.utils.fromWei(balance, "ether"));
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#2196f3",
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const currencyFormat = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD", // Change currency code according to your requirement
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Container>
      <Card style={{ maxWidth: 500, marginTop: 50 }}>
        <CardContent
          style={{
            margin: "auto",
            backgroundColor: "#2196f3",
            color: "#fff",
          }}
        >
          <img
            src="https://ethereum.org/_ipx/w_1920,q_75/%2F_next%2Fstatic%2Fmedia%2Feth-diamond-purple.7929ed26.png"
            alt="Ethereum Logo"
            style={{ width: 50, height: 50 }}
          />
          <Typography variant="h5">Ethereum Wallet</Typography>
          {walletAddress ? (
            <>
              <Typography variant="body2" component="p">
                <b>Wallet Address :</b> {walletAddress}
              </Typography>
              <Typography
                variant="body2"
                component="p"
                style={{ fontWeight: "bold" }}
              >
                Balance : {ethBalance} ETH
              </Typography>
            </>
          ) : (
            <Button
              color="primary"
              onClick={connectWallet}
              style={{
                backgroundColor: "white",
                textTransform: "none",
                marginTop: 10,
                fontWeight: "bold",
              }}
            >
              {walletAddress ? "Wallet Connected" : "Connect Wallet"}
            </Button>
          )}
        </CardContent>
      </Card>
      <TableContainer component={Paper} style={{ marginTop: 30 }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell width={10}>#</StyledTableCell>
              <StyledTableCell align="center" width={10}></StyledTableCell>
              <StyledTableCell align="left">Coin</StyledTableCell>
              <StyledTableCell align="right">Price (USD)</StyledTableCell>
              <StyledTableCell align="right">1h</StyledTableCell>
              <StyledTableCell align="right">24h</StyledTableCell>
              <StyledTableCell align="right">7d</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cryptoPrices.map((row, index) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {index++ + 1}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <img
                    src={row.image}
                    alt="image"
                    style={{ width: 25, height: 25 }}
                  />
                </StyledTableCell>
                <StyledTableCell align="left">
                  <b>{row.name}</b>
                  {" (" + row.symbol.toUpperCase() + ")"}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {currencyFormat(row.current_price)}
                </StyledTableCell>
                <StyledTableCell
                  align="right"
                  style={
                    row.price_change_percentage_1h_in_currency < 0
                      ? { color: "red" }
                      : { color: "green" }
                  }
                >
                  {row.price_change_percentage_1h_in_currency.toFixed(2)}%
                </StyledTableCell>
                <StyledTableCell
                  align="right"
                  style={
                    row.price_change_percentage_24h_in_currency < 0
                      ? { color: "red" }
                      : { color: "green" }
                  }
                >
                  {row.price_change_percentage_24h_in_currency.toFixed(2)}%
                </StyledTableCell>
                <StyledTableCell
                  align="right"
                  style={
                    row.price_change_percentage_7d_in_currency < 0
                      ? { color: "red" }
                      : { color: "green" }
                  }
                >
                  {row.price_change_percentage_7d_in_currency.toFixed(2)}%
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default App;
