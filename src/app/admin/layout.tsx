import AdminDashboardLayout from "@/modules/admin/layouts";
import React, { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
};

export default AdminLayout;
