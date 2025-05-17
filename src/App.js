import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { MyDispatchContext, MyUserContext } from "./configs/Context";
import { useEffect, useReducer, useState } from "react";
import MyUserReducer from "./reducers/MyUserReducer";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import AcademicStaff from "./components/academicStaff/AcademicStaff";
import cookie from "react-cookies";
import { authApis, endpoints } from "./configs/Apis";
import MySpinner from "./components/layouts/MySpinner";
import Unauthorized from "./components/routes/Unauthorized";

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = cookie.load("token");
      if (token !== null) {
        try {
          const res = await authApis().get(endpoints["current_user"]);
          dispatch({
            type: "login",
            payload: res.data,
          });
          
        } catch (err) {
          console.error("Lỗi lấy user ", err);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  return loading ? (
    <MySpinner />
  ) : (
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Header />
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/academicStaff/theses"
                element={
                  <ProtectedRoute allowedRoles={["ROLE_ACADEMICSTAFF"]}>
                    <AcademicStaff />
                  </ProtectedRoute>
                }
              />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
          </Container>
          <Footer />
        </BrowserRouter>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
  );
};

export default App;
