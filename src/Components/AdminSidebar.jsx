import React from "react";
import { Sidebar, Tooltip } from "flowbite-react";
import { HiChartPie, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { MdCleaningServices, MdReviews, MdBusiness } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";

const AdminSidebar = () => {
  const location = useLocation(); // Get the current location for active link highlighting
  return (
    <Sidebar className="w-full lg:w-64">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {/* Dashboard */}
          <Tooltip content="Dashboard" placement="right" className="lg:hidden">
            <Sidebar.Item
              as={Link}
              className="lg:w-56 "
              to="/admin/dashboard"
              icon={HiChartPie}
              active={location.pathname === "/admin/dashboard"}
            >
              <span className="hidden lg:inline">Dashboard</span>
            </Sidebar.Item>
          </Tooltip>
          {/* Users */}
          <Tooltip content="Users" placement="right" className="lg:hidden">
            <Sidebar.Item
              as={Link}
              className="lg:w-56"
              to="/admin/users"
              icon={HiUser}
              active={location.pathname === "/admin/users"}
            >
              <span className="hidden lg:inline">Users</span>
            </Sidebar.Item>
          </Tooltip>
          {/* Services */}
          <Tooltip content="Services" placement="right" className="lg:hidden">
            <Sidebar.Item
              as={Link}
              className="lg:w-56"
              to="/admin/services"
              icon={MdCleaningServices}
              active={location.pathname === "/admin/services"}
            >
              <span className="hidden lg:inline">Services</span>
            </Sidebar.Item>
          </Tooltip>
          {/* Orders */}
          <Tooltip content="Orders" placement="right" className="lg:hidden">
            <Sidebar.Item
              as={Link}
              className="lg:w-56"
              to="/admin/orders"
              icon={MdBusiness}
              active={location.pathname === "/admin/orders"}
            >
              <span className="hidden lg:inline">Orders</span>
            </Sidebar.Item>
          </Tooltip>
          {/* Reviews*/}
          <Tooltip content="Reviews" placement="right" className="lg:hidden">
            <Sidebar.Item
              as={Link}
              className="lg:w-56"
              to="/admin/reviews"
              icon={MdReviews}
              active={location.pathname === "/admin/reviews"}
            >
              <span className="hidden lg:inline">Reviews</span>
            </Sidebar.Item>
          </Tooltip>
          {/* Transactions */}
          <Tooltip
            content="Transactions"
            placement="right"
            className="lg:hidden"
          >
            <Sidebar.Item
              as={Link}
              className="lg:w-56"
              to="/admin/transactions"
              icon={GrTransaction}
              active={location.pathname === "/admin/transactions"}
            >
              <span className="hidden lg:inline">Transactions</span>
            </Sidebar.Item>
          </Tooltip>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default AdminSidebar;
