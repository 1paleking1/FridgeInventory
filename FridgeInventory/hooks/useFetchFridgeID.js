// boilereplate
import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig.js';
import { doc, getDoc } from "firebase/firestore";

const useFetchFridgeID = (user) => {
    
    const [fridgeID, setFridgeID] = useState(null);

    useEffect(() => {

        const fetchFridgeID = async () => {

            let docRef = doc(db, "users", user.uid);
            let docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                await setFridgeID(docSnap.data().fridge_id);
            } else {
                await setFridgeID(null);
            }
        }

        fetchFridgeID();

    }, [user]);


    return fridgeID;

}

export default useFetchFridgeID;