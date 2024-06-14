// import React, {useEffect, useRef, useState} from "react";
// import { useNavigate } from 'react-router-dom';
// import '../styles/account-styles.css';
// import Backendless from "backendless";
// import axios from 'axios';
// import fileDownload from "js-file-download";
// import ModalWindow from "./modal-window";
// import loginForm from "./login-form";

// function Account() {

//     const iconForNonImageFile = `https://eu.backendlessappcontent.com/${process.env.REACT_APP_ID}/${process.env.REACT_APP_API_KEY}/files/special_folder/file_icon.png`
//     const regExForFileName = /.(jpg|png|gif)$/i

//     const [user, setUser] = useState({})
//     const [file, setFile] = useState()
//     const [avatar, setAvatar] = useState()
//     const [newAvatar, setNewAvatar] = useState()
//     const [avatarURL, setAvatarURL] = useState({})
//     const [userFiles, setUserFiles] = useState([])
//     const [fileURL, setFileURL] = useState('')
//     const [modalIsActive, setModalIsActive] = useState(false)
//     const [fileForShare, setFileForShare] = useState({})
//     const [geo, setGeo] = useState({longitude: 0, latitude: 0})
    // const [friendName, setFriendName] = useState('')
    // const [friends, setFriends] = useState([])
    // const [friendsRequests, setFriendsRequests] = useState([])
    // const [allFriends, setAllFriends] = useState([])

//     const navigate = useNavigate()

//     const getUser = async () => {
//         try{
//             const userData = await Backendless.UserService.getCurrentUser()
//             setUser(userData)
//         } catch(err) {
//             console.error(err)
//         }
//     }

//     const editProfile = () => {
//         navigate('/edit-profile', { replace: true })
//     }

//     const getGeo = async () => {
//         const newGeo = {}
//         navigator.geolocation.getCurrentPosition(position => {
//             Backendless.Data.of('Users').save({
//                 objectId: user.objectId,
//                 my_location: {
//                     "type": "Point",
//                     "coordinates": [
//                         position.coords.longitude,
//                         position.coords.latitude
//                     ]
//                 }

//             })
//             newGeo.longitude = position.coords.longitude
//             newGeo.latitude = position.coords.latitude
//             setGeo(newGeo)
//         })

//         // console.log(geo)
//         // try {
//         //     await Backendless.Data.of('Users').save({
//         //         objectId: user.objectId,
//         //         my_location: {
//         //             "type": "Point",
//         //             "coordinates": [
//         //                 geo.longitude,
//         //                 geo.latitude
//         //             ]
//         //         }
//         //
//         //     })
//         //     alert('Your account data was updated')
//         //     navigate('/account', { replace: true })
//         // } catch(err) {
//         //     console.log(err)
//         // }
//     }

//     const LogOut = async () => {
//         try{
//             await Backendless.UserService.logout()
//             navigate('/login', { replace: true })
//         } catch(err) {
//             console.error(err)
//         }
//     }

//     const uploadFile = async () => {
//         try{
//             const URL = await Backendless.Files.upload(file, user.name, true)
//             alert('Your file was uploaded')
//         } catch(err) {
//             Backendless.Logging.setLogReportingPolicy( 1, 1 )
//             Backendless.Logging.getLogger('file-upload-logger').error(err.message)
//             console.error(err)
//         }
//     }

//     const uploadAvatar = async () => {
//         try {
//             console.log(newAvatar)
//             await Backendless.Files.remove(avatar)
//             const URL = await Backendless.Files.upload(newAvatar, `${user.name}/avatar`, true)
//             setAvatarURL(URL)
//             alert('Your avatar was uploaded')
//         } catch(err) {
//             console.log(err)
//         }
//     }

//     const getAvatar = async () => {
//         try {
//             const [ currentAvatar ] = await Backendless.Files.listing(`/${user.name}/avatar`, '*', true)
//             setAvatar(currentAvatar.publicUrl)
//         } catch(err) {
//             console.log(err)
//         }
//     }

//     const getUserFiles = async () => {
//         try {
//             const files = await Backendless.Files.listing(`/${user.name}`, '*.*', true)
//             setUserFiles(files)
//         } catch(err) {
//             alert(err)
//         }
//     }

