// /* eslint-disable react/no-unescaped-entities */

// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import newRequest from "../../utils/newRequest";
// import "./Forget.scss";

// const ForgetPassword = () => {
//   const [email, setEmail] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await newRequest.post("/auth/forgotPassword", { email });
//       console.log(res);
//       toast.success("Reset password link sent to your email", {
//         position: "bottom-left",
//         autoClose: 3000,
//         theme: "dark",
//       });
//       navigate("/login");
//     } catch (err) {
//       toast.error(err.response.data.message, {
//         position: "bottom-left",
//         autoClose: 1500,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "dark",
//       });
//     }
//   };

//   return (
//     <div className="forget-password">
//       <ToastContainer />
//       <form onSubmit={handleSubmit}>
//         <h1>Forgot Password</h1>
//         <div className="form-group">
//           <label htmlFor="email">Email</label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>

//         <button type="submit">Reset Password</button>
//       </form>
//       <p className="login-link">
//         Remember your password? <Link to="/login">Login</Link>
//       </p>
//     </div>
//   );
// };

// export default ForgetPassword;


import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForgotPasswordMutation } from "../../service/userAuthApi";
import "./Forget.scss";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await forgotPassword({ email });

      toast.success("Reset password link sent to your email", {
        position: "bottom-left",
        autoClose: 3000,
        theme: "dark",
      });

      navigate("/login");
    } catch (err) {
      toast.error(err.response.data.message, {
        position: "bottom-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <div className="forget-password">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Resetting Password..." : "Reset Password"}
        </button>
      </form>
      <p className="login-link">
        Remember your password? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default ForgetPassword;
