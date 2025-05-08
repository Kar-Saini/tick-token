import { createTree } from "@metaplex-foundation/mpl-bubblegum";
import { createUmi, generateSigner } from "@metaplex-foundation/umi";

export async function createUmiAddress() {
  const umi = createUmi(process.env.HELIUS_URL);
  const merkleTree = generateSigner(umi);
  const builder = await createTree(umi, {
    merkleTree,
    maxDepth: 14,
    maxBufferSize: 64,
  });
  await builder.sendAndConfirm(umi);
  return { umi, merkleTree };
}
