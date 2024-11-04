import React from "react";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import FieldIcon from "../assests/field.png";
import CssTooltip from "./ToolTip";
import { useMutation } from "react-query";
import { createTodoList, updateTodoList } from "../lib/todoList-api";

export default function EditDialog({
  open,
  onClose,
  title,
  description,
  status,
  id,
  refetch,
  isEdit,
}) {
  const { mutate: updateAPI } = useMutation(updateTodoList);
  const { mutate: createAPI } = useMutation(createTodoList);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    status: Yup.string().required("Status is required"),
  });

  const initialValues = {
    title: isEdit ? title : "",
    description: isEdit ? description : "",
    status: isEdit ? status : "incomplete",
  };

  const handleFormSubmit = (values) => {
    if (!isEdit) {
      createAPI(
        { data: values },
        {
          onSuccess: (resp) => {
            onClose();
            refetch();
          },
        }
      );
    } else {
      updateAPI(
        { id: id, data: values },
        {
          onSuccess: (resp) => {
            refetch();
            onClose();
          },
        }
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#FFF4F7",
        },
      }}
    >
      <div className="text-lg font-bold mt-4 text-pink-700 mx-5 mb-4">
        {isEdit ? "Edit Task" : "Add new Task"}
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="mx-5">
              <div className="mb-4 flex items-center">
                <Field
                  as={TextField}
                  label="Title"
                  name="title"
                  fullWidth
                  margin="dense"
                  error={touched.title && !!errors.title}
                  helperText={touched.title && errors.title}
                  InputProps={{
                    sx: { height: 50 },
                  }}
                />
                <CssTooltip
                  title={!isEdit ? "Add the file" : "Update the Title"}
                  placement="top"
                >
                  <img src={FieldIcon} alt="icon" className="ml-5 w-8 h-12" />
                </CssTooltip>
              </div>
              <div className="mb-4 flex items-center">
                <Field
                  as={TextField}
                  label="Description"
                  name="description"
                  fullWidth
                  multiline
                  rows={3}
                  margin="dense"
                  error={touched.description && !!errors.description}
                  helperText={touched.description && errors.description}
                />

                <CssTooltip
                  title={
                    !isEdit ? "Add the Description" : "Update the Description"
                  }
                  placement="top"
                >
                  <img src={FieldIcon} alt="icon" className="ml-5 w-8 h-12" />
                </CssTooltip>
              </div>
              <div className="mb-4 flex items-center">
                <Field
                  as={TextField}
                  label="Status"
                  name="status"
                  select
                  fullWidth
                  margin="dense"
                  error={touched.status && !!errors.status}
                  helperText={touched.status && errors.status}
                  InputProps={{
                    sx: { height: 50 },
                  }}
                >
                  <MenuItem value="incomplete">Incomplete</MenuItem>
                  <MenuItem value="complete">Complete</MenuItem>
                </Field>
                <CssTooltip
                  title={!isEdit ? "Add the status" : "Update the status"}
                  placement="top"
                >
                  <img src={FieldIcon} alt="icon" className="ml-5 w-8 h-12" />
                </CssTooltip>
              </div>
            </div>
            <div className="flex justify-center mt-10 gap-5 mb-4">
              <Button
                onClick={onClose}
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
                type="submit"
                variant="contained"
                className="w-[100px] h-9 text-xs"
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
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
