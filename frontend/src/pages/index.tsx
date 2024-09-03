import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { MetadataKey } from "@nfteyez/sol-rayz/dist/config/metaplex";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";
import NFTCard from "../components/NFTCard";
import StakedNFTCard from "../components/StakedNFTCard";
import { NFT_CREATOR } from "../config";
import { calculateAllRewards, claimRewardAll, getGlobalState, getUserPoolState } from "../contexts/transaction";
import { solConnection } from "../contexts/utils";

export default function HomePage(props: { startLoading: Function, closeLoading: Function }) {
  const { startLoading, closeLoading } = props;
  const wallet = useWallet()
  const [hide, setHide] = useState(false);
  const [nftList, setNftList] = useState<any>();

  // global Data values
  const [adventureRate, setAdventureRate] = useState(0);
  const [commanderRate, setCommanderRate] = useState(0);
  const [doctorRate, setDoctorRate] = useState(0);
  const [normalRate, setNormalRate] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [scientistRate, setScientistRate] = useState(0);
  const [specialistRate, setSpecialistRate] = useState(0);

  const [stakedNfts, setStakedNfts] = useState<any>();
  const [userStakedCount, setUserStakedCount] = useState(0);

  const [rewardAmount, setRewardAmount] = useState(0);

  const getUnstakedNFTs = async () => {
    startLoading(true);
    if (wallet.publicKey !== null) {
      const nftsList = await getParsedNftAccountsByOwner({ publicAddress: wallet.publicKey.toBase58(), connection: solConnection });
      let list: any = [];
      for (let item of nftsList) {
        if (item.data.creators[0].address === NFT_CREATOR) {
          try {
            await fetch(item.data.uri)
              .then(resp =>
                resp.json()
              ).then((json) => {
                list.push({
                  mintAddress: item.mint,
                  role: json.attributes.find((o: any) => o.trait_type === "Role").value
                })
              }).catch((error) =>
                console.log(error)
              )
          } catch (error) {

          }
        }
      }
      setNftList(list);
      setHide(!hide);
    }
    closeLoading(false);
  }

  const getGlobalData = async () => {
    const globalPoolData = await getGlobalState();
    if (globalPoolData === null) return;
    setAdventureRate(globalPoolData.adventureRate.toNumber() / LAMPORTS_PER_SOL);
    setCommanderRate(globalPoolData.commanderRate.toNumber() / LAMPORTS_PER_SOL);
    setDoctorRate(globalPoolData.doctorRate.toNumber() / LAMPORTS_PER_SOL);
    setNormalRate(globalPoolData.normalRate.toNumber() / LAMPORTS_PER_SOL);
    setScientistRate(globalPoolData.scientistRate.toNumber() / LAMPORTS_PER_SOL);
    setSpecialistRate(globalPoolData.specialistRate.toNumber() / LAMPORTS_PER_SOL);
    setTotalAmount(globalPoolData.totalAmount.toNumber());
  }

  const getUserPoolData = async () => {
    if (wallet.publicKey === null) return;
    startLoading();
    const userPoolData = await getUserPoolState(wallet);
    if (userPoolData === null) return;
    const count = userPoolData.itemCount.toNumber();
    setUserStakedCount(count);
    const claimReward = await calculateAllRewards(wallet);
    setRewardAmount(claimReward)
    const staked = [];
    if (count !== 0) {
      for (let i = 0; i < count; i++) {
        staked.push({
          lockTime: userPoolData.items[i].lockTime.toNumber(),
          model: userPoolData.items[i].model.toNumber(),
          nftAddress: userPoolData.items[i].nftAddr.toBase58(),
          rate: userPoolData.items[i].rate.toNumber(),
          rewardTime: userPoolData.items[i].rewardTime.toNumber(),
          stakedTime: userPoolData.items[i].stakeTime.toNumber()
        })
      }
      setStakedNfts(staked)
    }
    closeLoading();
  }

  const handleClaimAll = async () => {
    try {
      await claimRewardAll(
        wallet,
        () => startLoading(),
        () => closeLoading(),
        () => updatePage()
      )
    } catch (error) {
      console.log(error)
    }
  }

  const updatePage = () => {
    getUnstakedNFTs();
    getGlobalData();
    getUserPoolData();
  }

  useEffect(() => {
    updatePage()
    // eslint-disable-next-line
  }, [wallet.connected]);
  return (
    <main>
      <div className="container">
        <div className="p-100">
          <div className="global-info">
            <div className="info-item">
              <label>Adventure Rate</label>
              <p>{adventureRate}</p>
            </div>
            <div className="info-item">
              <label>Scientist Rate</label>
              <p>{scientistRate}</p>
            </div>
            <div className="info-item">
              <label>Doctor Rate</label>
              <p>{doctorRate}</p>
            </div>
            <div className="info-item">
              <label>Specialist Rate</label>
              <p>{specialistRate}</p>
            </div>
            <div className="info-item">
              <label>Commander Rate</label>
              <p>{commanderRate}</p>
            </div>
            <div className="info-item">
              <label>Normal Rate</label>
              <p>{normalRate}</p>
            </div>
            <div className="info-item">
              <label>Total Amount</label>
              <p>{totalAmount}</p>
            </div>
            <div className="info-item">
              <label>Your staked nfts</label>
              <p>{userStakedCount}</p>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <button className="btn-claim" onClick={() => handleClaimAll()}>
              Claim All ({(rewardAmount).toLocaleString()} COSMIC)
            </button>
          </div>
          <div className="create-list">
            {nftList && nftList.length !== 0 &&
              nftList.map((item: any, key: number) => (
                <NFTCard
                  mint={item.mintAddress}
                  role={item.role}
                  key={key}
                  startLoading={() => startLoading()}
                  closeLoading={() => closeLoading()}
                  updatePage={() => updatePage()}
                />
              ))
            }
            {stakedNfts && stakedNfts.length !== 0 && stakedNfts.map((item: StakedNFT, key: number) => (
              <StakedNFTCard
                key={key}
                lockTime={item.lockTime}
                model={item.model}
                mint={item.nftAddress}
                rate={item.rate}
                rewardTime={item.rewardTime}
                stakedTime={item.stakedTime}
                startLoading={() => startLoading()}
                closeLoading={() => closeLoading()}
                updatePage={() => updatePage()}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

interface StakedNFT {
  lockTime: number;
  model: number;
  nftAddress: string;
  rate: number;
  rewardTime: number;
  stakedTime: number;
}