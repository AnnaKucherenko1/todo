import { Route, Routes } from "react-router-dom";
import TodoDash from "./components/TodoDash/TodoDash";
import Todo from "./pages/List";
const Root = () => {
  return (
    <Routes>
      <Route path='/' element={<Todo />} />
      <Route
        path='/list/:listId'
        element={<TodoDash />}
      />
    </Routes>
  );
}
export default Root