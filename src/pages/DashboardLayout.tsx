import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SidebarItem from "./SidebarItem";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from "@mui/icons-material/Add";
import HandshakeIcon from '@mui/icons-material/Handshake';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { loggedInUserState, userState } from "../atom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";

type DashboardLayoutProps = {
  Component: React.ComponentType;
};

export type userProps = {
    id: string,
    Role: string,
    email: string
}

function DashboardLayout({ Component }: DashboardLayoutProps) {
    const [user, setUser] = useRecoilState(userState)
    const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState)

    useEffect(() => {
        if(!user.email){
            location.href = '/login'
        }
    },[user])

    useEffect(() => {
        const fetchDocs = async () => {
          try {
            // const parentDocRef = doc(db, "users", user.uid);
    
            const collectionRef = collection(db, "users");
            const filteredCollectionRef = query(collectionRef, where("id", "==", `${user.uid}`));
    
            const unsubscribe = onSnapshot(filteredCollectionRef, (querySnapshot) => {
              const users: userProps[] = [];
              querySnapshot.forEach((doc) => {
                users.push({
                    id: doc.id,
                    Role: doc.data().Role,
                    email: doc.data().email
                });
              });
              setLoggedInUser(users);
            });
        
            // Unsubscribe from the listener when the component unmounts
            return () => unsubscribe();
          } catch (error) {
            console.log(error);
          }
        };
    
        fetchDocs();
      }, []);

    const handleLogout = () => {
        setUser({})
      localStorage.clear(); // This clears the entire local storage
      location.reload();
    }

  return (
    <div>
      <div className="bg-sky-500 text-white flex justify-between items-center space-x-5 p-4">
        <div className="flex items-center">
        <MenuIcon />
        <h1>Hi {user.email}</h1>
        </div>
        <button onClick={handleLogout} className="bg-slate-800 p-2 rounded-md">Logout </button>
      </div>
      <div className="flex ">
        <aside className="flex-[0.25] bg-gray-100 h-screen">
          <h2 className="bg-gray-600 text-center text-white text-sm p-4 capitalize">
           {loggedInUser.length > 0 && loggedInUser[0].Role}
          </h2>
          <Link to='/'>
            <SidebarItem title="Dashboard" Icon={DashboardIcon} />
          </Link>
          <Link to='/add-product'>
            <SidebarItem title="Add Product" Icon={AddIcon} />
          </Link>
          <Link to='/approved'>
            <SidebarItem title="Closed Deals" Icon={HandshakeIcon} />
          </Link>
          <Link to='/counter-offers'>
            <SidebarItem title="Counter Offers" Icon={AttachMoneyIcon} />
          </Link>
        
        </aside>

        <div className="flex-[0.75]">
          <Component />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
