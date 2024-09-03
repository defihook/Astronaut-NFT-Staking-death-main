import { web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
export const NETWORK = "devnet";

export const USER_POOL_SIZE = 3664;
export const GLOBAL_AUTHORITY_SEED = "global-authority";
export const EPOCH = 7200;
export const REWARD_TOKEN_DECIMAL = 1000000000;

export const ADMIN_PUBKEY = new PublicKey("Fs8R7R6dP3B7mAJ6QmWZbomBRuTbiJyiR4QYjoxhLdPu");
export const REWARD_TOKEN_MINT = new PublicKey("H3rmqbVz8NTCkGABeue3yc9PgioL2i1RPrQM45itdKMu");
export const PROGRAM_ID = "51dLXLR41vAQV5gQBExTNdDL5CadqcTh2HFvjnHoNHUz";

export const NFT_CREATOR = "GYq1mi8dh18nRAHbtdDuWiVRu4oAuSNzxoy3qStqX4RA"
export const METAPLEX = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');