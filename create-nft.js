import { createNft, fetchAllDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { airdropIfRequired, getExplorerLink, getKeypairFromFile } from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl} from "@solana/web3.js";
import{generateSigner, keypairIdentity, percentAmount,publicKey} from "@metaplex-foundation/umi";
const connection = new Connection(clusterApiUrl("devnet"));
const user = await getKeypairFromFile();
await airdropIfRequired(
    connection,
    user.publicKey,
    1 * LAMPORTS_PER_SOL,
    0.5 * LAMPORTS_PER_SOL
);
console.log("loaded user:", user.publicKey.toBase58());
const umi = createUmi("https://api.devnet.solana.com")
umi.use(mplTokenMetadata());
const umiUser=umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));
console.log("set up Umi instance for user:");
const collectionAddress=publicKey("GrMzmQX5RhD1d8b6p4No1G4yZ8KuZRkhmC3CqpquEiVH");
console.log("Creating Nft...")
const mint = generateSigner(umi);
const transaction = await createNft(umi,{
    mint,
    name:"My NFT",
    uri:"https>>>",
    sellerFeeBasisPoints: percentAmount(0),
    collection:{
        key: collectionAddress,
        verified: false, // Set to true if the collection is verified
    },
})
await transaction.sendAndConfirm(umi);
const createdNft = await fetchAllDigitalAsset(umi, [mint.publicKey]);
console.log("🖼️created NFT ! address is",getExplorerLink("address",createNft.mint.publicKey,"devnet"))
