import React, { useState } from "react";
import image from "../assets/dell-second-hand-laptop.jpeg";
import { useRecoilState } from "recoil";
import { loggedInUserState, userState } from "../atom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type productProps = {
  product_name: string;
  product_description: string;
  product_price: string;
  product_status: string;
  image_url: string;
  productId: string;
  counter_offer: string,
  city: string,
  address: string,
  phone_number: string
};

function Product({
  product_name,
  product_description,
  product_price,
  product_status,
  image_url,
  productId,
  counter_offer,
  city,
  address,
  phone_number
}: productProps) {
  const [user, setUser] = useRecoilState(userState);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [open, setOpen] = React.useState(false);
  const [counterOffer, setCounterOffer] = useState("");
  const [prodId, setProdId] = useState("");
  const handleOpen = (id: string) => {
    setProdId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  console.log(loggedInUser[0])

  const handleApprove = async (id: string) => {
    try {
      const docRef = doc(db, "products", id);

      // Create a new data object with the updated field value
      const updatedData = {
        product_status: "Closed Deal",
      };

      // Update the document with the new data
      await updateDoc(docRef, updatedData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCounter = async () => {
    if(counterOffer && prodId){
      try {
        // Assuming you have a document reference to the document you want to update
        const docRef = doc(db, "products", prodId);
  
        // Create a new data object with the updated field value
        const updatedData = {
          counter_offer: counterOffer,
          product_status: "Counter Offer",
        };
  
        // Update the document with the new data
        await updateDoc(docRef, updatedData);
        alert('Counter offer successfully sent.')
        handleClose()
      } catch (error) {
        console.log(error);
      }
    }else {
        alert('Please ensure you enter a counter offer')
    }
  
  };

  const handleAccept = async (id: string) => {
    try {
      const docRef = doc(db, "products", id);

      // Create a new data object with the updated field value
      const updatedData = {
        product_status: "Closed Deal",
      };

      // Update the document with the new data
      await updateDoc(docRef, updatedData);
    } catch (error) {
      console.log(error);
    }
  }

  const handleReject = async (id: string) => {
    try {
      const docRef = doc(db, "products", id);

      // Create a new data object with the updated field value
      const updatedData = {
        product_status: "Offer Rejected",
      };

      // Update the document with the new data
      await updateDoc(docRef, updatedData);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-56 mx-10 mb-10">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Enter counter offer amount
          </Typography>
          <TextField
            placeholder="Counter offer"
            className="w-full"
            value={counterOffer}
            onChange={(e) => setCounterOffer(e.target.value)}
            type='number'
          />
          <button
           onClick={handleCounter}
           className="p-2 bg-green-500 self-center text-white rounded-md mt-5">
            Submit
          </button>
        </Box>
      </Modal>
      <div>
        <img src={image_url} alt="" className="h-[250px] w-full " />
        <div className="p-2 w-full text-center bg-slate-800 text-white">
          {product_name}
        </div>
        <div className="shadow-lg bg-white p-2 flex flex-col space-y-3">
          <h2 className="text-slate-600">
            {" "}
            <span className="font-semibold text-slate-800">
              Description:
            </span>{" "}
            {product_description}
          </h2>
          <h2 className="text-slate-600">
            {" "}
            <span className="font-semibold text-slate-800">Price:</span>{" "}
            K{product_price}
          </h2>
          <h2 className="text-green-500">
            {" "}
            <span className="font-semibold text-slate-800">Status:</span>{" "}
            {product_status}
          </h2>
          <h2 className="text-slate-600">
            {" "}
            <span className="font-semibold text-slate-800">City:</span>{" "}
            {city}
          </h2>
          <h2 className="text-slate-600">
            {" "}
            <span className="font-semibold text-slate-800">Address:</span>{" "}
            {address}
          </h2>
          <h2 className="text-slate-600">
            {" "}
            <span className="font-semibold text-slate-800">Phone Number:</span>{" "}
            {phone_number}
          </h2>
          {loggedInUser.length > 0 &&
            loggedInUser[0].Role === "admin" &&
            product_status === "Pending Review"  && (
              <div className="flex space-x-4">
                <button
                  onClick={() => handleApprove(productId)}
                  className="p-2 bg-green-500 text-white rounded-md"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleOpen(productId)}
                  className="p-2 bg-orange-500 text-white rounded-md"
                >
                  Counter offer
                </button>
              </div>
            )}
            {counter_offer && 
             <div>
                <h2 className="text-green-500">
            {" "}
            <span className="font-semibold text-slate-800">Counter Offer:</span>{" "}
            K{counter_offer}
          </h2>
             </div>
            }
             {loggedInUser.length > 0 &&
            loggedInUser[0].Role === "user" &&
            product_status === "Counter Offer" && (
              <div className="flex space-x-4">
                <button
                  onClick={() => handleAccept(productId)}
                  className="p-2 bg-green-500 text-white rounded-md"
                >
                  Accept Offer
                </button>
                <button
                  onClick={() => handleReject(productId)}
                  className="p-2 bg-red-500 text-white rounded-md"
                >
                  Reject offer
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default Product;
