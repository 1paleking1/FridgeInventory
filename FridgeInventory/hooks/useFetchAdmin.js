import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig.js';
import { doc, onSnapshot } from "firebase/firestore";

const useFetchAdmin = (fridge_id) => {
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const docRef = doc(db, "users", fridge_id);
        const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                setAdmin(doc.data().email);
            } else {
                console.log("No such document!");
            }
        });
        return () => unsubscribe();
    }, [fridge_id]);

    return admin;
}

export default useFetchAdmin;