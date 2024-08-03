// boilereplate
import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig.js';
import { doc, getDoc } from "firebase/firestore";

const useFetchFridgeID = (user) => {
    
        const [fridgeID, setFridgeID] = useState(null);
    
        useEffect(() => {
    
            const fetchFridgeID = async() => {

                console.log("Fetching Fridge ID in custom hook");
    
                if (user) {
                    let docRef = doc(db, "users", user.uid.toString());
                    let docSnap = await getDoc(docRef); 

                    console.log("uid: " + user.uid.toString());
    
                    if (docSnap.exists()) {
                        setFridgeID(docSnap.data().fridge_id);
                    } else {
                        console.log("setting fridgeID to null");
                        setFridgeID(null);
                    }
                } else {
                    console.log("no user")
                }
    
            }
    
            fetchFridgeID();
    
        }, [user]);
    
        return fridgeID;
    
    }

export default useFetchFridgeID;