import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { DiscordIcon, TwitterIcon } from "./svgIcons";

export default function Header() {
    return (
        <header className="header">
            <div className="header-content">
                <div className="header-left">
                </div>
                <div className="header-center">

                </div>
                <div className="header-right">
                    <Link href="https://twitter.com/****">
                        <a className="social-link">
                            <TwitterIcon />
                        </a>
                    </Link>
                    <Link href="https://discord.com/****">
                        <a className="social-link" style={{ marginRight: 20 }}>
                            <DiscordIcon />
                        </a>
                    </Link>
                    <WalletModalProvider>
                        <WalletMultiButton />
                    </WalletModalProvider>
                </div>
            </div>
            <div className="header-wallet">
            </div>

        </header>
    )
}