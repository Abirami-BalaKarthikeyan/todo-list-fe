import React, { useState } from "react";
import todoList from "../assests/todo.png";
import EditIcon from "../assests/edit.png";
import DeleteIcon from "../assests/delete.png";
import CompleteIcon from "../assests/complete.png";
import PendingIcon from "../assests/pending.png";
import CssTooltip from "./ToolTip";
import DeleteDialog from "./DeleteDialog";
import { deleteTodoList } from "../lib/todoList-api";
import { useMutation } from "react-query";
import EditDialog from "./EditDialog";

const TodoCard = ({ title, description, status, id, refetch }) => {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);

  const { mutate: deleteAPI } = useMutation(deleteTodoList);
  return (
    <div className="bg-white opacity-80  shadow-lg rounded-lg p-6 mb-8 w-full relative group">
      <div className="flex items-center mb-8">
        <div className="flex-shrink-0 mr-3">
          <img src={todoList} alt="icon" className="h-12 w-12 rounded-full" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-pink-800">
            {title || "No Title"}
          </h2>
        </div>
      </div>
      <p className="text-pink-700 mb-8">{description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="ml-2 text-pink-600 italic">
            {status === "complete" ? (
              <div className="flex gap-5">
                <img
                  src={CompleteIcon}
                  alt="Edit icon"
                  className="h-8 w-8 cursor-pointer"
                />
                <div className="text-pink-800">Completed</div>
              </div>
            ) : (
              <div className="flex gap-5">
                <img
                  src={PendingIcon}
                  alt="Edit icon"
                  className="h-8 w-8 cursor-pointer"
                />
                <div className="text-pink-800">In Progress</div>
              </div>
            )}
          </span>
        </div>
        <div className="flex gap-6 opacity-0 group-hover:opacity-100">
          <CssTooltip title="Edit" arrow placement="top">
            <img
              src={EditIcon}
              alt="Edit icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => setEditOpen(true)}
            />
          </CssTooltip>
          <CssTooltip title="Delete" arrow placement="top">
            <img
              src={DeleteIcon}
              alt="Delete icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => setDeleteDialog(true)}
            />
          </CssTooltip>
        </div>
      </div>
      <DeleteDialog
        show={deleteDialog}
        onHide={() => setDeleteDialog(false)}
        onConfirm={() => {
          deleteAPI(
            { id: id },
            {
              onSuccess: (resp) => {
                refetch();
              },
            }
          );
          setDeleteDialog(false);
        }}
        title={"Are you sure to delete?"}
      />
      <EditDialog
        open={isEditOpen}
        onClose={() => setEditOpen(false)}
        title={title}
        description={description}
        status={status}
        id={id}
        refetch={refetch}
        isEdit={true}
      />
    </div>
  );
};

export default TodoCard;
