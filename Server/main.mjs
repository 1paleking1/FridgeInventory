import express from 'express'
import { Expo } from 'expo-server-sdk'
import * as schedule from 'node-schedule'
import cors from 'cors'
import db from './firebaseConfig.mjs'
import { collection, getDocs, query, where } from "firebase/firestore"

const app = express()
const port = 3000
const expo = new Expo()

app.use(express.json())
app.use(cors())

const getPushTokens = async (fridge_id) => {
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
    const date = new Date()
    date.setSeconds(date.getSeconds() + 10) // temporary test code
    return date
}

const handleSendNotification = async (admin, fridge_id, product_name, product_type) => {
    const username = getUsername(admin)
    const message = `It's been a week since ${product_name} was added to ${username}'s fridge.`
    const push_tokens = await getPushTokens(fridge_id)

    const messages = push_tokens.map(token => ({
        to: token,
        sound: 'default',
        title: 'Fridge Inventory',
        body: message,
    }))

    try {
        const ticketChunk = await expo.sendPushNotificationsAsync(messages)
        console.log('Tickets:', ticketChunk)

        const receiptIds = ticketChunk
            .filter(ticket => ticket.id)
            .map(ticket => ticket.id)
        
        const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds)
        for (const chunk of receiptIdChunks) {
            try {
                const receipts = await expo.getPushNotificationReceiptsAsync(chunk)
                console.log('Receipts:', receipts)
            } catch (error) {
                console.error('Error fetching receipts:', error)
            }
        }
    } catch (error) {
        console.error('Error sending notifications:', error)
    }
}

app.post('/scheduleNotification', async (req, res) => {
    const { admin, fridge_id, product_name, product_type } = req.body
    const job_name = `${fridge_id}_${product_name}`

    schedule.scheduleJob(job_name, getNotificationDate(7), async () => {
        handleSendNotification(admin, fridge_id, product_name, product_type)
    })

    res.status(200).send('Notification scheduled')
})

app.post('/cancelNotification', async (req, res) => {
    const { job_name } = req.body
    const job_to_cancel = schedule.scheduledJobs[job_name]

    if (job_to_cancel) {
        job_to_cancel.cancel()
        res.status(200).send('Notification cancelled')
    } else {
        res.status(404).send('Job not found')
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})