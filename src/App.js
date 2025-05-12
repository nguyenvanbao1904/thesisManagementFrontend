import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./components/layouts/Header"
import Footer from "./components/layouts/Footer"
import Home from "./components/Home"
import Login from "./components/Login"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from "react-bootstrap"
import { MyDispatchContext, MyUserContext } from "./configs/Context"
import { useReducer } from "react"
import MyUserReducer from "./reducers/MyUserReducer"

const App = ()=>{
  const [user, dispatch] = useReducer(MyUserReducer, null);
  return (
    <>
      <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Header />
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Container>
          <Footer />
      </BrowserRouter>
      </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </>
  )
}

export default App