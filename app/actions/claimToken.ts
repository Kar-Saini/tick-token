"use server";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mintV1 } from "@metaplex-foundation/mpl-bubblegum";
import { PublicKey } from "@solana/web3.js";
import { none } from "@metaplex-foundation/umi";
import { keypairIdentity } from "@metaplex-foundation/umi";
import bs58 from "bs58";
import prisma from "@/app/lib/utils";

const SECRET_KEY = process.env.SECRET_KEY!;
const ADDRESS = process.env.ADDRESS!;
console.log(SECRET_KEY);

export async function claimToken(
  userWalletAddress: string,
  tokenDetailsId: string
) {
  try {
    const tokenDetails = await prisma.tokenDetails.findUnique({
      where: { id: tokenDetailsId },
    });
    const isTokenClaimed = await prisma.token.findFirst({
      where: { tokenDetailsId: tokenDetailsId, claimedBy: userWalletAddress },
    });
    if (isTokenClaimed) {
      throw new Error(
        "User has already cliamed token. TOKEN_CLAIMED_ID : " +
          isTokenClaimed.id
      );
    }
    if (
      !tokenDetails?.merkleTreeAddress ||
      !tokenDetails?.merkleTreeSecretKey
    ) {
      throw new Error("Merkle tree data or authority private key is missing.");
    }

    if (tokenDetails.totalClaimedToken >= tokenDetails.totalSupply) {
      throw new Error("All tokens have already been claimed.");
    }

    if (tokenDetails.ownerAddress === userWalletAddress) {
      throw new Error("Creator can't claim the token.");
    }

    const merkleTreeAddress = new PublicKey(tokenDetails.merkleTreeAddress);
    const umi = createUmi(process.env.DEVNET!);
    const secretKeyUint8 = bs58.decode(SECRET_KEY); // Convert to Uint8Array
    umi.use(
      keypairIdentity({
        publicKey: ADDRESS,
        secretKey: secretKeyUint8,
      })
    );

    const builder = mintV1(umi, {
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
            address: ADDRESS,
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
        claimedAt: new Date(),
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
