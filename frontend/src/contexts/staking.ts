export type StakingType = {
    "version": "0.1.0",
    "name": "staking_program",
    "instructions": [
        {
            "name": "initialize",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "setAmount",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                },
                {
                    "name": "advAmount",
                    "type": "u64"
                },
                {
                    "name": "sciAmount",
                    "type": "u64"
                },
                {
                    "name": "docAmount",
                    "type": "u64"
                },
                {
                    "name": "speAmount",
                    "type": "u64"
                },
                {
                    "name": "comAmount",
                    "type": "u64"
                },
                {
                    "name": "norAmount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "initializeFixedPool",
            "accounts": [
                {
                    "name": "userFixedPool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": []
        },
        {
            "name": "stakeNftToFixed",
            "accounts": [
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "userFixedPool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "destNftTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "nftMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "mintMetadata",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenMetadataProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                },
                {
                    "name": "lockPeriod",
                    "type": "i64"
                },
                {
                    "name": "role",
                    "type": "string"
                },
                {
                    "name": "model",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "withdrawNftFromFixed",
            "accounts": [
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "userFixedPool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "destNftTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "nftMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "claimRewardAll",
            "accounts": [
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "userFixedPool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "rewardVault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userRewardAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "claimReward",
            "accounts": [
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "userFixedPool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "rewardVault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userRewardAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "nftMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "GlobalPool",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "admin",
                        "type": "publicKey"
                    },
                    {
                        "name": "totalAmount",
                        "type": "u64"
                    },
                    {
                        "name": "adventureRate",
                        "type": "u64"
                    },
                    {
                        "name": "scientistRate",
                        "type": "u64"
                    },
                    {
                        "name": "doctorRate",
                        "type": "u64"
                    },
                    {
                        "name": "specialistRate",
                        "type": "u64"
                    },
                    {
                        "name": "commanderRate",
                        "type": "u64"
                    },
                    {
                        "name": "normalRate",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "UserPool",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "owner",
                        "type": "publicKey"
                    },
                    {
                        "name": "itemCount",
                        "type": "u64"
                    },
                    {
                        "name": "items",
                        "type": {
                            "array": [
                                {
                                    "defined": "StakedNFT"
                                },
                                50
                            ]
                        }
                    },
                    {
                        "name": "rewardTime",
                        "type": "i64"
                    },
                    {
                        "name": "pendingReward",
                        "type": "u64"
                    }
                ]
            }
        }
    ],
    "types": [
        {
            "name": "StakedNFT",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "nftAddr",
                        "type": "publicKey"
                    },
                    {
                        "name": "stakeTime",
                        "type": "i64"
                    },
                    {
                        "name": "rewardTime",
                        "type": "i64"
                    },
                    {
                        "name": "lockTime",
                        "type": "i64"
                    },
                    {
                        "name": "rate",
                        "type": "i64"
                    },
                    {
                        "name": "model",
                        "type": "u64"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "InvalidUserPool",
            "msg": "Invalid User Pool"
        },
        {
            "code": 6001,
            "name": "InvalidCollection",
            "msg": "Invalid Collection"
        },
        {
            "code": 6002,
            "name": "InvalidAdmin",
            "msg": "Invalid User Pool"
        },
        {
            "code": 6003,
            "name": "InvalidPoolError",
            "msg": "Invalid pool number"
        },
        {
            "code": 6004,
            "name": "InvalidNFTAddress",
            "msg": "No Matching NFT to withdraw"
        },
        {
            "code": 6005,
            "name": "InvalidOwner",
            "msg": "NFT Owner key mismatch"
        },
        {
            "code": 6006,
            "name": "InvalidWithdrawTime",
            "msg": "Staking Locked Now"
        },
        {
            "code": 6007,
            "name": "IndexOverflow",
            "msg": "Withdraw NFT Index OverFlow"
        },
        {
            "code": 6008,
            "name": "BeforeLockTime",
            "msg": "You can't Unstake Before LockTime"
        },
        {
            "code": 6009,
            "name": "LackLamports",
            "msg": "Insufficient Lamports"
        },
        {
            "code": 6010,
            "name": "MetadataCreatorParseError",
            "msg": "Can't Parse The NFT's Creators"
        },
        {
            "code": 6011,
            "name": "InvaliedMetadata",
            "msg": "Invalid Metadata Address"
        }
    ]
}
export const IDL: StakingType = {
    "version": "0.1.0",
    "name": "staking_program",
    "instructions": [
        {
            "name": "initialize",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "setAmount",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                },
                {
                    "name": "advAmount",
                    "type": "u64"
                },
                {
                    "name": "sciAmount",
                    "type": "u64"
                },
                {
                    "name": "docAmount",
                    "type": "u64"
                },
                {
                    "name": "speAmount",
                    "type": "u64"
                },
                {
                    "name": "comAmount",
                    "type": "u64"
                },
                {
                    "name": "norAmount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "initializeFixedPool",
            "accounts": [
                {
                    "name": "userFixedPool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": []
        },
        {
            "name": "stakeNftToFixed",
            "accounts": [
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "userFixedPool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "destNftTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "nftMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "mintMetadata",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenMetadataProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                },
                {
                    "name": "lockPeriod",
                    "type": "i64"
                },
                {
                    "name": "role",
                    "type": "string"
                },
                {
                    "name": "model",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "withdrawNftFromFixed",
            "accounts": [
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "userFixedPool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "destNftTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "nftMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "claimRewardAll",
            "accounts": [
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "userFixedPool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "rewardVault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userRewardAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "claimReward",
            "accounts": [
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "userFixedPool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "rewardVault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userRewardAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "nftMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "GlobalPool",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "admin",
                        "type": "publicKey"
                    },
                    {
                        "name": "totalAmount",
                        "type": "u64"
                    },
                    {
                        "name": "adventureRate",
                        "type": "u64"
                    },
                    {
                        "name": "scientistRate",
                        "type": "u64"
                    },
                    {
                        "name": "doctorRate",
                        "type": "u64"
                    },
                    {
                        "name": "specialistRate",
                        "type": "u64"
                    },
                    {
                        "name": "commanderRate",
                        "type": "u64"
                    },
                    {
                        "name": "normalRate",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "UserPool",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "owner",
                        "type": "publicKey"
                    },
                    {
                        "name": "itemCount",
                        "type": "u64"
                    },
                    {
                        "name": "items",
                        "type": {
                            "array": [
                                {
                                    "defined": "StakedNFT"
                                },
                                50
                            ]
                        }
                    },
                    {
                        "name": "rewardTime",
                        "type": "i64"
                    },
                    {
                        "name": "pendingReward",
                        "type": "u64"
                    }
                ]
            }
        }
    ],
    "types": [
        {
            "name": "StakedNFT",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "nftAddr",
                        "type": "publicKey"
                    },
                    {
                        "name": "stakeTime",
                        "type": "i64"
                    },
                    {
                        "name": "rewardTime",
                        "type": "i64"
                    },
                    {
                        "name": "lockTime",
                        "type": "i64"
                    },
                    {
                        "name": "rate",
                        "type": "i64"
                    },
                    {
                        "name": "model",
                        "type": "u64"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "InvalidUserPool",
            "msg": "Invalid User Pool"
        },
        {
            "code": 6001,
            "name": "InvalidCollection",
            "msg": "Invalid Collection"
        },
        {
            "code": 6002,
            "name": "InvalidAdmin",
            "msg": "Invalid User Pool"
        },
        {
            "code": 6003,
            "name": "InvalidPoolError",
            "msg": "Invalid pool number"
        },
        {
            "code": 6004,
            "name": "InvalidNFTAddress",
            "msg": "No Matching NFT to withdraw"
        },
        {
            "code": 6005,
            "name": "InvalidOwner",
            "msg": "NFT Owner key mismatch"
        },
        {
            "code": 6006,
            "name": "InvalidWithdrawTime",
            "msg": "Staking Locked Now"
        },
        {
            "code": 6007,
            "name": "IndexOverflow",
            "msg": "Withdraw NFT Index OverFlow"
        },
        {
            "code": 6008,
            "name": "BeforeLockTime",
            "msg": "You can't Unstake Before LockTime"
        },
        {
            "code": 6009,
            "name": "LackLamports",
            "msg": "Insufficient Lamports"
        },
        {
            "code": 6010,
            "name": "MetadataCreatorParseError",
            "msg": "Can't Parse The NFT's Creators"
        },
        {
            "code": 6011,
            "name": "InvaliedMetadata",
            "msg": "Invalid Metadata Address"
        }
    ]
}