import { expect } from "chai";
import { ethers, deployments, getNamedAccounts } from "hardhat";
import { Contract } from "ethers";

const setupTest = deployments.createFixture(
    async ({ deployments, getNamedAccounts, ethers }, options) => {
        await deployments.fixture(); // ensure you start from a fresh deployments
        const { deployer } = await getNamedAccounts();
        const TokenContract = await ethers.getContract("NFTFactory", deployer);

        return {
            deployer,
            TokenContract,
        };
    }
);

describe("NFTFactory", () => {
    const TOKEN_URI = "http://example.com/ip_records/42";
    let nftContract: Contract;
    let deployer: string;

    before(async () => {
        const { deployer: _deployer } = await getNamedAccounts();
        deployer = _deployer;
    });

    beforeEach(async () => {
        const { TokenContract } = await setupTest();
        nftContract = TokenContract;
    });

    const mintNftDefault = async () => {
        return nftContract.mintNFT(deployer, TOKEN_URI);
    };

    describe("mintNft", async () => {
        it("emits the Transfer event", async () => {
            await expect(await mintNftDefault())
                .to.emit(nftContract, "Transfer")
                .withArgs(ethers.constants.AddressZero, deployer, "1");
        });

        it("returns the new item ID", async () => {
            await expect(
                (await nftContract.callStatic.mintNFT(deployer, TOKEN_URI)).toString()
            ).to.eq("1");
        });

        it("increments the item ID", async () => {
            const STARTING_NEW_ITEM_ID = "1";
            const NEXT_NEW_ITEM_ID = "2";

            await expect(mintNftDefault())
                .to.emit(nftContract, "Transfer")
                .withArgs(ethers.constants.AddressZero, deployer, STARTING_NEW_ITEM_ID);

            await expect(mintNftDefault())
                .to.emit(nftContract, "Transfer")
                .withArgs(ethers.constants.AddressZero, deployer, NEXT_NEW_ITEM_ID);
        });

        it("cannot mint to address zero", async () => {
            const TX = nftContract.mintNFT(ethers.constants.AddressZero, TOKEN_URI);
            await expect(TX).to.be.revertedWith("ERC721: mint to the zero address");
        });
    });

    describe("balanceOf", () => {
        it("gets the count of NFTs for this address", async () => {
            await expect(await nftContract.balanceOf(deployer)).to.eq("0");

            await mintNftDefault();

            expect(await nftContract.balanceOf(deployer)).to.eq("1");
        });
    });
});
