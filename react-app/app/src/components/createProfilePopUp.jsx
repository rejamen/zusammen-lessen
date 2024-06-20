import {useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';

const Popup = ({ onClose, onProfileAdded }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [pictures, setPictures] = useState([]);
    const [selectedPicture, setSelectedPicture] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/profile/library')
            .then(response => response.json())
            .then(data => setPictures(data.pictures))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.name = data.name;
            if (selectedPicture) {
                const url = new URL(selectedPicture);
                data.picture = url.pathname.substring(1);
                formData.picture_url = data.picture;
            }
            const response = await fetch('http://localhost:8000/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
            onProfileAdded();
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <h2>Add New Profile</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input {...register("name", { required: true })} />
                    {errors.name && <span>This field is required</span>}
                    {!!pictures.length && 
                        <>
                            <div>Select from our library</div>
                            <div className='profile-library-container'> 
                                {pictures.map((picture, index) => (
                                    <img 
                                        key={index} 
                                        src={picture} 
                                        alt="" 
                                        className={`profile-library-picture ${selectedPicture === picture ? 'selected' : ''}`}
                                        onClick={() => setSelectedPicture(picture)}
                                    />
                                ))}
                            </div>
                            {/* <span>or select yours</span> */}
                        </>
                    }
                    {/* <input type="file" {...register("picture")} /> */}
                    <button type="submit">OK</button>
                </form>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Popup;
