import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from "react-bootstrap";
import Login from "./components/Login";
import Register from "./components/Register";
import { MyUserContext } from "./configs/MyContexts";
import { useEffect, useReducer } from "react";
import { MyUsrReducer } from "./reducers/MyUserReducer";

import DoctorSearch from "./components/DoctorSearch";
import Banner from "./components/layout/Banner";
import DoctorDetail from "./components/doctor/DoctorDetail";
import PatientForm from "./components/Patient/PatientForm";
import PatientsTable from "./components/Patient/PatientsTable";
import Booking from "./components/Booking";
import DoctorCalendar from "./components/doctor/DoctorCalendar";
import AppointmentsTable from "./components/AppointmentsTable";
import Payment from "./components/Payment";
import Chat from "./components/Chat/Chat";
import ListChat from "./components/Chat/ListChat";

const App = () => {
  const [user, dispatch] = useReducer(MyUsrReducer, null);



  return (
    <MyUserContext.Provider value={[user, dispatch]}>

      <BrowserRouter>
        <Header />
        {/* {user === null || user.userRole === "ROLE_USER" ? <Header /> : <h1>abc</h1>} */}

        <Container>
          <Routes>
            <Route path="/booking" element={<Booking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctor" element={<DoctorSearch />} />
            <Route path="/" element={<Banner />} />
            <Route path="/doctors/:id" element={<DoctorDetail />} />
            <Route path="/PatientForm" element={<PatientForm />} />
            <Route path="/PatientsTable" element={<PatientsTable />} />
            <Route path="/DoctorCalendar/:id" element={<DoctorCalendar />} />
            <Route path="/AppointmentsTable" element={<AppointmentsTable />} />
            <Route path="/Payment" element={<Payment />} />
            <Route path="/chat/:friendId" element={<Chat />} />
            <Route path="/ListChat" element={<ListChat />} />
          </Routes>
        </Container>

        <Footer />
      </BrowserRouter>

    </MyUserContext.Provider >
  );
}

export default App;



