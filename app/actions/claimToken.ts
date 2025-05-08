import { createUmi } from "@metaplex-foundation/umi";
import { mintV1 } from "@metaplex-foundation/mpl-bubblegum";
import { PublicKey } from "@solana/web3.js";
import { none } from "@metaplex-foundation/umi";
import { keypairIdentity } from "@metaplex-foundation/umi";
import bs58 from "bs58";
import prisma from "@/lib/utils";

export async function claimToken(
  userWalletAddress: string,
  tokenDetailsId: string
) {
  try {
    const tokenDetails = await prisma.tokenDetails.findUnique({
      where: { id: tokenDetailsId },
    });

    if (
      !tokenDetails?.merkleTreeAddress ||
      !tokenDetails?.merkleTreeSecretKey
    ) {
      throw new Error("Merkle tree address not found for token.");
    }

    const merkleTreeAddress = new PublicKey(tokenDetails.merkleTreeAddress);
    const TREE_AUTHORITY_SECRET_KEY = tokenDetails.merkleTreeSecretKey;
    const umi = createUmi(process.env.HELIUS_URL);

    const authorityKeypair = umi.eddsa.createKeypairFromSecretKey(
      bs58.decode(TREE_AUTHORITY_SECRET_KEY)
    );
    umi.use(keypairIdentity(authorityKeypair));

    const builder = await mintV1(umi, {
      merkleTree: new PublicKey(merkleTreeAddress),
      leafOwner: new PublicKey(userWalletAddress), // This is the actual owner of the cNFT
      leafDelegate: new PublicKey(userWalletAddress),
      metadata: {
        name: tokenDetails.tokenName, // optionally fetch from DB
        uri: "https://example.com/my-cnft.json", // update to point to metadata
        sellerFeeBasisPoints: 500,
        collection: none(),
        creators: [
          {
            address: authorityKeypair.publicKey,
            verified: false,
            share: 100,
          },
        ],
      },
    });

    await builder.sendAndConfirm(umi);
    console.log("Claim successful");
  } catch (err) {
    console.error("Error during token claim:", err);
    throw err;
  }
}
