import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Profile from './profile.jsx';
import Popup from './createProfilePopUp.jsx';

const ProfileList = () => {
    const [profiles, setProfiles] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const fetchProfiles = () => {
        fetch('http://localhost:8000/profile')
            .then(response => response.json())
            .then(data => setProfiles(data.profiles))
            .catch(error => console.error('Error fetching data:', error));
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const handleAddProfileClick = () => {
        setIsPopupOpen(true);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const handleProfileAdded = () => {
        fetchProfiles();
    };

    return (
        <div className='profile-list-container'>
            <Profile createNew={true} handleAddProfileClick={handleAddProfileClick}/>
            {profiles.map((profile, index) => (
                <Link to={`/profile/${profile._id}`} key={index}>
                    <Profile name={profile.name} pictureUrl={profile.picture_url} />
                </Link>
            ))}
            {isPopupOpen && (
                <Popup onClose={handlePopupClose} onProfileAdded={handleProfileAdded} />
            )}
        </div>
    );
};

export default ProfileList;
