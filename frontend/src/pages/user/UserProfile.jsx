import axios from "axios";

import UserProfileComp from "../../components/user/UserProfileComp";

const updateUserRequest = async (
  firstName,
  lastName,
  phoneNumber,
  address,
  country,
  zipCode,
  city,
  state,
  password
) => {
  const user = await axios.put("/api/users/profile", {
    firstName,
    lastName,
    phoneNumber,
    address,
    country,
    zipCode,
    city,
    state,
    password,
  });

  return user.data;
};

export const fetchUserData = async (userId) => {
  const user = await axios.get("/api/users/profile/" + userId);

  return user.data;
};

const UserProfile = () => {
  return (
    <UserProfileComp
      updateUserRequest={updateUserRequest}
      fetchUserData={fetchUserData}
    />
  );
};

export default UserProfile;
