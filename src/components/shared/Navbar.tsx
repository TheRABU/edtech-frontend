import { ModeToggle } from "../mode-toggle";
import { useDispatch, useSelector } from "react-redux";
import { setSearchValue } from "@/redux/searchSlice";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { useLogoutMutation } from "@/redux/features/auth/auth.api";
const Navbar = () => {
  const searchValue = useSelector(
    (state: { search: { value: string } }) => state.search.value
  );
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* <nav className="w-full flex h-16 items-center justify-between p-4 bg-green-300 shadow-md">
        <div>
          <h2 className="text-3xl text-black">Ed Tech</h2>
        </div>
        <div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/">Courses</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/">Home 3</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div>
          <Button>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </nav> */}
      <div className="navbar bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            EduTech BD
          </Link>
        </div>
        <div className="flex justify-center items-center gap-2">
          <div className="flex justify-center items-center gap-2">
            <Button>
              <Link to="/login">Login</Link>
            </Button>
            <Button>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
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
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <Button onClick={handleLogout} className="w-full">
                Logout
              </Button>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
