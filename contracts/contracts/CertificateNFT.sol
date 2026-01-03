// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    event CertificateMinted(
        address recipient,
        uint256 tokenId,
        string tokenURI
    );

    constructor() ERC721("HackFiestaCertificate", "HFC") Ownable(msg.sender) {}

    function mintCertificate(
        address recipient,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newItemId = _tokenIds;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        emit CertificateMinted(recipient, newItemId, tokenURI);
        return newItemId;
    }
}
