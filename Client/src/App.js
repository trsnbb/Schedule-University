import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import store from "./redux/store.js";
import "./styles/main.css";


import HomePage from "./pages/HomePage/HomePage.jsx";
import Settings from "./pages/Settings/Settings.jsx";

function App() {
  return (
    // <Provider store={store}>
    //   <AuthProvider>
        <Router>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/settings' element={<Settings />} />

          </Routes>
        </Router>
      /* </AuthProvider>
    </Provider> */
  );
}

export default App;
