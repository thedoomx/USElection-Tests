import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    // Goerli Testnet
    goerli: {
      url: `https://goerli.infura.io/v3/62349f810c5c46389814d8e614bd6ef9`, //62349f810c5c46389814d8e614bd6ef9
      chainId: 5,
      accounts: [
        `12fced7dda78291cfec5a3b9122c442c108ebbaa2c4791563fae1076c1513f09`, //12fced7dda78291cfec5a3b9122c442c108ebbaa2c4791563fae1076c1513f09
      ],
    },
  },
};

module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

export default config;
