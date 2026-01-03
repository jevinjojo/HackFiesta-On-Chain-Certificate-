import { ethers } from "hardhat";

async function main() {
    const CertificateNFT = await ethers.getContractFactory("CertificateNFT");
    const certificate = await CertificateNFT.deploy();
    await certificate.waitForDeployment();
    console.log("CertificateNFT deployed to:", certificate.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});