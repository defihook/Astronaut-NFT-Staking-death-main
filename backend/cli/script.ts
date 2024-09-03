import { Program, web3 } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import {
    Keypair,
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    TransactionInstruction,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID, AccountLayout, MintLayout, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";

import fs from 'fs';
import { GlobalPool, UserPool } from './types';

const USER_POOL_SIZE = 3664;
const GLOBAL_AUTHORITY_SEED = "global-authority";

const ADMIN_PUBKEY = new PublicKey("Fs8R7R6dP3B7mAJ6QmWZbomBRuTbiJyiR4QYjoxhLdPu");
const REWARD_TOKEN_MINT = new PublicKey("8EoML7gaBJsgJtepm25wq3GuUCqLYHBoqd3HP1JxtyBx");
const PROGRAM_ID = "51dLXLR41vAQV5gQBExTNdDL5CadqcTh2HFvjnHoNHUz";

export const METAPLEX = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

anchor.setProvider(anchor.Provider.local(web3.clusterApiUrl("devnet")));
const solConnection = anchor.getProvider().connection;
const payer = anchor.getProvider().wallet;

let rewardVault: PublicKey = null;
let program: Program = null;
const idl = JSON.parse(
    fs.readFileSync(__dirname + "/staking_program.json", "utf8")
);

// Address of the deployed program.
const programId = new anchor.web3.PublicKey(PROGRAM_ID);

// Generate the program client from IDL.
program = new anchor.Program(idl, programId);
console.log('ProgramId: ', program.programId.toBase58());

const main = async () => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );
    console.log('GlobalAuthority: ', globalAuthority.toBase58());

    rewardVault = await getAssociatedTokenAccount(globalAuthority, REWARD_TOKEN_MINT);
    console.log('RewardVault: ', rewardVault.toBase58());
    console.log(await solConnection.getTokenAccountBalance(rewardVault));

    // await initProject();

    const globalPool: GlobalPool = await getGlobalState();
    // console.log("globalPool =", globalPool.totalAmount.toNumber());

    // await initUserPool(payer.publicKey);

    await stakeNft(payer.publicKey, new PublicKey('GF4XmpVKCf9aozU5igmr9sKNzDBkjvmiWujx8uC7Bnp4'), 15, "Doctor", 1);
    // await stakeNft(payer.publicKey, new PublicKey('FLuGogNV1UPns65SCz8ZLBnPx1P9EtcjVphvbyg2t6ix'), false);
    // await withdrawNft(payer.publicKey, new PublicKey('GF4XmpVKCf9aozU5igmr9sKNzDBkjvmiWujx8uC7Bnp4'));
    // await withdrawNft(payer.publicKey, new PublicKey('FLuGogNV1UPns65SCz8ZLBnPx1P9EtcjVphvbyg2t6ix'));
    // await claimReward(payer.publicKey);

    // const userPool: UserPool = await getUserPoolState(payer.publicKey);
    // console.log({
    //     // ...userPool,
    //     owner: userPool.owner.toBase58(),
    //     stakedMints: userPool.items.slice(0, userPool.itemCount.toNumber()).map((info) => {
    //         return {
    //             // ...info,
    //             mint: info.nftAddr.toBase58(),
    //             stakedTime: info.stakeTime.toNumber(),
    //             rank: info.rank.toNumber(),
    //         }
    //     }),
    //     stakedCount: userPool.itemCount.toNumber(),
    //     pendingReward: userPool.pendingReward.toNumber(),
    //     lastRewardTime: (new Date(1000 * userPool.rewardTime.toNumber())).toLocaleString(),
    // });
};

export const initProject = async (
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );
    const tx = await program.rpc.initialize(
        bump, {
        accounts: {
            admin: payer.publicKey,
            globalAuthority,
            rewardVault: rewardVault,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
        },
        signers: [],
    });
    await solConnection.confirmTransaction(tx, "confirmed");

    console.log("txHash =", tx);
    return false;
}

export const setAmount = async (
    userAddress: PublicKey,
    advAmount: number,
    sciAmount: number,
    docAmount: number,
    speAmount: number,
    comAmount: number,
    norAmount: number
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );
    const tx = await program.rpc.setAmount(
        bump,
        advAmount,
        sciAmount,
        docAmount,
        speAmount,
        comAmount,
        norAmount,
        {
            accounts: {
                admin: userAddress,
                globalAuthority,
            },
            signers: [],
        });
    await solConnection.confirmTransaction(tx, "confirmed");

    console.log("txHash =", tx);
}

