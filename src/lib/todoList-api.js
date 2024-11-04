import getAPIMap from "../routes/ApiUrls";
import axios from "axios";

export async function getTodoList() {
  let url = getAPIMap("getDetails");
  let response = await axios.get(url);
  return response;
}

export async function deleteTodoList(options) {
  let url = getAPIMap("deleteDetails");
  url = url.replace("{id}", options.id);
  let response = await axios.delete(url);
  return response;
}

export async function updateTodoList(options) {
  let url = getAPIMap("updateDetails");
  url = url.replace("{id}", options.id);
  let response = await axios.put(url, options.data);
  return response;
}

export async function createTodoList(options) {
  let url = getAPIMap("createDetails");
  let response = await axios.post(url, options.data);
  return response;
}
