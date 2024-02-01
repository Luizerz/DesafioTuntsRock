const express = require("express")
const {google} = require("googleapis")

const app = express()
app.use(express.json())

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

app.get('/calcularSituacao', async (req, res) => {

    const {googleSheets, auth, spreadsheetId} = await getAuthSheets()
    const getRows = await googleSheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: 'engenharia_de_software!A3:H100'
    })
    const values = calcularSituacao(getRows.data.values)
    const updateValue = await googleSheets.spreadsheets.values.update({
        spreadsheetId,
        range: "engenharia_de_software!G4:H100",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: values
        }
    })

    res.send(updateValue)
})

app.get('/reset', async (req, res) => {
    
    const {googleSheets, auth, spreadsheetId} = await getAuthSheets()
    let array = new Array(30).fill(Array(2).fill("",""));
    const updateValue = await googleSheets.spreadsheets.values.update({
        spreadsheetId,
        range: "engenharia_de_software!G4:H100",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: array
        }
    })

    res.send(updateValue)
})

function calcularSituacao(matrix) {
    let auxArr = []
    for (let index = 0; index < matrix.length; index++) {
       if (index != 0 ) {
        const media = calcularMedia(matrix[index])
        const reprovouPorFalta = calcularFaltas(matrix[index][2])
        if (reprovouPorFalta) {
           auxArr.push(['Reprovado por Falta', 0])
        } else if (media < 50) {
            auxArr.push(['Reprovado por Nota', 0])
        } else if (media >= 50 && media < 70) {
            const notaNecessaria = calcularAF(media)
            auxArr.push(['Exame Final', notaNecessaria])
        } else {
            auxArr.push(['Aprovado', 0])
        }
       }
    }
    return auxArr
}

function calcularFaltas(faltas) {
    const numeroDeAulas = 60
    if ((Number(faltas)/numeroDeAulas * 100) > 25) {
        return true
    } else  {
        return false
    }
}

function calcularMedia(arr) {
    return Math.ceil((Number(arr[3]) + Number(arr[4]) + Number(arr[5]))/3)
} 

function calcularAF(media) {
    return Math.ceil(100 - Number(media))
}

app.listen(process.env.PORT || 3000, () => console.log('Aplication now is running'))