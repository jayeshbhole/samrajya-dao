import * as dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig, task, types } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";

dotenv.config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

const getSecret = (name: string): string => {
    return process.env?.[name] ?? "";
};

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.4",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        localhost: {
            allowUnlimitedContractSize: true,
            url: "http://localhost:8545",
            accounts: [getSecret("PRIVATE_KEY"), getSecret("PRIVATE_KEY2")],
            // saveDeployments: true,
        },
        hardhat: {
            chainId: 31337,
            allowUnlimitedContractSize: true,
            forking: {
                enabled: true,
                url: getSecret("MUMBAI_URL"),
                blockNumber: 27004544,
            },
            mining: {
                auto: true,
                interval: 0,
            },
            accounts: [
                {
                    privateKey: getSecret("PRIVATE_KEY"),
                    balance: "10000000000000000000000000000000000000000000000000",
                },
                {
                    privateKey: getSecret("PRIVATE_KEY2"),
                    balance: "1000000000000000000000",
                },
            ],
        },

        goerli: {
            url: getSecret("GOERLI_URL"),
            accounts: getSecret("PRIVATE_KEY") !== undefined ? [getSecret("PRIVATE_KEY")] : [],
            verify: {
                etherscan: {
                    apiKey: getSecret("ETHERSCAN_API_KEY"),
                },
            },
        },

        rinkeby: {
            url: getSecret("RINKEBY_URL"),
            accounts: getSecret("PRIVATE_KEY") !== undefined ? [getSecret("PRIVATE_KEY")] : [],
            verify: {
                etherscan: {
                    apiKey: getSecret("ETHERSCAN_API_KEY"),
                },
            },
        },

        mumbai: {
            url: getSecret("MUMBAI_URL"),
            accounts: getSecret("PRIVATE_KEY") !== undefined ? [getSecret("PRIVATE_KEY")] : [],
            verify: {
                etherscan: {
                    apiKey: getSecret("POLYSCAN_API_KEY"),
                },
            },
        },
    },
    etherscan: {
        apiKey: {
            mainnet: getSecret("ETHERSCAN_API_KEY"),
            goerli: getSecret("ETHERSCAN_API_KEY"),
            polygonMumbai: getSecret("POLYSCAN_API_KEY"),
            polygon: getSecret("POLYSCAN_API_KEY"),
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
};

export default config;
