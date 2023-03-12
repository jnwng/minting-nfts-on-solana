import {
  clusterApiUrl,
  Connection,
  sendAndConfirmRawTransaction,
  sendAndConfirmTransaction,
  Transaction,
} from '@solana/web3.js';
import { ReactNode, useEffect, useState } from 'react';
import LoadingIcons from 'react-loading-icons';

// const connection = new Connection(clusterApiUrl('mainnet-beta'));
const connection = new Connection(
  'https://rpc.helius.xyz/?api-key=3e135118-97af-4caf-b9b2-a2e7fc7e9736',
);

export default function IndexPage() {
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mintAddress, setMintAddress] = useState<string | null>(null);

  useEffect(() => {
    async function createNft() {
      const response = await fetch('/api/createNft', {
        method: 'POST',
      });
      const json = await response.json();
      const { tx, mintAddress } = json;

      const txSig = await sendAndConfirmRawTransaction(
        connection,
        Buffer.from(tx),
        {
          commitment: 'processed',
          skipPreflight: true,
        },
      );
      console.info({ txSig });

      setMintAddress(mintAddress);
      setLoading(false);
    }
    if (counter > 0) {
      createNft();
    }
  }, [counter]);

  let buttonText: ReactNode = `Mint an NFT on Solana!`;
  if (loading) {
    buttonText = <LoadingIcons.Oval stroke="#FFFFFF" />;
  } else if (mintAddress) {
    buttonText = (
      <a href={`https://explorer.solana.com/address/${mintAddress}`}>
        See on Explorer
      </a>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        height: '250px',
        alignItems: 'center',
      }}
    >
      <button
        onClick={() => {
          setCounter(counter + 1);
        }}
        className="h-12 px-6 m-2 text-4xl transition-colors duration-150 bg-[#9945FF] rounded-lg focus:shadow-outline "
      >
        {buttonText}
      </button>
    </div>
  );
}
