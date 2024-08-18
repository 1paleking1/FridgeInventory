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
                } else {
                    setFridgeID(null);
                }
            }, (error) => {
                console.error("Error fetching Fridge ID:", error);
            });
        }

        // Cleanup subscription on unmount or user change
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user]);

    return fridgeID;
}

export default useFetchFridgeID;