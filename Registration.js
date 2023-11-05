//changes //Logout Func


import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetSingleUserQuery } from "../../redux/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isFetching } = useGetSingleUserQuery();
  const user = data?.data;

  const getExpiryTimeFromToken = (token) => {
    if (!token) {
      return null;
    }

    const tokenParts = token.split('.');
    if (tokenParts.length < 3) {
      return null;
    }

    try {
      const decodedToken = atob(tokenParts[1]);
      const parsedToken = JSON.parse(decodedToken);

      if (parsedToken.exp) {
        return parsedToken.exp * 1000;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error decoding or parsing the token:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('LoggedUserToken');
    const expiryTime = getExpiryTimeFromToken(token);

    if (expiryTime && expiryTime < Date.now()) {
      localStorage.removeItem('LoggedUserToken');
      navigate('/login');
      window.location.reload();
    }
  }, [navigate]);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  const expirationTime = new Date(getExpiryTimeFromToken(localStorage.getItem('LoggedUserToken')));
  const currentDateTime = new Date();

  if (expirationTime < currentDateTime) {
    localStorage.removeItem('LoggedUserToken');
    navigate('/login');
    window.location.reload();
  }


  return (
    <div className="col-10 m-auto">
      <h3 className="text-center">User Details</h3>
      <div className="card m-3">
        {user ? (
          <>
            <h4 className="card-title text-center mt-4">
              {user.firstName}'s Profile
            </h4>
            <div className="card-body p-4">
              <h5 className="card-title">UserID: {user._id}</h5>
              <p>FirstName: {user.firstName}</p>
              <p>LastName: {user.lastName}</p>
              <p>Email: {user.email}</p>
            </div>
            <div>
              <button className="btn btn-success m-3">Edit Profile</button>
              <Link to={'/addproducts'} className="btn btn-success m-3">
                Products
              </Link>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
