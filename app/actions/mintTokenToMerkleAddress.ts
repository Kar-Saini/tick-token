import { mintV1 } from "@metaplex-foundation/mpl-bubblegum";
import { none } from "@metaplex-foundation/umi";
import { PublicKey } from "@solana/web3.js";

export async function mintTokenToMerkleAddress(
  amount: number,
  merkleAddress: string,
  ownerAddress: string,
  name: string,
  umi: any
) {
  try {
    for (let i = 0; i < amount; i++) {
      const mintBuilder = await mintV1(umi, {
        leafOwner: new PublicKey(ownerAddress),
        merkleTree: new PublicKey(merkleAddress),
        metadata: {
          name: `${name} #${i + 1}`,
          uri: "https://example.com/my-cnft.json", // You could customize this per NFT
          sellerFeeBasisPoints: 500,
          collection: none(),
          creators: [
            {
              address: new PublicKey(ownerAddress),
              verified: false,
              share: 100,
            },
          ],
        },
      });

      await mintBuilder.sendAndConfirm(umi);
    }
  } catch (error) {
    console.error("Minting failed", error);
  }
}
