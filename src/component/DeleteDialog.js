import Dialog from "@mui/material/Dialog";
import DeleteIcon from "../assests/del.png";
import { Button } from "@mui/material";

export default function DeleteDialog({
  show,
  onHide,
  onConfirm,
  isLoading,
  title,
}) {
  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          maxWidth: 411,
          maxHeight: 435,
        },
      }}
      maxWidth="xs"
      open={show}
      onClose={onHide}
      className="p-6"
    >
      <div className="flex justify-center items-center mt-8">
        <img
          src={DeleteIcon}
          alt="Delete icon"
          className="h-16 w-16 cursor-pointer"
        />
      </div>

      <div className="text-base mt-4 text-center">{title}</div>

      <div className="flex justify-center mt-10 gap-5 mb-4">
        <Button
          onClick={onHide}
          variant="outlined"
          className="w-[100px] h-9 text-xs"
          sx={{
            backgroundColor: "transparent",
            borderColor: "black",
            color: "black",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          No
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          className="w-[100px] h-9 text-xs"
          disabled={isLoading}
          sx={{
            backgroundColor: "#fdfa72",
            color: "black",
            "&:hover": {
              backgroundColor: "#fffd8d",
            },
          }}
        >
          Yes
        </Button>
      </div>
    </Dialog>
  );
}
