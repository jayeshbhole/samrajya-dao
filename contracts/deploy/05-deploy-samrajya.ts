import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig, developmentChains } from "../helper-hardhat-config"
import { ethers } from "hardhat"
import { Samrajya } from "../typechain-types/Samrajya"

const deployBox: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------")
    log("Deploying Box and waiting for confirmations...")

    const usdcAddress =
        network.name === "hardhat" || network.name === "localhost"
            ? (await deployments.get("USDC")).address
            : ""
    const govTokenAddress = (await deployments.get("GovernanceToken")).address

    const samrajya = await deploy("Samrajya", {
        from: deployer,
        args: [usdcAddress, govTokenAddress],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })

    log(`samrajya at ${samrajya.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(samrajya.address, [])
    }
    const boxContract: Samrajya = await ethers.getContract("Samrajya")
    const timeLock = await ethers.getContract("TimeLock")
    const transferTx = await boxContract.transferOwnership(timeLock.address)
    await transferTx.wait(1)
}

export default deployBox
deployBox.tags = ["all", "samrajya"]
