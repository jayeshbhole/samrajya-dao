import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { networkConfig, developmentChains, MIN_DELAY } from "../helper-hardhat-config";
import verify from "../scripts/verify";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log("----------------------------------------------------\n");
    log("Deploying TimeLock and waiting for confirmations...");

    const timeLock = await deploy("Timelock", {
        from: deployer,
        args: [MIN_DELAY, [], []],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    });

    log(`TimeLock at ${timeLock.address}`);
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(timeLock.address, []);
    }
};
export default func;
module.exports.tags = ["Timelock", "all"];
