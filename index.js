const express = require("express")
const {google} = require("googleapis")

const app = express()

async function getAuthSheets() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    const client = await auth.getClient()
    const googleSheets = google.sheets({
        version: "v4",
        auth: client
    })
    
    const spreadsheetId = "1duP0zwvvG-nx5Qnod4_9vgbp9X6RvR42EQiR1zdr3Mg"
    return {
        auth,
        client,
        googleSheets,
        spreadsheetId
    }
}

app.get("/metadata", async (req, res) => {
    const {googleSheets, auth, spreadsheetId} = await getAuthSheets()

    const metadata = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    })

    res.send(metadata.data)
})

app.listen(3000, () => console.log('running on port 3000'))