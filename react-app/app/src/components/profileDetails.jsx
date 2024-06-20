import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const ProfileDetails = () => {
  const { profileId } = useParams();
  const [profile, setProfile] = useState({});
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    fetch(`http://localhost:8000/profile/${profileId}`)
      .then(response => response.json())
      .then(data => {
        setProfile(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [profileId]);

  const onSubmit = (data) => {
    const newBook = {
      name: data.bookName,
      pages: data.bookPages || undefined, // Ensure pages is optional if not provided
      start_date: data.startDate || undefined, // Ensure startDate is optional if not provided
      end_date: data.endDate || undefined // Ensure endDate is optional if not provided
    };

    fetch(`http://localhost:8000/profile/${profileId}/add-book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newBook)
    })
    .then(response => response.json())
    .then(data => {
      if (data.name) {
        setProfile(prevProfile => ({
          ...prevProfile,
          books: prevProfile.books ? [...prevProfile.books, data] : [data]
        }));
        reset(); // Clear the form fields
      } else {
        console.error('Error: Incorrect data format returned from API');
      }
    })
    .catch(error => console.error('Error adding book:', error));
  };

  return (
    <div className="profile-details-container">
      <div className="profile-header">
        <img src={profile.picture_url || "https://via.placeholder.com/150"} alt="profile" className="profile-avatar"/>
        <div className="profile-info">
          <h2>{profile.name}</h2>
          <p>Total books: {profile.books ? profile.books.length : 0}</p>
        </div>
      </div>

      <div className="add-book-container">
        <form onSubmit={handleSubmit(onSubmit)} className="add-book-form">
          <input
            type="text"
            placeholder="Book Name"
            {...register("bookName", { required: true })}
            className="book-input"
          />
          {errors.bookName && <span className="error-message">Book Name is required</span>}
          <input
            type="number"
            placeholder="Pages (optional)"
            {...register("bookPages")}
            className="book-input"
          />
          <input
            type="date"
            placeholder="Start date (optional)"
            {...register("startDate")}
            className="book-input"
          />
          <input
            type="date"
            placeholder="End date (optional)"
            {...register("endDate")}
            className="book-input"
          />
          <button type="submit" className="add-book-button">Add</button>
        </form>
      </div>

      {profile.books && profile.books.length > 0 ? (
        <table className="books-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Pages</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            {profile.books.map((book, index) => (
              <tr key={index}>
                <td>{book.name}</td>
                <td>{book.pages || 'N/A'}</td> {/* Display 'N/A' if pages are not provided */}
                <td>{book.start_date || 'N/A'}</td> {/* Display 'N/A' if start date is not provided */}
                <td>{book.end_date || 'N/A'}</td> {/* Display 'N/A' if end date is not provided */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>
          <p>No books available.</p>
          <p>Start reading your first one today :)</p>
        </>
      )}
    </div>
  );
};

export default ProfileDetails;
