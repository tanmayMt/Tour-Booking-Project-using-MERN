import {createContext, useEffect, useState} from "react";
import axios from "axios";
import {data} from "autoprefixer";
import API from "./axiosConfig"; // Import the configured axios instance


export const UserContext = createContext({});

export function UserContextProvider({children}) {
  const [user,setUser] = useState(null);
  const [ready,setReady] = useState(false);
  useEffect(() => {
    if (!user) {
      API.get('/profile').then(({data}) => {
        setUser(data);
        setReady(true);
      });
    }
  }, []);
  return (
    <UserContext.Provider value={{user,setUser,ready}}>
    {/* <UserContext.Provider value={{user,setUser}}> */}
      {children}
    </UserContext.Provider>
  );
}