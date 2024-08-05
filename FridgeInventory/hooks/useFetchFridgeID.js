import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig.js';
import { doc, onSnapshot } from "firebase/firestore";

const useFetchFridgeID = (user) => {
    const [fridgeID, setFridgeID] = useState(null);

    useEffect(() => {
        let unsubscribe;
        
        if (user) {
            const docRef = doc(db, "users", user.uid.toString());
            
            unsubscribe = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    setFridgeID(docSnap.data().fridge_id);
                    // console.log("Fridge ID updated:", docSnap.data().fridge_id);
                } else {
                    setFridgeID(null);
                    // console.log("Document does not exist. Setting fridgeID to null.");
                }
            }, (error) => {
                console.error("Error fetching Fridge ID:", error);
            });
        } else {
            console.log("No user");
        }

        // Cleanup subscription on unmount or user change
        return () => {
            if (unsubscribe) {
                unsubscribe();
                // console.log("Unsubscribed from Firestore listener.");
            }
        };
    }, [user]);


    console.log("fridge id is now finally set to: " + fridgeID);
    return fridgeID;
}

export default useFetchFridgeID;