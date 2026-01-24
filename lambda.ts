import serverless from "serverless-http"
import { app } from "./app.js"
import sequelize from './util/database.js'

// credo l'adattatore
// avoolgo la mia app express dentro una funziona compatibile con il formato lambda

const serverlessHandler = serverless(app, {
    binary: ['audio/mpeg', 'audio/mp3', 'application/octet-stream']
})


//event contiene i dati della richiesta
// context contiene informazioni sull'esecuzione
export const handler = async (event: any, context: any) => {
    context.callbackWaitsForEmptyEventLoop = false
    // dico ad AWS di chiudere la connessione appena viene invata la risposta JSON
    // e non aspettare che il database chiusa la connessione
    try {
        await sequelize.authenticate()
        // prima di far processare la richiesta ad express,
        // verifichiamo che il database risponda.
    } catch (err) {
        console.log('Database connection error: ', err)
    }
    return await serverlessHandler(event, context)
    // passiamo l'evento ad Express. Express elabora la rotta 
    // (es. /auth/login), sequelize recupera i dati, e il risultato viene resituito ad AWS
    // che lo invia al browser del client
    /*
    Traduzione in Ingresso (Mapping): serverlessHandler prende l'oggetto event di AWS (il JSON) e crea degli oggetti "finti" che somigliano esattamente a req (Request) e res (Response) di Node.js.

    Iniezione in Express: Inietta questi oggetti finti nella tua app Express (app). A quel punto, Express "pensa" di essere su un server normale. Legge /auth/login, vede il body, e fa partire le tue rotte.

    Elaborazione: Il tuo codice gira. Sequelize interroga TiDB, Stripe valida il pagamento, ecc. Express scrive la risposta dentro l'oggetto res finto (es. res.status(200).json(...)).

    Traduzione in Uscita (Packaging): Una volta che Express ha finito, serverless-http intercetta quella risposta e la trasforma di nuovo in un oggetto JSON compatibile con AWS Lambda.

    Risposta ad AWS: La Lambda restituisce quel JSON ad AWS, che finalmente lo invia al browser del tuo utente come una normale risposta HTTP.
    */
}