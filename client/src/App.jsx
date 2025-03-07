import './App.css'
import { Route,Routes } from 'react-router-dom';
import IndexPage from './pages/IndexPage.jsx';//.jsx
import LoginPage from './pages/LoginPage.jsx';
import Layout from './Layout';
import RegisterPage from './pages/RegisterPage';
import axios from 'axios';
import {UserContextProvider} from "./UserContext";
import ProfilePage from './pages/ProfilePage';
import PlacesPage from "./pages/PlacesPage";
import PlacesFormPage from "./pages/PlacesFormPage";
import PlacePage from "./pages/PlacePage";
import BookingsPage from "./pages/BookingsPage";
import BookingPage from "./pages/BookingPage";

//https://tour-booking-api.onrender.com
axios.defaults.baseURL="http://localhost:4000"; 
// axios.defaults.baseURL="https://tour-booking-api.onrender.com"; 
// axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
// {/*http://localhost:4000 as a default url*/}
axios.defaults.withCredentials=true; //for respose with cookies in loginPage.jsx

function App(){
  return(
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlacesFormPage />} />
          <Route path="/account/places/:id" element={<PlacesFormPage />} />
          <Route path="/place/:id" element={<PlacePage />} />
          {/* <Route path="/account/bookings" element={<AccountPage />}/>*/}
          {/*<Route path="/account/places" element={<AccountPage />} /> */}
           
          
          {/*<Route path="/account/places/:id" element={<PlacesFormPage />} />*/}
          
          <Route path="/account/bookings" element={<BookingsPage />} />
          <Route path="/account/bookings/:id" element={<BookingPage />} /> 
        </Route>
      </Routes>
    </UserContextProvider> 
  )
}
export default App