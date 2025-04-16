import React, { useState, useEffect } from "react";
import TodoCard from "./component/TodoCard";
import { useQuery } from "react-query";
import { getTodoList } from "./lib/todoList-api";
import { Button } from "@mui/material";
import AddIcon from "./assests/add.png";
import EditDialog from "./component/EditDialog";

function App() {
  const [todos, setTodo] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { refetch } = useQuery("todoList", getTodoList, {
    onSuccess: ({ data }) => {
      setTodo(data);
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="container mx-auto  bg-red-100 min-h-screen">
      <div
        className={`flex justify-between items-center p-4 mb-8 bg-red-100 sticky top-0 z-10 transition-shadow ${
          isScrolled ? "shadow-lg" : ""
        }`}
      >
        <div className="text-3xl font-bold text-pink-800 flex-grow italic">
          To-do List
        </div>
        <Button
          type="submit"
          variant="contained"
          className="w-[200px] h-12 text-xs"
          sx={{
            backgroundColor: "#fffdaf",
            color: "#9d174d",
            "&:hover": {
              backgroundColor: "#fffd8e",
            },
            whiteSpace: "nowrap",
          }}
          onClick={() => setOpenDialog(true)}
        >
          Add new task !!
          <img src={AddIcon} alt="Add" className="ml-2 w-8 h-8" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {todos.map((todo) => (
          <TodoCard
            key={todo.id}
            title={todo.title}
            description={todo.description}
            status={todo.status}
            id={todo.id}
            refetch={refetch}
          />
        ))}
      </div>
      <EditDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </div>
  );
}

export default App;
