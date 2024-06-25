import { addDoc, collection, serverTimestamp, deleteDoc, doc, updateDoc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { fireStore, storage, auth } from "./config";
import { updateProfile } from "firebase/auth";

export const snapshotDocument = (collectionName, docId, subcollectionName, callback) => {
    const docRef = doc(fireStore, collectionName, docId);
    const subcollectionRef = collection(docRef, subcollectionName);

    return onSnapshot(subcollectionRef, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(data);
    });
};

export const snapshotDoc = (collectionName, docId, callback) => {
    const unsub = onSnapshot(doc(fireStore, collectionName, docId), (doc) => {
        const data = doc.data();
        callback(data);
    });
    return unsub;
};

export const addUser = async (collectionName, documentId, data) => {
    try {
        const docRef = doc(fireStore, collectionName, documentId);

        await setDoc(docRef, {
            ...data,

            createAt: serverTimestamp(),
        });

        console.log(`Document added with ID: ${documentId}`);
    } catch (error) {
        console.error("Error adding document:", error);
    }
};

export const addDocument = async (collectionName, data) => {
    try {
        const docRef = await addDoc(collection(fireStore, collectionName), {
            ...data,
            createAt: serverTimestamp(),
        });

        return docRef.id; // Trả về documentID để sử dụng nếu cần
    } catch (error) {
        console.error("Error add document:", error);
    }
};
export const addSubDocument = async (collectionName, documentID, subcolection, data) => {
    try {
        const docRef = await addDoc(collection(fireStore, collectionName, documentID, subcolection), {
            ...data,
            sendTime: serverTimestamp(),
        });

        return docRef.id; // Trả về documentID để sử dụng nếu cần
    } catch (error) {
        console.error("Error add document:", error);
    }
};
export const deleteDocument = async (collectionName, documentID, pathImage) => {
    try {
        await deleteDoc(doc(fireStore, collectionName, documentID));
        if (pathImage) {
            const desertRef = ref(storage, pathImage);
            deleteObject(desertRef)
                .then(() => {})
                .catch((error) => {
                    console.error("Error delete img:", error);
                });
        }
    } catch (error) {
        console.error("Error delete document:", error);
    }
};

export const deleteSubDocument = async (collectionName, documentID, subcolection, subDocumentID) => {
    try {
        await deleteDoc(doc(fireStore, collectionName, documentID, subcolection, subDocumentID));
    } catch (error) {
        console.error("Error delete document:", error);
    }
};

export const updateContent = async (documentId, newContent, newSearchKeywords) => {
    const docRef = doc(fireStore, "blogs", documentId);

    try {
        await updateDoc(docRef, {
            "post.content": newContent,
            "post.searchKeywords": newSearchKeywords,
        });
        console.log("Content updated successfully!");
    } catch (error) {
        console.error("Error updating content: ", error);
    }
};

export const addFileToStorage = async (file64, folder, fileName) => {
    const uniqueFileName = fileName + "_" + Date.now();
    const storageRef = ref(storage, folder + uniqueFileName);
    let url = null;
    await uploadString(storageRef, file64, "data_url")
        .then(async (snapshot) => {
            url = await getDownloadURL(storageRef);
            return url;
        })
        .then((url) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = (event) => {
                const blob = xhr.response;
            };

            xhr.open("GET", url);
            xhr.send();
            return url;
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    return url;
};

export const handleLikeReact = async (uid, blogId, like) => {
    try {
        const blogRef = doc(fireStore, "blogs", blogId);

        // Lấy dữ liệu của bài viết
        const blogSnap = await getDoc(blogRef);

        if (!blogSnap.exists()) {
            throw new Error("Blog does not exist");
        }

        const blogData = blogSnap.data();
        let updatedLiked = [];

        // Kiểm tra xem UID của người dùng đã có trong mảng liked chưa
        if (blogData.liked && Array.isArray(blogData.liked)) {
            updatedLiked = [...blogData.liked]; // Sao chép mảng để không ảnh hưởng đến dữ liệu gốc

            if (like && !updatedLiked.includes(uid)) {
                updatedLiked.push(uid); // Thêm UID vào mảng nếu like và UID chưa tồn tại
            } else if (!like && updatedLiked.includes(uid)) {
                updatedLiked = updatedLiked.filter((id) => id !== uid); // Xóa UID khỏi mảng nếu unlike và UID tồn tại
            }
        } else {
            if (like) {
                updatedLiked.push(uid); // Tạo mảng mới và thêm UID vào nếu mảng liked chưa tồn tại và là lần like đầu tiên
            }
        }

        // Cập nhật trường liked của bài viết
        await updateDoc(blogRef, { liked: updatedLiked });
        return updatedLiked.length;
    } catch (error) {
        console.error("Error handling like/unlike post:", error);
    }
};
export const getUser = async (uid, option = null) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/user?uid=${uid}`, option);
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error fetching user data:", error);
        return null;
    }
};
export const updateUserProfile = async (displayName, photo) => {
    let dataUpdated = {};
    if (photo) {
        const url = await addFileToStorage(photo.reader?.result, "imagePostBlogs/", photo.name);
        dataUpdated = {
            displayName: displayName,
            photoURL: url,
        };
    } else dataUpdated = { displayName: displayName };

    const basicProfile = updateProfile(auth.currentUser, dataUpdated)
        .then(() => {
            return true;
        })
        .catch((error) => {
            console.error("Error update basic information :", error);
            return false;
        });
    // const updateEmailAddress = updateEmail(auth.currentUser, Email)
    //     .then(() => {
    //         return true;
    //     })
    //     .catch((error) => {
    //         console.error("Error update basic information :", error);
    //         return false;
    //     });
    if (basicProfile) {
        return true;
    }
};
export const updateInformation = async (documentId, name, email, newPhoto, currentPhotoURL) => {
    try {
        const docRef = doc(fireStore, "users", documentId);
        let dataUpdated = {};
        if (newPhoto) {
            const pathImage = getPathImage(currentPhotoURL);
            if (pathImage.includes("photoUsers/")) deleteObject(ref(storage, pathImage));
            const url = await addFileToStorage(newPhoto.reader?.result, "photoUsers/", newPhoto.name);
            dataUpdated = {
                displayName: name,
                email: email,
                photoURL: url,
                uid: documentId,
            };
        } else {
            dataUpdated = {
                displayName: name,
                email: email,
                photoURL: currentPhotoURL,
                uid: documentId,
            };
        }

        await updateDoc(docRef, dataUpdated);

        console.log("Content updated successfully!");
        return dataUpdated;
    } catch (error) {
        console.error("Error updating content: ", error);
    }
};

const getPathImage = (photoURL) => {
    const startIndex = photoURL.lastIndexOf("/") + 1;
    const endIndex = photoURL.indexOf("?alt=");
    const encodedImagePath = photoURL.substring(startIndex, endIndex);
    return decodeURIComponent(encodedImagePath);
};

export const getDocument = async (collectionName, docId) => {
    try {
        const docRef = doc(fireStore, collectionName, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};
