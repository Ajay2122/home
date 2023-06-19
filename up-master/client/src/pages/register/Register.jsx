
import React, { useState } from "react";
import { toast } from "react-toastify";
import upload from "../../utils/upload";
import "./Register.scss";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../service/userAuthApi";

const Register = () => {
  // State variables
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
    phone: "",
  });

  const navigate = useNavigate();

  // Register user mutation
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();

  // Event handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSeller = (e) => {
    const { checked } = e.target;
    setUser((prevUser) => ({ ...prevUser, isSeller: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload file and get the URL
    const url = await upload(file);
    try {
      // Create register user data object with the uploaded image URL
      const registerUserData = {
        ...user,
        img: url,
      };

      // Call the registerUser mutation and unwrap the response
      await registerUser(registerUserData).unwrap();

      // Show success toast notification
      toast.success("Registered Successfully", {
        position: "bottom-left",
        autoClose: 2000,
        theme: "dark",
      });

      // Navigate to the home page
      navigate("/");
    } catch (error) {
      // Show error toast notification
      toast.error("Something went wrong", {
        position: "bottom-left",
        autoClose: 2000,
        theme: "dark",
      });
    }
  };

  // Render the registration form
  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create a new account</h1>
          <label htmlFor="username">Username</label>
          <input
            name="username"
            type="text"
            placeholder="Enter your username"
            value={user.username}
            onChange={handleChange}
          />
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={user.email}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={user.password}
            onChange={handleChange}
          />
          <label htmlFor="profilePicture">Profile Picture</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <label htmlFor="country">Country</label>
          <input
            name="country"
            type="text"
            placeholder="Enter your country"
            value={user.country}
            onChange={handleChange}
          />
          {isLoading ? (
            <button type="submit" disabled>
              Loading...
            </button>
          ) : (
            <button type="submit">Register</button>
          )}
          {error && <div className="error">{error}</div>}
        </div>
        <div className="right">
          <h1>I want to become a seller</h1>
          <div className="toggle">
            <label htmlFor="isSeller">Activate the seller account</label>
            <label className="switch">
              <input
                name="isSeller"
                type="checkbox"
                checked={user.isSeller}
                onChange={handleSeller}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="phone">Phone Number</label>
          <input
            name="phone"
            type="text"
            placeholder="+91 "
            value={user.phone}
            onChange={handleChange}
          />
          <label htmlFor="desc">Description</label>
          <textarea
            placeholder="A short description of yourself"
            name="desc"
            id="desc"
            cols="30"
            rows="10"
            value={user.desc}
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default Register;
