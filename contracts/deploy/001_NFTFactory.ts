import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { ethers, deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    await deploy("NFTFactory", {
        from: deployer,
        args: [],
        log: true,
    });
};
export default func;
module.exports.tags = ["NFTFactory"];
