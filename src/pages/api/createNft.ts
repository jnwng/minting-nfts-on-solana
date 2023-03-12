import fs from 'fs';
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
} from '@metaplex-foundation/js';
import { Keypair } from '@solana/web3.js';
import { NextApiRequest, NextApiResponse } from 'next';
import { Connection } from '@solana/web3.js';
import { createNft } from '@/create-nft';

import env from '../../env';

const keypairFile = fs.readFileSync(env.KEYPAIR_FILE, 'utf-8');
const wallet = Keypair.fromSecretKey(Buffer.from(JSON.parse(keypairFile)));

const connection = new Connection(env.RPC_URL);
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(wallet))
  .use(bundlrStorage({ address: 'https://devnet.bundlr.network' }));

const uploadNFT = async () => {
  console.info('Creating NFT');

  const mintAddress = Keypair.generate();
  const txBuilder = await createNft(metaplex, mintAddress, wallet);

  const latestBlockhash = await connection.getLatestBlockhash();
  const tx = txBuilder.toTransaction(latestBlockhash);
  tx.feePayer = wallet.publicKey;
  tx.sign(wallet, mintAddress);

  return { tx: tx.serialize(), mintAddress: mintAddress.publicKey.toBase58() };
};

const requestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const nft = await uploadNFT();
    return res.json(nft);
  } else {
    res.send(405);
  }
};

export default requestHandler;
