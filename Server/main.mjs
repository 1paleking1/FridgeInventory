import express from 'express'
import { Expo } from 'expo-server-sdk'
import * as schedule from 'node-schedule';



// firestore import
import db from './firebaseConfig.mjs'
import { collection, setDoc, deleteDoc, doc, getDoc, updateDoc, getDocs, where, query } from "firebase/firestore";
    

const app = express()
const port = 3000

const expo = new Expo()

// const jsonParser = BodyParser.json()
// const httpParser = BodyParser.urlencoded({ extended: false })

app.use(express.json())



// initial test Notification

// expo.sendPushNotificationsAsync([{
//     to: 'ExponentPushToken[1HtfjOLJ5Sn0tD-w6SKX6d]',
//     sound: 'default',
//     title: 'Fridge Inventory',
//     body: "It's been a week since you added milk to your fridge.",
// }])


const getPushTokens = async(fridge_id) => { 

    const fridgeRef = collection(db, "users")

    const q = query(fridgeRef, where("fridge_id", "==", fridge_id))
    const querySnapshot = await getDocs(q)
    const docs = querySnapshot.docs

    let push_tokens = []
    for (const doc of docs) {
        push_tokens = push_tokens.concat(doc.data().devices)
    }

    return push_tokens
    
}

const getUsername = (email) => {

    return email.split('@')[0]

}

const getNotificationDate = (days_to_wait) => {

    return new Date(2024, 7, 8, 18, 14, 0);
    
    const date = new Date()
    date.setDate(date.getDate() + days_to_wait)
    return date
    
}

const handleSendNotification = async (admin, fridge_id, product_name, product_type) => {

    const username = getUsername(admin)
    const message = `It's been a week since ${product_name} was added to ${username}'s fridge.`

    const push_tokens = await getPushTokens(fridge_id)

    for (let i = 0; i < push_tokens.length; i++) {
            
            expo.sendPushNotificationsAsync([{
                to: push_tokens[i],
                sound: 'default',
                title: 'Fridge Inventory',
                body: message,
            }])
        
        }

}






app.post('/sendNotification', async (req, res) => {

    const { admin, fridge_id, product_name, product_type } = req.body


    const job = schedule.scheduleJob(getNotificationDate(7), async () => {
    
        handleSendNotification(admin, fridge_id, product_name, product_type)
    
    })
    
    res.send('Notification sent').status(200)

})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})




// app.post('/sendNotification', async (req, res) => {

//     const { admin, fridge_id, product_name, product_type } = req.body

//     const username = getUsername(admin)

//     const message = `It's been a week since ${product_name} was added to ${username}'s fridge.`

//     const push_tokens = await getPushTokens(fridge_id)

//     await console.log("push tokens obtained: ", push_tokens)

//     for (let i = 0; i < push_tokens.length; i++) {

//         await expo.sendPushNotificationsAsync([{
//             to: push_tokens[i],
//             sound: 'default',
//             title: 'Fridge Inventory',
//             body: message,
//         }])
    
//     }

//     res.send('Notification sent').status(200)

// })