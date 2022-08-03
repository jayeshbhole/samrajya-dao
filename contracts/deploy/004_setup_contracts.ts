import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { networkConfig, developmentChains, ADDRESS_ZERO } from "../helper-hardhat-config";
import { ethers } from "hardhat";

const setupContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments, network } = hre;
    const { log } = deployments;
    const { deployer } = await getNamedAccounts();

    const governanceToken = await ethers.getContract("RAJToken", deployer);
    const timeLock = await ethers.getContract("Timelock", deployer);
    const governor = await ethers.getContract("SamrajyaDAO", deployer);

    log("----------------------------------------------------");
    log("Setting up contracts for roles...");

    // would be great to use multicall here...
    const proposerRole = await timeLock.PROPOSER_ROLE();
    const executorRole = await timeLock.EXECUTOR_ROLE();
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

    const proposerTx = await timeLock.grantRole(proposerRole, governor.address);
    await proposerTx.wait(1);
    const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO);
    await executorTx.wait(1);
    const revokeTx = await timeLock.revokeRole(adminRole, deployer);
    await revokeTx.wait(1);
};

export default setupContracts;
setupContracts.tags = ["all", "setup"];
