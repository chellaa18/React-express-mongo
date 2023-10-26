import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";



//schema validation
const schema = yup
  .object({
    password: yup
      .string()
      .required("Password is required"),
    email: yup.string().required("Email is required")
    .email("Email is invalid"),
  })
  .required();

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loggedUser, setLoggedUser] = useState({});
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  // handleSubmit data
  const onSubmit = async (data) => {
    console.log(data);
    try {
      // console.log("working", data);
      const response = await axios.post("http://localhost:8000/users/login", data);

      navigate(`/dashboard/${response.data.user._id}`);
      localStorage.setItem("LoggedUserID", response.data.user._id)
   
    } catch (error) {
      console.error("login failed", error);
    }

    resetField("password");

    resetField("email");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };



  return (
    <div className="App p-5">
      <div className="container p-5">
        <div className="row d-flex justify-content-center align-items-center vh-100">
          <div className="col-lg-5">
           
            <form
              className="p-5 rounded h-100 mb-5"
              onSubmit={handleSubmit(onSubmit)}
              style={{ backgroundColor: "rgba(255, 0, 174, 0.12" }}
            >
              <h3 style={{ color: "#d51c9a" }}>Login Form</h3>

              <div className="form-group">
                <label className="">Email: </label>
                <br />
                <input
                  autoFocus
                  className="form-control"
                  // style={{textTransform:'lowercase'}}
                  {...register("email")}
                  name="email"
                  type="email"
                />
                <p className="text-danger">{errors.email?.message}</p>
              </div>

              <div className="form-group">
                <label className="">Password: </label>
                <br />
                <div className="input-group">
                  <input
                    className="form-control"
                    {...register("password")}
                    name="password"
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    type="button"
                    className="input-group-text"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <i className="bi bi-eye-slash-fill"></i>
                    ) : (
                      <i className="bi bi-eye-fill"></i>
                    )}
                  </button>
                </div>

                <p className="text-danger">{errors.password?.message}</p>
              </div>
              <input type="submit" className="nav-button p-2" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
