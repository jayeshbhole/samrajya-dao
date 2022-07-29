import { ethers, deployments, getNamedAccounts } from "hardhat";
import { Contract } from "ethers";

import { NFTStorage, File } from "nft.storage";
import { Token } from "nft.storage/src/lib/interface";

import mime from "mime";
import fs from "fs";
import path from "path";

// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY || "";

type NFT = Token<{
    image: globalThis.File;
    name: string;
    description: string;
    attributes: {
        display_type: string;
        trait_type: string;
        value: number;
    }[];
}>;

/**
 * Reads an image file from `imagePath` and stores an NFT with the given name and description.
 * @param {string} imagePath the path to an image file
 * @param {string} name a name for the NFT
 * @param {string} description a text description for the NFT
 */
async function storeNFT(imagePath: string, name: string, description: string): Promise<NFT> {
    const image = await fileFromPath(imagePath);
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });

    // call client.store, passing in the image & metadata
    return nftstorage.store({
        image,
        name,
        description,
        attributes: [
            {
                display_type: "number",
                trait_type: "level",
                value: Math.floor(Math.random() * 10),
            },
            {
                display_type: "number",
                trait_type: "generation",
                value: 1,
            },
        ],
    });
}

async function storeNFTs(): Promise<NFT[]> {
    const imageDirPath = "./images";
    const name = "A YAY NFT";
    const description = "YAY NFTs are cool. They are cool and aesthetic pictures";

    const files = await fs.promises.readdir(imageDirPath);
    const promises = files.map(async (file) => {
        const imagePath = path.join(imageDirPath, file);
        const result = await storeNFT(imagePath, name, description);
        console.log(result);
        return result;
    });

    console.log("Waiting for all NFTs to be stored...");
    const nfts = await Promise.all(promises);

    console.log("All NFTs stored!");
    return nfts;
}

const mintNFT = async (nftPromises: NFT[]) => {
    const { deployer } = await getNamedAccounts();
    const nftContract = await ethers.getContract("NFTFactory", deployer);
    console.log(`Minted NFTs at ${nftContract.address}`);

    for (const nftPromise of nftPromises) {
        const nft = nftPromise;
        const nftId = await nftContract.mintNFT(deployer, nft.url);
        console.log(`Minted NFT`, nftId.toString());
    }
};

async function fileFromPath(filePath: string) {
    const content = await fs.promises.readFile(filePath);
    const type = mime.getType(filePath);
    // @ts-ignore
    return new File([content], path.basename(filePath), { type });
}

async function main() {
    const nfts = await storeNFTs();
    await mintNFT(nfts);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
