"use server";

import prisma from "@/app/lib/utils";
import { tokenData } from "@/app/lib/types";
import { mintV1 } from "@metaplex-foundation/mpl-bubblegum";
import { createTree } from "@metaplex-foundation/mpl-bubblegum";
import { generateSigner, keypairIdentity } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { none } from "@metaplex-foundation/umi";
import QRCode from "qrcode";

export async function createAndMintNewToken(tokenData: tokenData) {
  const tokenAddedToDB = await addToDataBase(tokenData);
  const { umi, merkleTree } = await createUmiAddress(
    tokenData.mintingWalletAddress
  );
  await prisma.tokenDetails.update({
    where: { id: tokenAddedToDB.id },
    data: {
      merkleTreeAddress: merkleTree.publicKey.toString(),
      merkleTreeSecretKey: bs58.encode(merkleTree.secretKey),
    },
  });

  const mintedTokens = await mintTokenToMerkleAddress(
    tokenData.tokenAmount,
    merkleTree.publicKey.toString(),
    tokenData.mintingWalletAddress,
    tokenData.tokenName,
    umi
  );
  console.log("Minted token txs:", mintedTokens);

  // Step 5: Update the database to mark the token as minted
  await prisma.tokenDetails.update({
    where: { id: tokenAddedToDB.id },
    data: { minted: true },
  });

  const qrForToken = await generateQrCode(tokenAddedToDB.id);
  await prisma.tokenDetails.update({
    where: { id: tokenAddedToDB.id },
    data: { qrString: qrForToken },
  });

  return { tokenAddedToDB, mintedTokens };
}

async function addToDataBase(tokenData: tokenData) {
  try {
    const data: any = {
      tokenName: tokenData.tokenName,
      tokenSymbol: tokenData.tokenSymbol,
      totalSupply: tokenData.tokenAmount,
      totalClaimedToken: 0,
      ownerAddress: tokenData.ownerAddress,
      mintingWalletAddress: tokenData.mintingWalletAddress,
    };

    const eventData: any = {};
    let tokenDetails;

    if (tokenData.eventRegistration) {
      eventData.eventName = tokenData.eventName;
      eventData.eventDate = tokenData.eventDate;
      eventData.eventDescription = tokenData.eventDescription;
      tokenDetails = await prisma.tokenDetails.create({
        data,
      });
      eventData.tokenDetailsId = tokenDetails.id;
      await prisma.event.create({ data: eventData });
    } else {
      tokenDetails = await prisma.tokenDetails.create({
        data,
      });
    }

    return tokenDetails;
  } catch (error) {
    console.error("Error creating token:", error);
    throw error;
  }
}

async function mintTokenToMerkleAddress(
  amount: number,
  merkleAddress: string,
  ownerAddress: string,
  name: string,
  umi: any
) {
  const mintResults: any[] = [];

  try {
    for (let i = 0; i < amount; i++) {
      const mintBuilder = mintV1(umi, {
        leafOwner: new PublicKey(ownerAddress),
        merkleTree: new PublicKey(merkleAddress),
        metadata: {
          name: `${name} #${i + 1}`,
          uri: "https://example.com/my-cnft.json",
          sellerFeeBasisPoints: 500,
          collection: none(),
          creators: [
            {
              address: umi.identity.publicKey,
              verified: true,
              share: 100,
            },
          ],
        },
      });

      const txSignature = await mintBuilder.sendAndConfirm(umi);
      console.log(txSignature);
      mintResults.push(txSignature);
    }

    return mintResults;
  } catch (error) {
    console.error("Minting failed", error);
    throw error;
  }
}

async function createUmiAddress(mintingWalletAddress: string) {
  const umi = createUmi("https://api.devnet.solana.com");

  // Use the minting wallet's public key as the identity instead of a private key
  const mintingWalletPublicKey = new PublicKey(mintingWalletAddress);
  umi.use(keypairIdentity({ publicKey: mintingWalletPublicKey }));

  const merkleTree = generateSigner(umi);
  const builder = await createTree(umi, {
    merkleTree,
    maxDepth: 14,
    maxBufferSize: 64,
  });
  console.log(umi);
  console.log(merkleTree);
  await builder.sendAndConfirm(umi);
  return { umi, merkleTree };
}

async function generateQrCode(tokenDetailId: string) {
  const claimUrl = `/claim?tokenId=${tokenDetailId}`;
  const qrCodeDataUrl = await QRCode.toDataURL(claimUrl);
  return qrCodeDataUrl;
}
