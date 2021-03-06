import { useSelector } from "react-redux";
import useSWR from "swr";
import { RootReducer } from "../store/reducers";
import { IProduct } from "../types/product";

const useWishlist = (): [IProduct[], boolean] => {
    const { data: products } = useSWR<IProduct[]>("/products");
    const wishlist = useSelector((state: RootReducer) => state.wishlist);

    const getWishListProducts = () => {
        let arr = [];

        wishlist.forEach((p) => {
            const product = products.find((pro) => pro.product_id === p);
            if (product) arr.push(product);
        });

        return arr;
    };

    if (!products) return [[], !!products];
    return [getWishListProducts(), !!products];
};

export default useWishlist;
