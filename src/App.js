import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateTask from './Components/userInterface/Components/CreateTask';
import Dashboard from './Components/userInterface/Screens/Dashboard';
import SignIn from './Components/userInterface/Screens/SignIn';
import SignUp from './Components/userInterface/Screens/SignUp';

function App() {
  return (
    <div>
      <Router>
        <Routes>
           <Route element={<Dashboard />} path="/dashboard/*" />
           <Route element={<SignIn />} path="/login" />
           <Route element={<SignUp />} path="/create-account" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
