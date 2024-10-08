import React from 'react';
import { View } from 'react-native';
import { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, getDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';

// hooks
import useFetchAdmin from '../hooks/useFetchAdmin';

// components
import ManagementModal from './ManagementModal';

export default function ManageFridgeModal(props) {

    const [fridgeUsers, setFridgeUsers] = useState([]);
    const adminEmail = useFetchAdmin(props.fridgeID);

    const currentUserIsAdmin = () => {
        return adminEmail == auth.currentUser.email;
    }

    const deleteMemberInDatabase = async (emailToDelete, uidToDelete) => {

        // remove from fridge users array
        docRef = doc(db, "fridges", props.fridgeID);
        await updateDoc(docRef, {
            users: fridgeUsers.filter(user => user != emailToDelete)
        });

        // revert fridge_id in user document to their uid ad reactive their fridge
        docRef = doc(db, "users", uidToDelete);
        await updateDoc(docRef, {
            fridge_id: uidToDelete
        });

        // reactivate fridge
        docRef = doc(db, "fridges", uidToDelete);
        await updateDoc(docRef, {
            is_active: true
        });

    }

    const getUIDFromEmail = async (email) => {
    
        const colRef = collection(db, "users");

        const q = query(colRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        const doc = querySnapshot.docs[0];

        return doc.id;


    }

    const handleMemberDelete = async (email) => {

        if (currentUserIsAdmin() ^ email == auth.currentUser.email) {
            
            uid = await getUIDFromEmail(email);

            deleteMemberInDatabase(email, uid);

            // remove from local state
            setFridgeUsers(fridgeUsers.filter(user => user != email));

            return true
            
        } else if (currentUserIsAdmin() && email == auth.currentUser.email) {
            alert("You can't delete yourself as you are the admin");
            return false;

        } else {
            alert(`Only the admin (${adminEmail}) can delete other users`);
            return false
        }
    }

    const loadData = async () => {
        
        const docRef = doc(db, "fridges", props.fridgeID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setFridgeUsers(docSnap.data().users);
        }

    }

    useEffect(() => {

        loadData();

    }, [props.manageModalVisible]);


    return (

        <View>
            <ManagementModal
                data={fridgeUsers}
                dataType={"Emails"}
                manageModalVisible={props.manageModalVisible}
                setManageModalVisible={props.setManageModalVisible}
                handleMemberDelete={handleMemberDelete}
                currentUserIsAdmin={currentUserIsAdmin}
                adminEmail={adminEmail}
            />
        </View>
    );
}

