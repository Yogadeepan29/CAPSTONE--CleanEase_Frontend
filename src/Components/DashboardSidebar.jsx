import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutSucess } from "../Redux/Slice/userSlice";
import { MdShoppingCart, MdEditLocation } from "react-icons/md";

const DashboardSidebar = () => {
  const { currentuser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrl = urlParams.get("tab");
    if (tabUrl) {
      setTab(tabUrl);
    }
  }, [location.search]);

  const handleSignOut = () => {
    dispatch(signOutSucess());
    localStorage.removeItem("Token");
  };

  return (
    <Sidebar className="w-full md:w-50 ">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-2">
          <Link to="/user/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentuser.rest.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {!(currentuser && currentuser.rest.isAdmin) && ( // Show dropdown items if currentuser is NOT an admin
            <>
              <Link to="/user/dashboard?tab=address">
                <Sidebar.Item
                  active={tab === "address"}
                  icon={MdEditLocation}
                  as="div"
                >
                  Address
                </Sidebar.Item>
              </Link>

              <Link to="/cart" className="hidden md:inline">
                <Sidebar.Item
                  active={tab === "cart"}
                  icon={MdShoppingCart}
                  label={cartItems.length > 0 ? cartItems.length : null}
                  labelColor="red"
                  as="div"
                >
                  Cart
                </Sidebar.Item>
              </Link>
            </>
          )}
          {currentuser.rest.isAdmin && (
            <Sidebar.Item as={Link} to="/admin/dashboard" icon={HiChartPie}>
              Dashboard
            </Sidebar.Item>
          )}

          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer hidden md:flex"
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashboardSidebar;