//     const downloadFile = async (fileName) => {
//         try {
//             const res = await axios.get(
//                 `https://eu.backendlessappcontent.com/${process.env.REACT_APP_ID}/${process.env.REACT_APP_API_KEY}/files/${user.name}/${fileName}`,
//                 { responceType: 'blob' })
//             await fileDownload(res.data, fileName)
//             console.log(res)
//         } catch(err) {
//             console.log(err)
//         }
//     }

//     const deleteFile = async (filePath) => {
//         try {
//             await Backendless.Files.remove(filePath)
//             alert('Your file was removed')
//         } catch(err) {
//             console.log(err)
//         }
//     }

//     const fileNameHandler = fileName => {
//         const nameOfFile = fileName.split('').slice(0, 30)
//         nameOfFile.push('...')
//         return nameOfFile.join('')
//     }

//     const shareWith = (fileURL, fileName) => {
//         /*When clicked button "Share with" activate flag isOpen, then open modal component,
//         then find the user for share and create in them folder folder "Share with me" and add public URL into .txt file*/
//         setModalIsActive(true)
//         setFileForShare({fileURL, fileName})
//     }

//     const addFriend = async () => {
//         try {
//             const whereClause = `name = '${friendName}'`
//             const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause)
//             const friend = await Backendless.Data.of('Users').find(queryBuilder)
//             const friendData = [...allFriends]
//             friendData.push({
//                 "name": friend[0].name,
//                 "status": "holding",
//                 "friendId": friend[0].objectId
//             })
//             await Backendless.Data.of('Users').save({
//                 objectId: user.objectId,
//                 friends: friendData
//             })
//             alert('Friend was added')
//             setFriendName('')
//         } catch(err) {
//             console.log(err)
//         }
//     }

//     const getFriendsRequests = async () => {
//         try {
//             const whereClause = `friends->'$.friendId'='${user.objectId}'`
//             const queryBuilder = Backendless.DataQueryBuilder.create()
//             queryBuilder.addProperty(whereClause)
//             const data = await Backendless.Data.of('Users').find(queryBuilder)
//             setFriendsRequests(data)
//             console.log(data)
//             console.log(friendsRequests)
//         } catch(err) {
//             console.log(err)
//         }
//     }

//     const getAllFriends = async () => {
//         try {
//             const friends = user.friends ? [...user.friends] : []
//             setAllFriends(friends)
//             // await getFriendsRequests()
//         } catch(err) {
//             console.log(err)
//         }
//     }

//     useEffect( () => {
//         const fetchData = async () => {
//             await getUser()
//             await getAvatar()
//             setInterval(async () => {
//                 await getGeo()

//             }, 60000)
//         }

//         fetchData()
//     })

//     return(
//         <div>
//             {modalIsActive? <ModalWindow file={fileForShare}/>: <div></div>}
//             <div className="account-container">
//                 <div className="account-content">
//                     {user ?
//                         <div className="">
//                             <div className="user-info">
//                                 <div className="user-info-title">
//                                     <p>{user.name}</p>
//                                     <p>{user.email}</p>
//                                     <p>{user.country}</p>
//                                     <button onClick={editProfile}>Edit profile</button>
//                                     <p>Longitude: {geo.longitude}</p>
//                                     <p>Latitude: {geo.latitude}</p><br />
//                                     <button onClick={getGeo}>Get My Geolocation</button><br /><br />
//                                     <button onClick={() => navigate('/geolocation', { replace: true })}>Geolocation</button><br /><br />
//                                     <button onClick={() => navigate('/feedback', { replace: true })}>Feedback</button>
//                                 </div>
//                                 <div className="">
//                                     <div className="user-info-avatar">
//                                         <img src={avatar} alt="avatar" width="35px" height="35px"/>
//                                         <input type="file" onChange={event => setNewAvatar(event.target.files[0])}/>
//                                         <button onClick={uploadAvatar}>Choose avatar</button>
//                                     </div>
                                    // <div className="friends">
                                    //     <p className="friends-title">Username: </p>
                                    //     <input type="text" onChange={event => setFriendName(event.target.value)}/>
                                    //     <div className="friends-buttons">
                                    //         <button onClick={getAllFriends}>Get</button>
                                    //         <button onClick={addFriend}>Add</button>
                                    //         <button>Find</button>
                                    //         <button>Delete</button>
                                    //     </div>
                                    //     <div className="friend-list">
                                    //         {allFriends.length !== 0 ?
                                    //             allFriends.map((friend, index) => {
                                    //                 return(
                                    //                     <div className="friend-list-item" key={index}>
                                    //                         <p>Name: {friend.name}</p>
                                    //                         <p>{friend.status}</p>
                                    //                     </div>
                                    //                 )
                                    //             })
                                    //             :
                                    //             friendsRequests.map((friend, index) => {
                                    //                 return(
                                    //                     <div className="friend-list-item" key={index}>
                                    //                         <p>Name: {friend.name}</p>
                                    //                         <button>Accept</button>
                                    //                     </div>
                                    //                 )
                                    //             })
                                    //         }
                                    //     </div>
                                    // </div>
