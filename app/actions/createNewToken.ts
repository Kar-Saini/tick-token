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

const SECRET_KEY = process.env.SECRET_KEY!;
const ADDRESS = process.env.ADDRESS!;

export async function createAndMintNewToken(tokenData: tokenData) {
  const tokenAddedToDB = await addToDataBase(tokenData);
  console.log("tokenAddedToDB");
  console.log(tokenAddedToDB);
  const { umi, merkleTree } = await createUmiAddress(ADDRESS);

  const updatedTokenDetails = await prisma.tokenDetails.update({
    where: { id: tokenAddedToDB.id },
    data: {
      merkleTreeAddress: merkleTree.publicKey.toString(),
      merkleTreeSecretKey: bs58.encode(merkleTree.secretKey),
    },
  });

  console.log("updatedTokenDetails");
  console.log(updatedTokenDetails);

  const mintedTokens = await mintTokenToMerkleAddress(
    tokenData.tokenAmount,
    merkleTree.publicKey.toString(),
    tokenData.ownerAddress!,
    tokenData.tokenName,
    umi
  );
  console.log("Minted token txs:", mintedTokens);

  await prisma.tokenDetails.update({
    where: { id: tokenAddedToDB.id },
    data: { minted: true },
  });

  const qrForToken = await generateQrCode(tokenAddedToDB.id);
  console.log("qrForToken");
  console.log(qrForToken);
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
      mintingWalletAddress: ADDRESS,
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
  console.log("ownerAddress:", ownerAddress);
  console.log("merkleAddress:", merkleAddress);
  console.log("umi.identity.publicKey:", umi.identity.publicKey);
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
  const umi = createUmi(process.env.DEVNET!);
  const secretKeyUint8 = bs58.decode(SECRET_KEY); // Convert to Uint8Array
  umi.use(
    keypairIdentity({
      publicKey: mintingWalletAddress,
      secretKey: secretKeyUint8,
    })
  );
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
  const claimUrl = process.env.BASE_URL + `/claim/${tokenDetailId}`;
  const qrCodeDataUrl = await QRCode.toDataURL(claimUrl);

  return qrCodeDataUrl;
}
