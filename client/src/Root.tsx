import { Route, Routes } from "react-router-dom";
import TodoDashboard from "./components/TodoDashboard/TodoDashboard";
import Todo from "./pages/List";
const Root = () => {
  return (
    <Routes>
      <Route path='/' element={<Todo />} />
      <Route
        path='/list/:listId'
        element={<TodoDashboard />}
      />
    </Routes>
  );
}
export default Root