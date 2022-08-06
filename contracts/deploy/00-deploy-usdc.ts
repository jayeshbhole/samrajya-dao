import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig } from "../helper-hardhat-config"

const deployGovernanceToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    if (network.name === "hardhat" || network.name === "localhost") {
        log("----------------------------------------------------")
        log("Deploying test USDC")
        const testUSDC = await deploy("USDC", {
            from: deployer,
            args: [],
            log: true,
            // we need to wait if on a live network so we can verify properly
            waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
        })
        log(`USDC - test at ${testUSDC.address}`)
    }
}

export default deployGovernanceToken
deployGovernanceToken.tags = ["all", "testUSDC"]
