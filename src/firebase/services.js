import { addDoc, collection, serverTimestamp, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { fireStore, storage } from "./config";

export const addDocument = async (collectionName, data) => {
    try {
        await addDoc(collection(fireStore, collectionName), {
            ...data,
            createAt: serverTimestamp(),
        });
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

export const updateContent = async (documentId, newContent) => {
    const docRef = doc(fireStore, "blogs", documentId);

    try {
        await updateDoc(docRef, {
            "post.content": newContent,
        });
        console.log("Content updated successfully!");
    } catch (error) {
        console.error("Error updating content: ", error);
    }
};

export const handleReact = async (documentId, userInformation, comment = "") => {
    const docRef = doc(fireStore, "blogs", documentId);

    try {
        const docSnap = await getDoc(docRef);
        const postDataReaction = docSnap.data().post.reaction;

        if (postDataReaction.comments) {
            const updatedComments = [...postDataReaction.comments];

            const commentIndex = postDataReaction.comments.findIndex((comment) => comment.uid === userInformation.uid);
            if (commentIndex !== -1) {
                updatedComments[commentIndex].liked = !updatedComments[commentIndex].liked;
                const updatedReaction = {
                    comments: updatedComments,
                    liked: calculateTotalLiked(postDataReaction.comments),
                };
                await updateDoc(docRef, {
                    "post.reaction": updatedReaction,
                });
            } else {
                updatedComments.push({
                    displayName: userInformation.displayName,
                    uid: userInformation.uid,
                    photoURL: userInformation.photoURL,
                    comment: "",
                    liked: true,
                });
                const updatedReaction = {
                    comments: updatedComments,
                    liked: calculateTotalLiked(updatedComments),
                };
                await updateDoc(docRef, {
                    "post.reaction": updatedReaction,
                });
            }
        }
    } catch (error) {
        console.error("Error updating liked field: ", error);
    }
};

// Hàm tính tổng số liked từ mảng comments
const calculateTotalLiked = (comments) => {
    return comments.filter((comment) => comment.liked).length;
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
