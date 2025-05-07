import { generateSigner, createUmi } from "@metaplex-foundation/umi";
import { createTree } from "@metaplex-foundation/mpl-bubblegum";

async function createUmiAddress() {
  const umi = createUmi();
  const merkleTree = generateSigner(umi);
  const builder = await createTree(umi, {
    merkleTree,
    maxDepth: 14,
    maxBufferSize: 64,
  });
  await builder.sendAndConfirm(umi);
}
