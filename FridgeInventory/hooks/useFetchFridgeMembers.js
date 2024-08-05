import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig.js';
import { doc, onSnapshot } from "firebase/firestore";

const useFetchFridgeMembers = (fridge_id) => {

    const [fridgeMemberEmails, setFridgeMemberEmails] = useState([]);
    const [fridgeMembersUIDs, setFridgeMembersUIDs] = useState([]);

    useEffect(() => {

        const docRef = doc(db, "fridges", fridge_id);

        const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                setFridgeMemberEmails(doc.data().users);
            } else {
                console.log("No such document (in useFetchFridgeMembers)!");
            }
        });

        return () => unsubscribe();
    }, [fridge_id]);


    useEffect(() => {
        let uids = [];

        for (let i = 0; i < fridgeMemberEmails.length; i++) {
            const docRef = doc(db, "users", fridgeMemberEmails[i]);
            const docSnap = onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    uids.push(doc.id);
                } else {
                    console.log("No such document!");
                }
            });
        }

        setFridgeMembersUIDs(uids);

    }, [fridgeMemberEmails]);


    return { fridgeMemberEmails, fridgeMembersUIDs };

}

export default useFetchFridgeMembers;