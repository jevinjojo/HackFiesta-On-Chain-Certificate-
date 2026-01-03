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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 text-white">
      <h1 className="text-5xl font-extrabold mb-10 tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
        HackFiesta 2026 - Certificate of Participation
      </h1>

      <ConnectButton />

      <button
        onClick={handleMint}
        disabled={isPending || status !== "connected"}
        className={`mt-8 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${isPending || status !== "connected" ? "bg-gradient-to-r from-slate-800 via-slate-900 to-blue-950 text-slate-400 border border-slate-700 cursor-not-allowed shadow-inner" : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"}`}
      >
        {isPending ? "Minting..." : "Claim Certificate"}
      </button>

      <div className="mt-6 text-center space-y-4 w-full max-w-lg">
        {status !== "connected" && (
          <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-blue-950 border border-slate-700 rounded-xl p-5 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-blue-400 text-xl">🔒</span>
              <div className="text-left">
                <p className="text-white font-semibold text-lg">Wallet Not Connected</p>
                <p className="text-slate-300 text-sm mt-1">
                  Connect your wallet to claim your HackFiesta certificate securely.
                </p>
              </div>
            </div>
          </div>
        )}




        {isSuccess && (
          <div className="bg-gradient-to-r from-black via-gray-900 to-gray-800 border border-green-500 rounded-xl p-6 shadow-lg space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-green-400 text-xl">✅</span>
              <p className="text-white font-semibold text-lg">
                Certificate minted successfully!
              </p>
            </div>
            {txData && (
              <p className="text-sm text-white-900 text-center">
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