export const initUserPool = async (
    userAddress: PublicKey,
) => {
    let userPoolKey = await PublicKey.createWithSeed(
        userAddress,
        "user-pool",
        program.programId,
    );

    console.log(USER_POOL_SIZE);
    let ix = SystemProgram.createAccountWithSeed({
        fromPubkey: userAddress,
        basePubkey: userAddress,
        seed: "user-pool",
        newAccountPubkey: userPoolKey,
        lamports: await solConnection.getMinimumBalanceForRentExemption(USER_POOL_SIZE),
        space: USER_POOL_SIZE,
        programId: program.programId,
    });

    const tx = await program.rpc.initializeFixedPool(
        {
            accounts: {
                userFixedPool: userPoolKey,
                owner: userAddress
            },
            instructions: [
                ix
            ],
            signers: []
        }
    );
    await solConnection.confirmTransaction(tx, "confirmed");

    console.log("Your transaction signature", tx);
    let poolAccount = await program.account.userPool.fetch(userPoolKey);
    console.log('Owner of initialized pool = ', poolAccount.owner.toBase58());
}

export const stakeNft = async (
    userAddress: PublicKey,
    mint: PublicKey,
    lock_period: number,
    role: string,
    model: number
) => {
    let userTokenAccount = await getAssociatedTokenAccount(userAddress, mint);
    console.log("NFT = ", mint.toBase58(), userTokenAccount.toBase58());

    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );

    let { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
        solConnection,
        userAddress,
        globalAuthority,
        [mint]
    );

    console.log("Dest NFT Account = ", destinationAccounts[0].toBase58())
    let userPoolKey = await PublicKey.createWithSeed(
        userAddress,
        "user-pool",
        program.programId,
    );

    let poolAccount = await solConnection.getAccountInfo(userPoolKey);
    console.log(poolAccount);
    if (poolAccount === null || poolAccount.data === null) {
        await initUserPool(userAddress);
    }
    const metadata = await getMetadata(mint);
    console.log("Metadata=", metadata.toBase58());


    const tx = await program.rpc.stakeNftToFixed(
        bump,
        new anchor.BN(lock_period),
        role,
        new anchor.BN(model), {
        accounts: {
            owner: userAddress,
            userFixedPool: userPoolKey,
            globalAuthority,
            userTokenAccount,
            destNftTokenAccount: destinationAccounts[0],
            nftMint: mint,
            mintMetadata: metadata,
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenMetadataProgram: METAPLEX,
        },
        instructions: [
            ...instructions,
        ],
        signers: [],
    }
    );
    await solConnection.confirmTransaction(tx, "singleGossip");
    console.log("txHash = ", tx);

}

export const withdrawNft = async (userAddress: PublicKey, mint: PublicKey) => {
    let userTokenAccount = await getAssociatedTokenAccount(userAddress, mint);
    console.log("NFT = ", mint.toBase58(), userTokenAccount.toBase58());

    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );

    let { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
        solConnection,
        userAddress,
        globalAuthority,
        [mint]
    );

    console.log("Dest NFT Account = ", destinationAccounts[0].toBase58());

    let userPoolKey = await PublicKey.createWithSeed(
        userAddress,
        "user-pool",
        program.programId,
    );

    const tx = await program.rpc.withdrawNftFromFixed(
        bump, {
        accounts: {
            owner: userAddress,
            userFixedPool: userPoolKey,
            globalAuthority,
            userTokenAccount,
            destNftTokenAccount: destinationAccounts[0],
            nftMint: mint,
            tokenProgram: TOKEN_PROGRAM_ID,
        },
        instructions: [
        ],
        signers: [],
    }
    );
    await solConnection.confirmTransaction(tx, "singleGossip");
}

export const claimRewardAll = async (userAddress: PublicKey) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );

    console.log("globalAuthority =", globalAuthority.toBase58());

    let userPoolKey = await PublicKey.createWithSeed(
        userAddress,
        "user-pool",
        program.programId,
    );

    let { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
        solConnection,
        userAddress,
        userAddress,
        [REWARD_TOKEN_MINT]
    );

    console.log("Dest NFT Account = ", destinationAccounts[0].toBase58());
    console.log(await solConnection.getTokenAccountBalance(destinationAccounts[0]));

    const tx = await program.rpc.claimRewardAll(
        bump, {
        accounts: {
            owner: userAddress,
            userFixedPool: userPoolKey,
            globalAuthority,
            rewardVault,
            userRewardAccount: destinationAccounts[0],
            tokenProgram: TOKEN_PROGRAM_ID,
        },
        instructions: [
            ...instructions,
        ],
        signers: []
    }
    );

    console.log("Your transaction signature", tx);
    await solConnection.confirmTransaction(tx, "singleGossip");

    console.log(await solConnection.getTokenAccountBalance(destinationAccounts[0]));
}

