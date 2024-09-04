import { doc, setDoc } from "firebase/firestore";
import { db } from '../firebaseConfig.js';
import axios from 'axios';

const dangerMessage = (message, ref) => {

    ref.current.showMessage({
        message: message,
        type: "danger",
        icon: "auto",
        duration: 2000
    });

}

const successMessage = (message, ref) => {

    ref.current.showMessage({
        message: message,
        type: "success",
        icon: "auto",
        duration: 2000
    });
}

const infoMessage = (message, ref) => {
    
    ref.current.showMessage({
        message: message,
        type: "info",
        icon: "auto",
        duration: 2000
    });
}

const getErrorFlashMessage = (error_code, ref) => {

    if (error_code === 'auth/weak-password') {
        dangerMessage('The password is too weak.', ref);
    } else if (error_code === 'auth/email-already-in-use') {
        dangerMessage('The email is already in use.', ref);
    } else if (error_code === 'auth/invalid-credential') {
        dangerMessage("Invalid email or password. Please try again.", ref);
    } else if (error_code === 'auth/too-many-requests') {
        dangerMessage("Too many login attempts. Please try again later.", ref);
    } else if (error_code === 'auth/invalid-email') {
        dangerMessage("Not a valid email", ref);    
    } else if (error_code === 'auth/missing-password') {
        dangerMessage("Must provide a password", ref);
    }
}


const getTodayDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    return today;
}


const addProducttoDB = async(product_id, fridge_id, product_name, food_group, admin, jwt) => {

    try {

        docRef = doc(db, "fridges", fridge_id, "inventory", food_group, "items", product_id.toString());

        await setDoc(docRef, {
            name: product_name,
            date_scanned: getTodayDate()
        });

    } catch (e) {
        console.error("Error adding document: ", e);
    }

    // call backend function to schedule notification
    await axios.post("https://fridgeinventoryapi.onrender.com/scheduleNotification", 
        {
            fridge_id: fridge_id,
            admin: admin,
            product_name: product_name,
            product_type: food_group,
            product_id: product_id
        },
        {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }
    );

}



module.exports = {
    getTodayDate,
    dangerMessage,
    successMessage,
    infoMessage,
    getErrorFlashMessage,
    addProducttoDB
}