import axios from "axios";

import AdminUsersComp from "../../components/admin/AdminUsersComp";

const fetchUsers = async (abortCtrl) => {
  try {
    const users = await axios.get("/api/users");

    return users.data;
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (userId) => {
  try {
    const users = await axios.delete(`/api/users/${userId}`);
    return users.data;
  } catch (error) {
    console.log(error);
  }
};

const AdminUsers = () => {
  return <AdminUsersComp fetchUsers={fetchUsers} deleteUser={deleteUser} />;
};

export default AdminUsers;
