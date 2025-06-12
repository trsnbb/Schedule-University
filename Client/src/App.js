import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import store from "./redux/store.js";
import "./styles/main.css";
import { AuthProvider } from "./AuthContext.jsx"; 
import SocketListener from "./SocketListener.jsx";

import HomePage from "./pages/HomePage/HomePage.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import Feedback from "./pages/Feedback/Feedback.jsx";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <SocketListener /> 
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;