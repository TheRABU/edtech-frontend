import { ModeToggle } from "../mode-toggle";
import { useDispatch, useSelector } from "react-redux";
import { setSearchValue } from "@/redux/searchSlice";
import { Button } from "../ui/button";
import { Link } from "react-router";
import {
  useGetMeQuery,
  useLogoutMutation,
} from "@/redux/features/auth/auth.api";
const Navbar = () => {
  const { data } = useGetMeQuery(undefined);

  const searchValue = useSelector(
    (state: { search: { value: string } }) => state.search.value
  );
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <div className="navbar bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            EduTech BD
          </Link>
        </div>
        <div className="flex justify-center items-center gap-2">
          {/* search bar */}
          <div className="flex justify-center items-center gap-2">
            <ModeToggle />
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto"
              value={searchValue}
              onChange={(e) => dispatch(setSearchValue(e.target.value))}
            />
          </div>
          {/* user dropdown */}
          {data?.data && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a className="justify-between text-white">
                    {data.data.name}
                    <span className="badge">Logged in</span>
                  </a>
                </li>
                <li>
                  <Link to="/dashboard" className="justify-between text-white">
                    Dashboard
                  </Link>
                </li>
                <Button onClick={handleLogout} className="w-full">
                  Logout
                </Button>
              </ul>
            </div>
          )}
          {!data?.data && (
            <div className="flex justify-center items-center gap-2">
              <Button>
                <Link to="/login">Login</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
