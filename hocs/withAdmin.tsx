import { useSelector } from "react-redux";
import { RootReducer } from "../store/reducers";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

interface IProps {
    children: React.ReactNode;
}

const WithAdmin = ({ children }: IProps) => {
    const router = useRouter();
    const [isWindow, setWindow] = useState(false);
    const {
        user,
        onload: { loading },
    } = useSelector((state: RootReducer) => state.auth);

    useEffect(() => {
        setWindow(true);
    }, []);

    if (!isWindow) return null;
    else if (loading) return <p>loading...</p>;
    else if (user) {
        if (user.is_super_admin || user.is_admin) return <>{children}</>;
        else {
            router.push("/");
            return <p>loading...</p>;
        }
    } else {
        router.push("/");
        return <p>loading...</p>;
    }
};

export default WithAdmin;
