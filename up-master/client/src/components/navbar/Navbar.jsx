import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { toast } from "react-toastify";
import "./Navbar.scss";
import axios from "axios";


function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const { pathname } = useLocation();
  const dropdownRef = useRef(null);


  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    document.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("scroll", isActive);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      toast.success(" Logout successfully !", {
        position: "bottom-left",
        autoClose: 1000,
        theme: "dark",
      });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const initPayment = (order) => {
    const options = {
      key: "rzp_test_rD7nY8ydONcLyG",
      amount: 1000*100,
      currency: "inr",
      name,
      description: "Test Transaction",
      order_id: order.id,
      handler: async (response) => {
        try {
          const { data } = await axios.post("http://localhost:8000/api/pay/verify", response);

          // if (data) {
          //   const bookedDates = bookedDateArray(checkIn, checkOut);
          //   const formData = {
          //     checkIn,
          //     checkOut,
          //     numberOfGuests,
          //     name,
          //     phone,
          //     bookBy: user._id,
          //     placeID: place._id,
          //     price,
          //     bookedDates,
          //     placeName: place.title,
          //     placeAddress: place.address,
          //     placePhoto: place.photo[0],
          //     checkInTime: place.checkIn,
          //     checkOutTime: place.checkOut,
          //     paid: false,
          //   };

          //   dispatch(bookPlaceAsync(formData));
          //   setRedirect(true);
          // }
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "#F5385D",
      },
    };
    
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };
  console.log("dffd0",window);
  const paymentHandler = async () =>  {
    try {
      const orderUrl = "http://localhost:8000/api/pay/checkout";
      const { data } = await axios.post(orderUrl);

      console.log(data);
      initPayment(data.order);
    } catch (error) {
      console.log(error);
    }
    
  }
  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">Skillify</span>
          </Link>
          <button onClick={paymentHandler}> 
            pay
          </button>
          <span className="dot">.</span>
        </div>
        <div className="links">
          <span>Skillify Business</span>
          {!currentUser?.user.isSeller && <span>Become a Seller</span>}
          {currentUser ? (
            <div
              className="user"
              onClick={() => setOpen(!open)}
              ref={dropdownRef}
            >
              <img src={currentUser?.user.img || "/img/noavatar.jpg"} alt="" />
              {open && (
                <div className="options">
                  <Link className="link" to="/profile">
                    Profile
                  </Link>
                  {currentUser.user.isSeller && (
                    <>
                      <Link className="link" to="/mygigs">
                        Gigs
                      </Link>
                      <Link className="link" to="/add">
                        Add New Gig
                      </Link>
                    </>
                  )}
                  <Link className="link" to="/orders">
                    Orders
                  </Link>
                  <Link className="link" to="/messages">
                    Messages
                  </Link>

                  <Link className="link" onClick={handleLogout}>
                    Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">
                Sign in
              </Link>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
            <Link className="link menuLink" to="/gigs?cat=design">
              Graphics & Design
            </Link>
            <Link className="link menuLink" to="/gigs?cat=Video...Animation">
              Video & Animation
            </Link>
            <Link
              className="link menuLink"
              to="/gigs?cat=Writing...Translation"
            >
              Writing & Translation
            </Link>
            <Link className="link menuLink" to="/gigs?cat=Ai">
              AI Services
            </Link>
            <Link className="link menuLink" to="/gigs?cat=Digital...Marketing">
              Digital Marketing
            </Link>
            <Link className="link menuLink" to="/gigs?cat=music">
              Music & Audio
            </Link>
            <Link className="link menuLink" to="/gigs?cat=Programming...Tech">
              Programming & Tech
            </Link>
            <Link className="link menuLink" to="/gigs?cat=Business">
              Business
            </Link>
            <Link className="link menuLink" to="/gigs?cat=Lifestyle">
              Lifestyle
            </Link>
          </div>
          <hr />
        </>
      )}
    </div>
  );
}

export default Navbar;
