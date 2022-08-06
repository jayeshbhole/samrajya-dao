import {
    GovernorContract,
    GovernanceToken,
    TimeLock,
    Box,
    Samrajya,
    USDC,
} from "../../typechain-types"
import { deployments, ethers, getNamedAccounts } from "hardhat"
import { assert, expect } from "chai"
import {
    PROPOSAL_DESCRIPTION,
    VOTING_DELAY,
    VOTING_PERIOD,
    MIN_DELAY,
} from "../../helper-hardhat-config"
import { moveBlocks } from "../../utils/move-blocks"
import { moveTime } from "../../utils/move-time"
import { BigNumber } from "ethers"

describe("Governor Flow", async () => {
    let governor: GovernorContract
    let governanceToken: GovernanceToken
    let timeLock: TimeLock
    // let samrajya: Samrajya
    let usdc: USDC
    let deployer: any

    const voteWay = 1 // for
    const reason = "I lika do da cha cha"
    beforeEach(async () => {
        const { deployer: _deployer } = await getNamedAccounts()
        deployer = _deployer

        await deployments.fixture(["all"])
        governor = await ethers.getContract("GovernorContract")
        timeLock = await ethers.getContract("TimeLock")
        governanceToken = await ethers.getContract("GovernanceToken")
        // samrajya = await ethers.getContract("Samrajya")
        usdc = await ethers.getContract("USDC")
    })

    it("donate USDC", async () => {
        const usdcBalance = await usdc.balanceOf(timeLock.address)
        const deployerBalance = await usdc.balanceOf(deployer)
        it("should approve USDC to TimeLock", async () => {
            // approve usdc to timelock contract
            const usdcApproveTx = await usdc.approve(timeLock.address, deployerBalance)
            await usdcApproveTx.wait(1)

            // check allowance
            const usdcAllowance = await usdc.allowance(deployer, timeLock.address)
            expect(usdcAllowance).to.equal(deployerBalance)
        })

        it("should transfer USDC to TimeLock", async () => {
            const tx = await timeLock.donate(ethers.utils.parseUnits("1", 8))
            await tx.wait(1)

            const newBalance = await usdc.balanceOf(timeLock.address)
            expect(newBalance).to.equal(usdcBalance)
        })
    })

    it("proposes, votes, waits, queues, and then executes", async () => {
        console.log((await timeLock.treasuryBalance()).toString())
        // propose
        const encodedFunctionCall = timeLock.interface.encodeFunctionData("sponsor", [
            "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
            ethers.utils.parseUnits("1", 8),
        ])
        const proposeTx = await governor.propose(
            [timeLock.address],
            [0],
            [encodedFunctionCall],
            PROPOSAL_DESCRIPTION
        )

        const proposeReceipt = await proposeTx.wait(1)
        const proposalId = proposeReceipt.events![0].args!.proposalId

        let proposalState = await governor.state(proposalId)
        console.log(`Current Proposal State: ${proposalState}`)

        await moveBlocks(VOTING_DELAY + 1)
        // vote
        const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason)
        await voteTx.wait(1)

        proposalState = await governor.state(proposalId)
        assert.equal(proposalState.toString(), "1")

        console.log(`Current Proposal State: ${proposalState}`)
        await moveBlocks(VOTING_PERIOD + 1)

        // queue & execute
        // const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))
        const descriptionHash = ethers.utils.id(PROPOSAL_DESCRIPTION)
        const queueTx = await governor.queue(
            [timeLock.address],
            [0],
            [encodedFunctionCall],
            descriptionHash
        )
        await queueTx.wait(1)

        await moveTime(MIN_DELAY + 1)
        await moveBlocks(1)

        proposalState = await governor.state(proposalId)
        console.log(`Current Proposal State: ${proposalState}`)

        const usdcBalance = await usdc.balanceOf(timeLock.address)
        const deployerBalance = await usdc.balanceOf(deployer)

        // approve usdc to timelock contract
        const usdcApproveTx = await usdc.approve(timeLock.address, deployerBalance)
        await usdcApproveTx.wait(1)

        // check allowance
        const usdcAllowance = await usdc.allowance(deployer, timeLock.address)
        expect(usdcAllowance).to.equal(deployerBalance)

        const tx = await timeLock.donate(ethers.utils.parseUnits("1", 8))
        await tx.wait(1)

        console.log((await timeLock.treasuryBalance()).toString())

        console.log("Executing...")
        const exTx = await governor.execute(
            [timeLock.address],
            [0],
            [encodedFunctionCall],
            descriptionHash
        )
        await exTx.wait(1)

        console.log((await timeLock.treasuryBalance()).toString())
        expect(await timeLock.treasuryBalance()).to.equal(BigNumber.from("0"))
    })
})
