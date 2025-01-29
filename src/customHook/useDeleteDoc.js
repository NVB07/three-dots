import Cookies from "js-cookie";
const useDeleteDoc = () => {
    const deleteDocument = async (collectionName, documentID, pathImage) => {
        try {
            const token = Cookies.get("token");
            const response = await fetch("/api/deleteDocument", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    collectionName,
                    documentID,
                    pathImage,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    };

    return { deleteDocument };
};

export default useDeleteDoc;
