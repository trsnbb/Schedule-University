import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import store from "./redux/store.js";


import HomePage from "./pages/HomePage/HomePage.jsx";
function App() {
  return (
    // <Provider store={store}>
    //   <AuthProvider>
        <Router>
          <Routes>
            <Route path='/' element={<HomePage />} />
          </Routes>
        </Router>
      /* </AuthProvider>
    </Provider> */
  );
}

export default App;
