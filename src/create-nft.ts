import { Metaplex } from '@metaplex-foundation/js';
import { UseMethod } from '@metaplex-foundation/mpl-token-metadata';
import { Signer } from '@solana/web3.js';

export const createNft = async (
  metaplex: Metaplex,
  mintAddress: Signer,
  hotWallet: Signer,
) => {
  const txBuilder = await metaplex
    .nfts()
    .builders()
    .create(
      {
        name: 'Solana',
        symbol: 'TEST_NFT',
        uri: 'https://arweave.net/cl_HJfpeWnhMdxrnPpEZ8jQwhhNJWUmqYWDUp9NGcMg',
        sellerFeeBasisPoints: 500,
        useNewMint: mintAddress,
        uses: {
          useMethod: UseMethod.Multiple,
          remaining: 3,
          total: 3,
        },
      },
      { payer: hotWallet },
    );

  return txBuilder;
};
