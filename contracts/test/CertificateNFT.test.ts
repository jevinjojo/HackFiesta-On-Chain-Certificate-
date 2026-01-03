import { expect } from "chai";
import { ethers } from "hardhat";

describe("CertificateNFT", function () {
    it("Should deploy and mint a certificate", async function () {
        const [owner, recipient] = await ethers.getSigners();
        const CertificateNFT = await ethers.getContractFactory("CertificateNFT");
        const certificate = await CertificateNFT.deploy();
        await certificate.waitForDeployment();

        const tx = await certificate.mintCertificate(recipient.address, "ipfs://sample-uri");
        await tx.wait();

        const balance = await certificate.balanceOf(recipient.address);
        expect(balance).to.equal(1);

        const tokenURI = await certificate.tokenURI(1);
        expect(tokenURI).to.equal("ipfs://sample-uri");

    });
}); 