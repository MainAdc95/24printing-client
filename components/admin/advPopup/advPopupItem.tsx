import ImageOpt from "../../imageOpt";
import dateFormat from "dateformat";
import parse from "html-react-parser";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { useState } from "react";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import {
    makeStyles,
    Typography,
    Button,
    Menu,
    MenuItem,
    Box,
} from "@material-ui/core";
import { IAdvPopup } from "../../../types/advPopup";

// icons
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles({
    root: {
        "&:hover": {
            boxShadow:
                "0px 0px 5px 1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
            backgroundColor: "rgb(245, 245, 245)",
        },
    },
    tableCell: {
        maxWidth: "200px",
        whiteSpace: "nowrap",
        overflowX: "hidden",
        textOverflow: "ellipsis",
    },
    sticky: {
        zIndex: 1,
    },
    stickyHover: {
        zIndex: 1,
        right: "0",
        position: "sticky",
    },
});

interface IProps {
    advPopup: IAdvPopup;
    handleOpenDel: any;
    handleOpenEdit: any;
}

const AdvPopupItem = ({ advPopup, handleOpenDel, handleOpenEdit }: IProps) => {
    const classes = useStyles();
    const [isHover, setHover] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const delAction = () => {
        handleOpenDel(advPopup);
        handleClose();
    };

    const handleMouseOver = () => {
        setHover(true);
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    const handleEdit = () => {
        handleClose();
        handleOpenEdit(advPopup);
    };

    return (
        <TableRow
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            classes={{ root: classes.root }}
            key={advPopup.adv_popup_id}
        >
            <TableCell>
                <div
                    style={{
                        position: "relative",
                        width: "50px",
                        height: "50px",
                        overflow: "hidden",
                        borderRadius: "50%",
                    }}
                >
                    <ImageOpt
                        src={advPopup.image?.image_name}
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {advPopup.is_active ? (
                    <CheckIcon color="primary" />
                ) : (
                    <ClearIcon color="secondary" />
                )}
            </TableCell>
            <TableCell
                title={advPopup.link}
                classes={{
                    root: classes.tableCell,
                }}
            >
                {advPopup.link || <Typography align="center">-</Typography>}
            </TableCell>
            <TableCell style={{ whiteSpace: "nowrap" }}>
                {dateFormat(
                    advPopup.created_at,
                    "dddd, mmmm dS, yyyy, h:MM:ss TT"
                )}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {advPopup.created_by?.username || (
                    <Typography align="center">-</Typography>
                )}
            </TableCell>
            <TableCell style={{ whiteSpace: "nowrap" }}>
                {dateFormat(
                    advPopup.updated_at,
                    "dddd, mmmm dS, yyyy, h:MM:ss TT"
                )}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {advPopup.updated_by?.username || (
                    <Typography align="center">-</Typography>
                )}
            </TableCell>
            <TableCell
                classes={{
                    root: isHover ? classes.stickyHover : classes.sticky,
                }}
            >
                <Box width={45}>
                    <Button
                        style={{ minWidth: "100%" }}
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={handleClick}
                    >
                        <MoreHorizIcon />
                    </Button>
                </Box>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={delAction}>Delete</MenuItem>
                </Menu>
            </TableCell>
        </TableRow>
    );
};

export default AdvPopupItem;
