import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfileList from './components/profileList';
import ProfileDetails from './components/profileDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProfileList />} />
        <Route path="/profile/:profileId" element={<ProfileDetails />} />
      </Routes>
    </Router>
  );
}

export default App;

