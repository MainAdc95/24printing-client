import {
    Box,
    Typography,
    Grid,
    FormLabel,
    Divider,
    TextField,
    Button,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import { IQuantity } from "../../../types/quantity";
import { IImage } from "../../../types/image";
import ImageOpt from "../../imageOpt";
import useSWR from "swr";
import { ICustomization } from "../../../types/customization";
import { ICard, ICardCusPrice } from "../../../types/card";

// components
import Error from "../error";
import ImagePicker from "../gallery/imagePicker";
import Modal from "../modal";

// icons
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";

interface IError {
    image: string[];
    title: string[];
}

const CardList = ({ quantities, state, setState, optionId }) => {
    const [isEdit, setEdit] = useState<any>(null);
    const [customization, setCustomization] =
        useState<ICustomization | null>(null);

    useEffect(() => {
        setCustomization(
            state.customizations.find(
                (c: ICustomization) => c.option.option_id === optionId
            ) || null
        );
    }, [state.customizations]);

    const handleRemove = (i) => {
        setState({
            ...state,
            customizations: state.customizations.map((c: ICustomization) =>
                c.option.option_id === optionId
                    ? {
                          ...c,
                          cards: c.cards.filter((card, index) => index !== i),
                      }
                    : c
            ),
        });
    };

    const handleEdit = (id: string) => {
        const card = customization.cards.find((c) => c.card_id === id);

        if (card) setEdit(card);
    };

    const handleCloseEdit = () => {
        setEdit(null);
    };

    return (
        <>
            {!customization?.cards.length ? (
                <Box>
                    <Typography>No cards added.</Typography>
                </Box>
            ) : (
                customization?.cards.map((c, i) => (
                    <Box mt={2} key={i} display="flex" alignItems="center">
                        <Box width={100} height={100}>
                            <ImageOpt
                                src={c.image?.image_name}
                                width={100}
                                height={100}
                            />
                        </Box>
                        <Box mr={2} ml={10} width="100%">
                            <Typography>{c.title}</Typography>
                        </Box>
                        <Box mr={1}>
                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                color="primary"
                                onClick={() => handleEdit(c.card_id)}
                            >
                                edit
                            </Button>
                        </Box>
                        <Box>
                            <Button
                                variant="contained"
                                startIcon={<DeleteIcon />}
                                style={{
                                    backgroundColor: "red",
                                    color: "white",
                                }}
                                onClick={() => handleRemove(i)}
                            >
                                remove
                            </Button>
                        </Box>
                    </Box>
                ))
            )}
            <Box mt={2}>
                <CardForm
                    setState={setState}
                    state={state}
                    optionId={optionId}
                    quantities={quantities}
                />
            </Box>
            {isEdit && (
                <Modal
                    type="child"
                    closeInfo={{ close: handleCloseEdit, check: true }}
                >
                    <CardForm
                        setState={setState}
                        close={handleCloseEdit}
                        state={state}
                        optionId={optionId}
                        quantities={quantities}
                        card={isEdit}
                    />
                </Modal>
            )}
        </>
    );
};

interface IProps {
    setState: any;
    state: any;
    optionId: any;
    quantities: any;
    close?: any;
    card?: ICard;
}

const CardForm = ({
    setState,
    state,
    optionId,
    quantities,
    card,
    close,
}: IProps) => {
    const [tmpQtys, setTmpQtys] = useState<IQuantity[] | ICardCusPrice[]>([]);
    const [isImage, setImage] = useState<boolean>(false);
    const { data: images } = useSWR<IImage[]>("/images");
    const [errors, setErrors] = useState<IError>({
        image: [],
        title: [],
    });
    const [cardInfo, setCardInfo] = useState({
        image: "",
        title: "",
    });

    useEffect(() => {
        if (card) {
            setTmpQtys(card.prices);
        } else {
            const tmpTmpQtys: IQuantity[] = [];

            for (let qty of quantities) {
                const foundQty = (tmpQtys as IQuantity[]).find(
                    (q) => q.quantity_id === qty.quantity_id
                );

                if (!foundQty) {
                    tmpTmpQtys.push({ ...qty, price: 0 });

                    continue;
                }

                tmpTmpQtys.push({ ...qty, price: foundQty.price });
            }

            setTmpQtys(tmpTmpQtys);

            const tmpCust: ICustomization[] = [];

            for (let c of state.customizations) {
                const tmpCards: any = [];

                for (let card of c.cards) {
                    tmpCards.push({
                        ...card,
                        prices: quantities.map((q) => {
                            const cQty = card.prices.find(
                                (qty) => qty.quantity_id === q.quantity_id
                            );

                            if (cQty) return cQty;

                            const foundQty = (tmpQtys as IQuantity[]).find(
                                (qty) => qty.quantity_id === q.quantity_id
                            );

                            if (foundQty)
                                return { ...q, price: foundQty.price };
                            return { ...q, price: 0 };
                        }),
                    });
                }

                tmpCust.push({ ...c, cards: tmpCards });
            }

            setState({ ...state, customizations: tmpCust });
        }
    }, [quantities]);

    useEffect(() => {
        if (card) {
            setCardInfo({
                ...cardInfo,
                image: card.image.image_id,
                title: card.title,
            });
        }
    }, []);

    const handleOpenMedia = (type: "image") => {
        if (type === "image") setImage(true);
    };

    const handleCloseMedia = (type: "image") => {
        if (type === "image") setImage(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCardInfo({ ...cardInfo, [e.target.name]: e.target.value });
    };

    const handlePrice = (e, id) => {
        if (!e.target.value) {
            setTmpQtys([
                ...tmpQtys.map((q) =>
                    q.quantity_id === id ? { ...q, [e.target.name]: "0" } : q
                ),
            ]);

            return;
        }

        if (!Number.isNaN(Number(e.target.value))) {
            setTmpQtys([
                ...tmpQtys.map((q) =>
                    q.quantity_id === id
                        ? { ...q, [e.target.name]: e.target.value.trim() }
                        : q
                ),
            ]);
        }
    };

    const handleAdd = () => {
        const errors = handleValidate();

        for (let e of Object.values(errors)) {
            if (e.length) return;
        }

        const tmpCard = {
            ...cardInfo,
            card_id: Date.now(),
            prices: tmpQtys,
            image:
                images.find((i) => i.image_id === cardInfo.image) ||
                cardInfo.image,
        };

        if (card) {
            setState({
                ...state,
                customizations: state.customizations.map((c: ICustomization) =>
                    c.option.option_id === optionId
                        ? {
                              ...c,
                              cards: c.cards.map((cd) =>
                                  cd.card_id === card.card_id ? tmpCard : cd
                              ),
                          }
                        : c
                ),
            });

            close();
        } else {
            setState({
                ...state,
                customizations: state.customizations.map((c: ICustomization) =>
                    c.option.option_id === optionId
                        ? { ...c, cards: [...c.cards, tmpCard] }
                        : c
                ),
            });

            setCardInfo({
                ...cardInfo,
                title: "",
                image: "",
            });

            setTmpQtys(quantities.map((q) => ({ ...q, price: 0 })));
        }
    };

    const handleValidate = () => {
        const TmpErrors: IError = {
            image: [],
            title: [],
        };

        if (!cardInfo.title) {
            TmpErrors.title.push("Please fill in title.");
        }

        if (!cardInfo.image) {
            TmpErrors.image.push("Please choose an image.");
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    return (
        <>
            <Box display="flex" flexDirection="column">
                <Grid container spacing={10}>
                    <Grid item xs={6}>
                        <Box display="flex" flexDirection="column" width="100%">
                            <FormLabel
                                required={true}
                                style={{ marginBottom: "10px" }}
                                htmlFor="image"
                            >
                                Card image
                            </FormLabel>
                            <Button
                                variant="contained"
                                onClick={() => handleOpenMedia("image")}
                                color="primary"
                            >
                                open gallery
                            </Button>
                        </Box>
                        <Error errors={errors.image} />
                    </Grid>
                </Grid>
                <Box mt={3}>
                    <TextField
                        name="title"
                        label="Title"
                        size="small"
                        required={true}
                        value={cardInfo.title}
                        error={!!errors.title.length}
                        variant="outlined"
                        onChange={handleChange}
                        style={{ width: "100%" }}
                    />
                    <Error errors={errors.title} />
                </Box>
                <Box mb={3} mt={3}>
                    <Divider />
                </Box>
                {tmpQtys.map((q) => (
                    <Box
                        key={q.quantity_id}
                        mt={3}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Box width="30%">
                            <Typography
                                style={{ textAlign: "center", fontWeight: 500 }}
                            >
                                Quantity: {q.qty}
                            </Typography>
                        </Box>
                        <Box mr={2} ml={2} width="70%">
                            <TextField
                                name="price"
                                label="Price"
                                required={true}
                                size="small"
                                value={q.price}
                                variant="outlined"
                                onChange={(e) => handlePrice(e, q.quantity_id)}
                                fullWidth
                            />
                        </Box>
                    </Box>
                ))}
                <Box width="100%" mt={3}>
                    <Button
                        variant="contained"
                        startIcon={card ? <DoneIcon /> : <AddIcon />}
                        id="showcase"
                        onClick={handleAdd}
                        style={{
                            height: "100%",
                            width: "100%",
                        }}
                        color="secondary"
                    >
                        {card ? "save" : "add"}
                    </Button>
                </Box>
            </Box>
            {isImage && (
                <ImagePicker
                    state={cardInfo}
                    setState={setCardInfo}
                    fieldName="image"
                    close={() => handleCloseMedia("image")}
                    type="single"
                />
            )}
        </>
    );
};

export default CardList;