export const claimReward = async (userAddress: PublicKey, mint: PublicKey) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );

    console.log("globalAuthority =", globalAuthority.toBase58());

    let userPoolKey = await PublicKey.createWithSeed(
        userAddress,
        "user-pool",
        program.programId,
    );

    let { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
        solConnection,
        userAddress,
        userAddress,
        [REWARD_TOKEN_MINT]
    );

    console.log("Dest NFT Account = ", destinationAccounts[0].toBase58());
    console.log(await solConnection.getTokenAccountBalance(destinationAccounts[0]));

    const tx = await program.rpc.claimRewardAll(
        bump, {
        accounts: {
            owner: userAddress,
            userFixedPool: userPoolKey,
            globalAuthority,
            rewardVault,
            userRewardAccount: destinationAccounts[0],
            nftMint: mint,
            tokenProgram: TOKEN_PROGRAM_ID,
        },
        instructions: [
            ...instructions,
        ],
        signers: []
    }
    );

    console.log("Your transaction signature", tx);
    await solConnection.confirmTransaction(tx, "singleGossip");

    console.log(await solConnection.getTokenAccountBalance(destinationAccounts[0]));
}
export const getGlobalState = async (
): Promise<GlobalPool | null> => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );
    try {
        let globalState = await program.account.globalPool.fetch(globalAuthority);
        return globalState as GlobalPool;
    } catch {
        return null;
    }
}

export const getUserPoolState = async (
    userAddress: PublicKey
): Promise<UserPool | null> => {
    if (!userAddress) return null;

    let userPoolKey = await PublicKey.createWithSeed(
        userAddress,
        "user-pool",
        program.programId,
    );
    console.log('User Pool: ', userPoolKey.toBase58());
    try {
        let poolState = await program.account.userPool.fetch(userPoolKey);
        return poolState as UserPool;
    } catch {
        return null;
    }
}

const getAssociatedTokenAccount = async (ownerPubkey: PublicKey, mintPk: PublicKey): Promise<PublicKey> => {
    let associatedTokenAccountPubkey = (await PublicKey.findProgramAddress(
        [
            ownerPubkey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintPk.toBuffer(), // mint address
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    ))[0];
    return associatedTokenAccountPubkey;
}

export const getATokenAccountsNeedCreate = async (
    connection: anchor.web3.Connection,
    walletAddress: anchor.web3.PublicKey,
    owner: anchor.web3.PublicKey,
    nfts: anchor.web3.PublicKey[],
) => {
    let instructions = [], destinationAccounts = [];
    for (const mint of nfts) {
        const destinationPubkey = await getAssociatedTokenAccount(owner, mint);
        let response = await connection.getAccountInfo(destinationPubkey);
        if (!response) {
            const createATAIx = createAssociatedTokenAccountInstruction(
                destinationPubkey,
                walletAddress,
                owner,
                mint,
            );
            instructions.push(createATAIx);
        }
        destinationAccounts.push(destinationPubkey);
        if (walletAddress != owner) {
            const userAccount = await getAssociatedTokenAccount(walletAddress, mint);
            response = await connection.getAccountInfo(userAccount);
            if (!response) {
                const createATAIx = createAssociatedTokenAccountInstruction(
                    userAccount,
                    walletAddress,
                    walletAddress,
                    mint,
                );
                instructions.push(createATAIx);
            }
        }
    }
    return {
        instructions,
        destinationAccounts,
    };
}

export const createAssociatedTokenAccountInstruction = (
    associatedTokenAddress: anchor.web3.PublicKey,
    payer: anchor.web3.PublicKey,
    walletAddress: anchor.web3.PublicKey,
    splTokenMintAddress: anchor.web3.PublicKey
) => {
    const keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
        { pubkey: walletAddress, isSigner: false, isWritable: false },
        { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
        {
            pubkey: anchor.web3.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        {
            pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    return new anchor.web3.TransactionInstruction({
        keys,
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
    });
}
/** Get metaplex mint metadata account address */
export const getMetadata = async (mint: PublicKey): Promise<PublicKey> => {
    return (
        await PublicKey.findProgramAddress([Buffer.from('metadata'), METAPLEX.toBuffer(), mint.toBuffer()], METAPLEX)
    )[0];
};

main();