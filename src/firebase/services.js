import { addDoc, collection, serverTimestamp, deleteDoc, doc, updateDoc, getDoc, getDocs, onSnapshot, setDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { fireStore, storage, auth } from "./config";
import { updateProfile } from "firebase/auth";

export const snapshotSubColection = (collectionName, docId, subcollectionName, callback) => {
    const docRef = doc(fireStore, collectionName, docId);
    const subcollectionRef = collection(docRef, subcollectionName);

    return onSnapshot(subcollectionRef, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(data);
    });
};

export const snapshotCollection = (collectionName, docId, callback) => {
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

        return docRef.id;
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

        return docRef.id;
    } catch (error) {
        console.error("Error add document:", error);
    }
};
// export const deleteDocument = async (collectionName, documentID, pathImage) => {
//     try {
//         const response = await fetch("/api/deleteDocument", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 collectionName,
//                 documentID,
//                 pathImage,
//             }),
//         });

//         const data = await response.json();
//         if (response.ok) {
//             return true;
//         } else {
//             return false;
//         }
//     } catch (error) {
//         console.error("Unexpected error:", error);
//     }
// };
const deleteSubcollections = async (fireStore, documentRef) => {
    const subcollectionsSnapshot = await getDocs(collection(documentRef, "comments")); // thay 'subcollectionName' bằng tên subcollection của mày
    const promises = subcollectionsSnapshot.docs.map((subDoc) => deleteDoc(subDoc.ref));
    await Promise.all(promises);
};
const restoreDocument = async (collectionName, documentID, data) => {
    const documentRef = doc(fireStore, collectionName, documentID);
    try {
        await setDoc(documentRef, data);
    } catch (error) {
        console.error("Error restoring document:", error);
    }
};
export const deleteDocument = async (collectionName, documentID, pathImage) => {
    const documentRef = doc(fireStore, collectionName, documentID);
    let data = null; // Dữ liệu của tài liệu

    let errorOccurred = false; // Biến cờ để theo dõi lỗi

    // Lấy dữ liệu tài liệu trước khi xóa
    try {
        const docSnapshot = await getDoc(documentRef);
        if (docSnapshot.exists()) {
            data = docSnapshot.data();
        } else {
            console.error("Document does not exist.");
            return false;
        }
    } catch (error) {
        console.error("Error getting document data:", error);
        return false;
    }

    try {
        // Xóa tất cả các subcollections
        await deleteSubcollections(fireStore, documentRef);
    } catch (error) {
        console.error("Error deleting subcollections:", error);
        errorOccurred = true;
    }

    if (!errorOccurred) {
        try {
            // Xóa document chính
            await deleteDoc(documentRef);
        } catch (error) {
            console.error("Error deleting document:", error);
            errorOccurred = true;
        }
    }

    if (pathImage && !errorOccurred) {
        const desertRef = ref(storage, pathImage);
        try {
            // Xóa ảnh nếu có
            await deleteObject(desertRef);
        } catch (error) {
            console.error("Error deleting image:", error);
            errorOccurred = true;
        }
    }

    if (errorOccurred) {
        // Nếu có lỗi xảy ra, khôi phục tài liệu đã xóa
        console.log("Errors occurred during the deletion process. Restoring document.");
        await restoreDocument(collectionName, documentID, data);
        return false; // Trả về false nếu có lỗi
    } else {
        console.log("Document and related data deleted successfully.");
        return true; // Trả về true nếu mọi thứ thành công
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

        const blogSnap = await getDoc(blogRef);

        if (!blogSnap.exists()) {
            throw new Error("Blog does not exist");
        }

        const blogData = blogSnap.data();
        let updatedLiked = [];

        if (blogData.liked && Array.isArray(blogData.liked)) {
            updatedLiked = [...blogData.liked];

            if (like && !updatedLiked.includes(uid)) {
                updatedLiked.push(uid);
            } else if (!like && updatedLiked.includes(uid)) {
                updatedLiked = updatedLiked.filter((id) => id !== uid);
            }
        } else {
            if (like) {
                updatedLiked.push(uid);
            }
        }

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
