const Profile = ({ name, pictureUrl, createNew = false, handleAddProfileClick }) => {

  return (
    <div className="profile-container">
      {createNew ? (
        <div className="profile-picture">
          <button className="add-button" onClick={handleAddProfileClick}>+</button>
        </div>
      ) : (
        <div className="profile-picture">
          <img src={pictureUrl || "https://via.placeholder.com/150"} alt="profile" />
        </div>
      )}
      <div className="profile-name">
        <h1>{name}</h1>
      </div>
    </div>
  );
};

export default Profile;
