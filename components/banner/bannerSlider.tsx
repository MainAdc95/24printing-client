import React, { useState, useEffect } from "react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { IBanner } from "../../types/banner";
import { useRouter } from "next/router";
import Image from "next/image";

// components
import Loader from "../loader";
import { apiImage } from "../../utils/apiCall";

// install Swiper components
SwiperCore.use([Navigation, Pagination]);

interface IProps {
    banners: IBanner[];
    page: any;
    loop?: any;
    spacing?: any;
}

const BannerSlider = ({ banners, page, loop, spacing }: IProps) => {
    const router = useRouter();
    const [isActive, setActive] = useState(true);

    useEffect(() => {
        if (isActive) {
            setActive(false);
            setTimeout(() => {
                setActive(true);
            }, 1);
        }
    }, [router.pathname]);

    if (!banners)
        return (
            <div className="banenr-img-slider-loading">
                <Loader />
            </div>
        );
    return (
        <div className="banner-slider-container">
            {isActive ? (
                <Swiper
                    autoHeight={true}
                    loop={loop ? true : false}
                    spaceBetween={spacing ? spacing : 0}
                    slidesPerGroup={1}
                    pagination={{ clickable: true }}
                    slidesPerView={1}
                >
                    {banners.map((banner) => {
                        if (banner.banner_page === page)
                            return (
                                <SwiperSlide key={banner.banner_id}>
                                    {banner.link ? (
                                        <Link href={banner.link}>
                                            <div className="banner-slider-img-container">
                                                <Image
                                                    src={apiImage(
                                                        banner.image?.image_name
                                                    )}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    priority={true}
                                                />
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="banner-slider-img-container">
                                            <Image
                                                src={apiImage(
                                                    banner.image?.image_name
                                                )}
                                                layout="fill"
                                                objectFit="cover"
                                                priority={true}
                                            />
                                        </div>
                                    )}
                                </SwiperSlide>
                            );
                    })}
                </Swiper>
            ) : null}
        </div>
    );
};

export default BannerSlider;
