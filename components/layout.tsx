import Navbar from "./navbar";
import Footer from "./footer";
import HeadLayout from "./headLayout";
import { useRouter } from "next/router";
import ContactBtn from "./contactBtn";
import useSWR from "swr";

// icons
import CloseIcon from "@material-ui/icons/Close";
import { useState } from "react";
import { apiImage } from "../utils/apiCall";
import { IAdvPopup } from "../types/advPopup";

interface Props {
    children?: React.ReactNode;
}

const AdvPopupModel = () => {
    const { data: advPopup } = useSWR<IAdvPopup>("/adv_popup");
    const router = useRouter();
    const [open, setOpen] = useState(true);

    if (!open) return null;
    if (advPopup)
        return (
            <div className="adv-popup-model">
                <div className="admin-popup-model-close-container">
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="close-model-btn"
                        style={{ width: "50px", height: "50px" }}
                    >
                        <CloseIcon
                            className="close-model-icon"
                            style={{ width: "50px", height: "50px" }}
                        />
                    </button>
                </div>
                <div className="adv-popup-model-img-container">
                    <img
                        onClick={() =>
                            advPopup.link ? router.push(advPopup.link) : null
                        }
                        className="adv-popup-model-img"
                        src={apiImage(advPopup.image.image_name)}
                        alt=""
                    />
                </div>
            </div>
        );
    return null;
};

const Layout = ({ children }: Props) => {
    const router = useRouter();

    if (`/${router.pathname.split("/")[1]}` === "/admin")
        return <>{children}</>;
    else if (`/${router.pathname.split("/")[1]}` === "/chat")
        return <>{children}</>;
    else
        return (
            <div style={{ paddingTop: "74px" }}>
                <HeadLayout>
                    <>
                        <meta
                            name="author"
                            content="CPMC (Crown Phoenix Marketing Consultancy L.L.C)"
                        />
                        <meta
                            name="viewport"
                            content="width=device-width, initial-scale=1.0"
                        ></meta>
                        <link
                            rel="preconnect"
                            href="https://fonts.gstatic.com"
                        />
                        <link
                            href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa&family=Bebas+Neue&family=Changa:wght@200&family=Great+Vibes&family=Indie+Flower&family=Julius+Sans+One&family=Kaushan+Script&family=Kufam&family=Marck+Script&family=Markazi+Text&family=Mate+SC&family=Merriweather&family=Monsieur+La+Doulaise&family=Norican&family=Rakkas&family=Reggae+One&family=Scheherazade&family=Shadows+Into+Light&family=Staatliches&display=swap"
                            rel="stylesheet"
                        />
                    </>
                </HeadLayout>
                <Navbar />
                {children}
                <ContactBtn />
                <AdvPopupModel />
                <Footer />
            </div>
        );
};

export default Layout;
