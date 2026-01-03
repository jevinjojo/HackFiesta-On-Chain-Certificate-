"use client";

import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../lib/contract";
import { useState, useEffect } from "react";

export function CertificateCard({ tokenId }: { tokenId: number }) {
    const { data: tokenURI } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "tokenURI",
        args: [tokenId],
    });

    const [metadata, setMetadata] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof tokenURI === "string") {
            setLoading(true);
            fetch(tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/"))
                .then((res) => res.json())
                .then((json) => {
                    setMetadata(json);
                    setError(null);
                })
                .catch(() => setError("Failed to load certificate metadata."))
                .finally(() => setLoading(false));
        }
    }, [tokenURI]);

    if (loading) {
        return (
            <div className="max-w-md bg-black/40 backdrop-blur-md shadow-lg rounded-lg p-6 mt-6 animate-pulse">
                <p className="text-gray-300">Loading certificate...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md bg-red-900/60 border border-red-500 rounded-lg p-6 mt-6">
                <p className="text-red-200">{error}</p>
            </div>
        );
    }

    if (!metadata) return null;

    const imageUrl = metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/");

    const handleDownload = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (err) {
            console.error("Download failed", err);
        }
    };


    return (
        <div className="max-w-md bg-black/50 backdrop-blur-md shadow-xl rounded-xl overflow-hidden mt-6 transition-transform hover:scale-105 hover:shadow-2xl">
            <img
                src={imageUrl}
                alt="Certificate"
                className="w-full h-64 object-cover"
            />
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-100">{metadata.name}</h2>
                <p className="text-gray-300 mt-2">{metadata.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                    {metadata.attributes?.map((attr: any, idx: number) => (
                        <span
                            key={idx}
                            className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm rounded-full shadow-sm"
                        >
                            {attr.trait_type}: {attr.value}
                        </span>
                    ))}
                </div>

                {/* 👇 Download button */}
                <div className="mt-6 flex gap-4">

                    {/* View button (opens in new tab) */}
                    <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" >
                        👀 View Certificate
                    </a>
                    {/* Download button (forces download) */}
                    <button
                        onClick={() => handleDownload(imageUrl, `certificate-${tokenId}.png`)}
                        className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    > ⬇️ Download Certificate
                    </button>
                </div>
            </div>
        </div>
    );
}