//                                 </div>
//                             </div>
//                             <button onClick={LogOut} className="submit-logout">Log out</button><br />
//                             <div className="upload-file-form">
//                                 <input type="file" onChange={event => setFile(event.target.files[0])}/>
//                                 <button onClick={uploadFile}>Upload</button>
//                             </div>
//                             <div className="user-files">
//                                 <button onClick={getUserFiles}>Get Files</button>
//                                 {userFiles.length !== 0 ?
//                                     <div className="user-file-list">
//                                         {userFiles.map((file, index) => {
//                                             return(
//                                                 <div className="file-container" key={index}>
//                                                     <p className="file-name">{file.name.length > 30? fileNameHandler(file.name): file.name}</p>
//                                                     <button className="download-button" onClick={() => downloadFile(file.name)}>Download</button>
//                                                     <img src={regExForFileName.test(file.name)? file.publicUrl: iconForNonImageFile} alt="user-files" width="50px" height="50px"/>
//                                                     <button onClick={() => shareWith(file.publicUrl, file.name)}>Share with...</button>
//                                                     <button className="download-button" onClick={() => deleteFile(file.publicUrl)}>X</button>
//                                                 </div>
//                                             )
//                                         })}
//                                     </div>
//                                     :
//                                     <div className="user-file-list">
//                                         <p>At that moment you don`t have any files</p>
//                                     </div>
//                                 }
//                             </div>
//                         </div>
//                         :
//                         <div className="">
//                             <p>Log in please</p>
//                         </div>
//                     }
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Account;


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
    const [friendName, setFriendName] = useState('');
    const [friends, setFriends] = useState([]);
    const [friendsRequests, setFriendsRequests] = useState([]);
    const [allFriends, setAllFriends] = useState([]);

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


        const addFriend = async () => {
        try {
            const whereClause = `name = '${friendName}'`
            const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause)
            const friend = await Backendless.Data.of('Users').find(queryBuilder)
            const friendData = [...allFriends]
            friendData.push({
                "name": friend[0].name,
                "status": "holding",
                "friendId": friend[0].objectId
            })
            await Backendless.Data.of('Users').save({
                objectId: user.objectId,
                friends: friendData
            })
            alert('Friend was added')
            setFriendName('')
        } catch(err) {
            console.log(err)
        }
    }

    const getFriendsRequests = async () => {
        try {
            const whereClause = `friends->'$.friendId'='${user.objectId}'`
            const queryBuilder = Backendless.DataQueryBuilder.create()
            queryBuilder.addProperty(whereClause)
            const data = await Backendless.Data.of('Users').find(queryBuilder)
            setFriendsRequests(data)
            console.log(data)
            console.log(friendsRequests)
        } catch(err) {
            console.log(err)
        }
    }

    const getAllFriends = async () => {
        try {
            const friends = user.friends ? [...user.friends] : []
            setAllFriends(friends)
            // await getFriendsRequests()
        } catch(err) {
            console.log(err)
        }
    }


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
                                <div className="friends">
                                    <p className="friends-title">Username: </p>
                                    <input type="text" onChange={event => setFriendName(event.target.value)}/>
                                    <div className="friends-buttons">
                                        <button onClick={getAllFriends}>Get</button>
                                        <button onClick={addFriend}>Add</button>
                                        <button>Find</button>
                                        <button>Delete</button>
                                    </div>
                                    <div className="friend-list">
                                        {allFriends.length !== 0 ?
                                            allFriends.map((friend, index) => {
                                                return(
                                                    <div className="friend-list-item" key={index}>
                                                        <p>Name: {friend.name}</p>
                                                        <p>{friend.status}</p>
                                                    </div>
                                                )
                                            })
                                            :
                                            friendsRequests.map((friend, index) => {
                                                return(
                                                    <div className="friend-list-item" key={index}>
                                                        <p>Name: {friend.name}</p>
                                                        <button>Accept</button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
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
