"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../lib/contract";
import { CertificateCard } from "../components/CertificateCard";

export default function Home() {
  const { address, status } = useAccount();
  const {
    writeContract,
    isPending,
    isSuccess,
    data: txData, // 👈 transaction hash string
    error,
  } = useWriteContract();

  const handleMint = () => {
    if (!address) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "mintCertificate",
      args: [
        address,
        "ipfs://QmbkDo7FGx3hm4zEABKtukiJ57xsRk5pDhF2mZGJYDwG6V", // ✅ your metadata CID
      ],
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight">
        HackFiesta Certificates Demo
      </h1>

      <ConnectButton />

      <button
        onClick={handleMint}
        disabled={isPending || status !== "connected"}
        className={`mt-8 px-6 py-3 rounded-lg font-semibold transition-colors duration-200
          ${isPending || status !== "connected"
            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"}`}
      >
        {isPending ? "Minting..." : "Claim Certificate"}
      </button>

      <div className="mt-6 text-center space-y-4 w-full max-w-lg">
        {status !== "connected" && (
          <div className="bg-yellow-900/40 border border-yellow-600 rounded-lg p-4">
            <p className="text-yellow-300">🔑 Please connect your wallet to mint a certificate.</p>
          </div>
        )}

        {isSuccess && (
          <div className="bg-green-900/40 border border-green-600 rounded-lg p-4 space-y-2">
            <p className="text-green-300 font-semibold text-lg flex items-center justify-center gap-2">
              ✅ Certificate minted successfully!
            </p>
            {txData && (
              <p className="text-sm text-green-200">
                View on Etherscan:{" "}
                <a
                  href={`https://sepolia.etherscan.io/tx/${txData}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-green-100 break-all"
                >
                  {txData}
                </a>
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-900/40 border border-red-600 rounded-lg p-4">
            <p className="text-red-300 font-medium flex items-center justify-center gap-2">
              ⚠️ Transaction failed: {error.message}
            </p>
          </div>
        )}
      </div>

      {/* 👇 Show certificate card (example: tokenId=1) */}
      {isSuccess && (
        <div className="mt-10">
          <CertificateCard tokenId={1} />
        </div>
      )}
    </main>
  );
}
