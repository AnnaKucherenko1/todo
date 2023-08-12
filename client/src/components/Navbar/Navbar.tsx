import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Task from "../../interfaces";
import { getList } from "../../services/servicesList";

const Navbar = () => {
  const [lists, setLists] = useState<Task[]>([]);


  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const response = await getList();
    setLists(response);

  };
  return (
    <div className="navbar bg-base-300">
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/"> Home </Link></li>
          <li>
            <details>
              <summary>
                Todo List
              </summary>
              <ul className="p-2 bg-base-100">
                {lists.map((list) => (
                  <li key={list.id}>
                    <Link to={`/list/${list.id}`}>{list.title}</Link>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  )
}
export default Navbar