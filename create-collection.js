import { createNft, fetchAllDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { airdropIfRequired, getExplorerLink, getKeypairFromFile } from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import{generateSigner, keypairIdentity, percentAmount} from "@metaplex-foundation/umi";
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
console.log("set up instance for user:");
const collectionMint = generateSigner(umi);
const transaction = await createNft(umi, {
    mint: collectionMint,
    name: "My Collection",
    symbol: "MYCOL",
    uri: "https://raw.githubusercontent.com/Aditya26K/solana-nft/main/nature-nft.json",
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true,});
    await transaction.sendAndConfirm(umi);
    const createdCollectionNft = await fetchAllDigitalAsset(
        umi, 
        [collectionMint.publicKey]
    );
    console.log("created collection 📦! Adress is ",getExplorerLink(
        "address",
        collectionMint.publicKey,
        "devnet")
);
