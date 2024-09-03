import { Dialog, FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { stakeNft } from "../contexts/transaction";
import { getNftMetaData } from "../contexts/utils";

export default function NFTCard(props: {
    mint: string,
    role: string,
    startLoading: Function,
    closeLoading: Function,
    updatePage: Function,
}) {
    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [dialog, setDialog] = useState(false);

    const getNFTdetail = async () => {
        const uri = await getNftMetaData(new PublicKey(props.mint))
        await fetch(uri)
            .then(resp =>
                resp.json()
            ).then((json) => {
                setImage(json.image);
                setName(json.name);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        getNFTdetail();
        // eslint-disable-next-line
    }, [])


    // for image layout
    const cardRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (cardRef.current) {
            setDimensions({
                width: cardRef.current.offsetWidth,
                height: cardRef.current.offsetHeight
            });
        }
    }, []);
    return (
        <div className="nft-card">
            <div className="nft-card-content">
                <div className="media" ref={cardRef}>
                    {/* eslint-disable-next-line */}
                    <img
                        src={image}
                        style={{ height: dimensions.width }}
                        alt=""
                    />
                    <div className="card-content">
                        <p>{name}</p>
                        <div className="align-center">
                            <button className="btn-primary" onClick={() => setDialog(true)}>
                                stake
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <StakeDialog
                opened={dialog}
                onClose={() => setDialog(false)}
                image={image}
                mint={props.mint}
                role={props.role}
                startLoading={() => props.startLoading()}
                closeLoading={() => props.closeLoading()}
                updatePage={() => props.updatePage()}
            />
        </div>
    )
}

function StakeDialog(props: { opened: boolean, onClose: Function, image: string, mint: string, role: string, startLoading: Function, closeLoading: Function, updatePage: Function }) {
    const { opened, onClose, image, mint, role, startLoading, closeLoading, updatePage } = props;

    const wallet = useWallet()

    const [model, setModel] = useState("1");
    const [lockDay, setLockDay] = useState("7");

    const handleChangeModel = (event: any) => {
        setModel(event.target.value);
    };

    const handleChangeDay = (event: any) => {
        setLockDay(event.target.value);
    };

    const onStake = async () => {
        console.log(role)
        if (wallet.publicKey === null) return;
        let period = 1;
        if (model === "1") {
            period = 15;
        } else if (model === "2") {
            period = 0;
        } else if (model === "3") {
            period = parseInt(lockDay);
        }
        console.log(period, role, model, "period, role, model, ")
        onClose();
        try {
            await stakeNft(
                wallet,
                new PublicKey(mint),
                period,
                role,
                parseInt(model),
                () => startLoading(),
                () => closeLoading(),
                () => updatePage()
            )
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Dialog
            open={opened}
        // onClose={() => onClose()}
        >
            <div className="dialog-content">
                <button style={{ position: "absolute", right: 10, top: 10, width: 20 }} onClick={() => onClose()}>x</button>
                <div className="nft-detail">
                    {/* eslint-diable-next-line */}
                    <img
                        src={image}
                        alt=""
                        width={120}
                        height={120}
                    />
                    <h4>Role: <br /><span>{role}</span></h4>
                </div>
                <FormControl>
                    <RadioGroup
                        value={model}
                        onChange={handleChangeModel}
                    >
                        <FormControlLabel value={"1"} control={<Radio />} label="Model 1" />
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        <FormControlLabel value={"2"} control={<Radio />} label="Model 2" />
                        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        <FormControlLabel value={"3"} control={<Radio />} label="Model 3" />
                        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </RadioGroup>
                </FormControl>
                {model === "3" &&
                    <FormControl sx={{ marginLeft: 2 }}>
                        <RadioGroup
                            value={lockDay}
                            row
                            onChange={handleChangeDay}
                        >
                            <FormControlLabel value={"7"} control={<Radio size="small" />} label="7 days" />
                            <FormControlLabel value={"14"} control={<Radio size="small" />} label="14 days" />
                            <FormControlLabel value={"30"} control={<Radio size="small" />} label="30 days" />
                        </RadioGroup>
                    </FormControl>
                }
                <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => onStake()}>
                    Stake this nft
                </button>
            </div>
        </Dialog>
    )
}