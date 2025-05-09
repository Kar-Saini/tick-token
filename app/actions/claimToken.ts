"use server";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mintV1 } from "@metaplex-foundation/mpl-bubblegum";
import { PublicKey } from "@solana/web3.js";
import { none } from "@metaplex-foundation/umi";
import { keypairIdentity } from "@metaplex-foundation/umi";
import bs58 from "bs58";
import prisma from "@/app/lib/utils";

export async function claimToken(
  userWalletAddress: string,
  tokenDetailsId: string
) {
  try {
    const tokenDetails = await prisma.tokenDetails.findUnique({
      where: { id: tokenDetailsId },
    });

    if (!tokenDetails?.merkleTreeAddress || !tokenDetails?.merklePrivateKey) {
      throw new Error("Merkle tree data or authority private key is missing.");
    }

    if (tokenDetails.totalClaimedToken >= tokenDetails.totalSupply) {
      throw new Error("All tokens have already been claimed.");
    }

    if (tokenDetails.address === userWalletAddress) {
      throw new Error("Creator can't claim the token.");
    }

    const merkleTreeAddress = new PublicKey(tokenDetails.merkleTreeAddress);
    const umi = createUmi("https://api.devnet.solana.com");

    const authorityKeypair = umi.eddsa.createKeypairFromSecretKey(
      bs58.decode(tokenDetails.merkleTreeSecretKey as string)
    );

    umi.use(keypairIdentity(authorityKeypair));

    const builder = await mintV1(umi, {
      merkleTree: merkleTreeAddress,
      leafOwner: new PublicKey(userWalletAddress),
      leafDelegate: new PublicKey(userWalletAddress),
      metadata: {
        name: tokenDetails.tokenName,
        uri: "https://example.com/my-cnft.json", // Ideally make this dynamic
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

    await prisma.tokenDetails.update({
      where: { id: tokenDetailsId },
      data: {
        totalClaimedToken: { increment: 1 },
      },
    });

    const claimedToken = await prisma.token.create({
      data: {
        claimed: true,
        claimedBy: userWalletAddress,
        tokenDetailsId: tokenDetailsId,
      },
      include: {
        tokenDetails: true,
      },
    });

    console.log("Claim successful");
    return claimedToken.id;
  } catch (err) {
    console.error("Error during token claim:", err);
    throw err;
  }
}
