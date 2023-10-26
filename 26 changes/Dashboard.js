import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().required("Email is required").email("Email is invalid"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Dashboard = () => {
  const [user, setUser] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    axios.get(`http://localhost:8000/users/fetchuser/${id}`).then((res) => {
      setUser(res.data.data);
    });
  }, []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
 

    await axios.put(`http://localhost:8000/users/updateuser/${id}`, data);
    
  };

  const openModal = () => {
    reset(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <h3>User Details</h3>
      <div className="card ms-2 mt-2 col-lg-4 m-1" key={user.id}>
        <h4 className="card-title text-center mt-4">
          {user.firstName}'s Profile
        </h4>
        <div className="card-body p-4">
          <h5 className="card-title">UserID: {user._id}</h5>
          <p>FirstName: {user.firstName}</p>
          <p>LastName: {user.lastName}</p>
          <p>email: {user.email}</p>
        </div>
        <div>
          <button className="btn btn-success m-3" onClick={openModal}>
            Edit Profile
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <form id="registration-form" onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-row">
                    <div className="form-group col-5">
                      <label className="text-dark">First Name</label>
                      <input
                        name="firstName"
                        type="text"
                        {...register("firstName")}
                        className={`form-control ${
                          errors.firstName ? "is-invalid" : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {errors.firstName?.message}
                      </div>
                    </div>
                    <div className="form-group col-5">
                      <label className="text-dark">Last Name</label>
                      <input
                        name="lastName"
                        type="text"
                        {...register("lastName")}
                        className={`form-control ${
                          errors.lastName ? "is-invalid" : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {errors.lastName?.message}
                      </div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col">
                      <label className="text-dark">Email</label>
                      <input
                        name="email"
                        type="text"
                        {...register("email")}
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {errors.email?.message}
                      </div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col">
                      <label className="text-dark">Password</label>
                      <input
                        name="password"
                        type="password"
                        {...register("password")}
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {errors.password?.message}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button type="submit" className="btn btn-primary me-3">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
