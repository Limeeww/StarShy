import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/account-styles.css';
import Backendless from "backendless";
import ModalWindow from "./modal-window";

function Account() {
    const iconForNonImageFile = `https://eu.backendlessappcontent.com/${process.env.REACT_APP_ID}/${process.env.REACT_APP_API_KEY}/files/special_folder/file_icon.png`;

    const [user, setUser] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null); 
    const [currentAvatarUrl, setCurrentAvatarUrl] = useState(null); 
    const [geo, setGeo] = useState({ longitude: 0, latitude: 0 });
    const [userFiles, setUserFiles] = useState([]);
    const [modalIsActive, setModalIsActive] = useState(false);
    const [fileForShare, setFileForShare] = useState({});
    const [loading, setLoading] = useState(true); 

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentUser = await Backendless.UserService.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                    await getAvatar(currentUser);
                    await getGeo(currentUser);
                    await getUserFiles(currentUser);
                } else {
                    console.log("No user is currently logged in.");
                    navigate('/login', { replace: true });
                }
            } catch (error) {
                console.error("Error fetching initial data: ", error);
                navigate('/login', { replace: true });
            } finally {
                setLoading(false); 
            }
        };

        fetchData();
    }, [navigate]);

    useEffect(() => {
        fetchAvatar(); 
    }, []);

    const fetchAvatar = async () => {
        try {
            const currentUser = await Backendless.UserService.getCurrentUser();
            if (currentUser) {
                const [currentAvatar] = await Backendless.Files.listing(`${currentUser.name}/avatar`, '*', true);
                setCurrentAvatarUrl(currentAvatar?.publicUrl || null);
            }
        } catch (error) {
            console.error("Error fetching avatar:", error);
        }
    };

    const getAvatar = async (currentUser) => {
        try {
            if (currentUser) {
                const [currentAvatar] = await Backendless.Files.listing(`${currentUser.name}/avatar`, '*', true);
                setAvatar(currentAvatar?.publicUrl || null);
            }
        } catch (err) {
            console.error("Error fetching avatar: ", err);
        }
    };

    const getGeo = async (currentUser) => {
        try {
            if (currentUser) {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });

                await Backendless.Data.of('Users').save({
                    objectId: currentUser.objectId,
                    my_location: {
                        "type": "Point",
                        "coordinates": [
                            position.coords.longitude,
                            position.coords.latitude
                        ]
                    }
                });

                const newGeo = {
                    longitude: position.coords.longitude,
                    latitude: position.coords.latitude
                };

                setGeo(newGeo);
            }
        } catch (err) {
            console.error("Error saving geolocation: ", err);
        }
    };

    const getUserFiles = async (currentUser) => {
        try {
            if (currentUser) {
                const files = await Backendless.Files.listing(`/${currentUser.name}`, '*.*', true);
                setUserFiles(files);
            }
        } catch (err) {
            console.error("Error fetching user files: ", err);
        }
    };

    const deleteFile = async (filePath) => {
        try {
            await Backendless.Files.remove(filePath);
            alert('Your file was removed');
        } catch (err) {
            console.error("Error deleting file: ", err);
        }
    };

    const editProfile = () => {
        navigate('/edit-profile', { replace: true });
    };

    const LogOut = async () => {
        try {
            await Backendless.UserService.logout();
            navigate('/login', { replace: true });
        } catch (err) {
            console.error("Error logging out: ", err);
        }
    };

    const shareWith = (fileURL, fileName) => {
        setModalIsActive(true);
        setFileForShare({ fileURL, fileName });
    };

    // Функция для загрузки нового аватара
    const uploadAvatar = async (event) => {
        event.preventDefault();

        if (!avatarFile) {
            console.error("No file selected.");
            return;
        }

        try {
            const currentUser = await Backendless.UserService.getCurrentUser();
            if (currentUser) {
                const uploadResult = await Backendless.Files.upload(avatarFile, `/${currentUser.name}/avatar`);
                setCurrentAvatarUrl(uploadResult.fileURL);
            }
        } catch (err) {
            console.error("Error uploading avatar: ", err);
        }
    };

    if (loading) {
        return <p>Loading...</p>; 
    }

    return (
        <div>
            {modalIsActive && <ModalWindow file={fileForShare} />}
            <div className="account-container">
                <div className="account-content">
                    {user ? (
                        <div>
                            <div className="user-info">
                                <div className="user-info-title">
                                    <p>{user.name}</p>
                                    <p>{user.email}</p>
                                    <div className="geo-buttons-container">
                                        <button onClick={editProfile}>Edit profile</button>
                                        <p>Longitude: {geo.longitude}</p>
                                        <p>Latitude: {geo.latitude}</p>
                                        <button onClick={() => getGeo(user)}>Get My Geolocation</button>
                                        <button onClick={() => navigate('/geolocation', { replace: true })}>Geolocation</button><br />
                                    </div>
                                </div>
                                <div className="user-info-avatar">
                                    <img src={currentAvatarUrl || iconForNonImageFile} alt="avatar" width="100px" height="100px" />
                                    <form onSubmit={uploadAvatar}>
                                        <input type="file" onChange={(e) => setAvatarFile(e.target.files[0])} />
                                        <button type="submit">Upload Avatar</button>
                                    </form>
                                </div>
                            </div>
                            <button onClick={LogOut} className="submit-logout">Log out</button><br />
                            <div className="user-files">
                                <button onClick={() => getUserFiles(user)}>Get Files</button>
                                {userFiles.length ? (
                                    <div className="user-file-list">
                                        {userFiles.map((file, index) => (
                                            <div className="file-container" key={index}>
                                                <p className="file-name">{file.name}</p>
                                                <button className="download-button">Download</button>
                                                <button onClick={() => shareWith(file.publicUrl, file.name)}>Share with...</button>
                                                <button className="download-button" onClick={() => deleteFile(file.publicUrl)}>X</button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="user-file-list">
                                        <p>At the moment you don't have any files.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p>Please log in.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Account;
