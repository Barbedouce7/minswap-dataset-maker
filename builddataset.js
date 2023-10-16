import { BlockFrostAPI } from "@blockfrost/blockfrost-js";
import { BlockfrostAdapter, NetworkId } from "@minswap/sdk";
import * as path from 'path';
import { readFileSync, writeFileSync } from 'fs'

const dossier = 'datasets';

const api = new BlockfrostAdapter({
  blockFrost: new BlockFrostAPI({
    projectId: "<APIkey>",
    network: "mainnet",
  }),
});

const PoolId = {
    iusd: "8fde43a3f0b9f0e6f63bec7335e0b855c6b62a4dc51f1b762ccb6dfbbafcfe47",
    ibtc: "00cf5d6dd4ba7e5b5fac3e45b415a2f53a0c56cb64a5d4b54ce942670ac05b41",
    indy: "571cdbdfae07f098049b917007366cca8f2e0770a7b2bae5f7726f36849fbcb9",
    jpg: "f9d754bbb359e164ac964df47e84726b33117c59eb57e90f835ac6027af0f3f2",
    min: "6aa2153e1ae896a95539c9d62f76cedcdabdcdf144e564b8955f609d660cf6a2",
    shen: "53225313968e796f2c1e0b57540a13c3b81e06e2ed2637ac1ea9b9f4e27e3dc4",
    lq: "1b7f4abbf3eb04f8a7e5fbbc2042c524210dd960b6703a02fe52f70a7701e284",
    agix: "620719c204a0338059aad43b35332b9353216c719901c8ca9f726ae4ec313da5",
    djed: "d944eda9d4fd8c26171a4362539bfd4ccf35f5a4d0cc7525b22327b997a4f4b9",
    encs: "2324756b8e7e74da8feb879e2f053789363d045e554eaa17d365d1b52f4a9f8c",
    lenfi: "39b9b709ac8605fc82116a2efc308181ba297c11950f0f350001e28f0e50868b",
    snek: "63f2cbfa5bf8b68828839a2575c8c70f14a32f50ebbfa7c654043269793be896",
    meld: "2b475f94e3b324ab703fb65050ce08a37542b9cf7bda704417a966fc5c364664",
    iag: "bdfd144032f09ad980b8d205fef0737c2232b4e90a5d34cc814d0ef687052400",
    ieth: "c42ff277661b6475ae0bcf82e61efde8cea1eccec0c451648e39798e77630e66",
    sundae: "9725d4168d06e85cc6bec7ab0e9bdd2b0120d880bb148ab21336774706eecdc8",
    opt: "cf98e1003d53ed6e081f0a401efe6d854852de16996a72abae7e280a96a21fe8",
    cneta: "99ae755b404162f5aa299625ad5a513472d94218ba11e0b2cf2b5451851ede5a",
    wmt: "df88a770e300f248b776231b96da4525ce0f54bc457310efe27a03f2c14bb18f",
    milk: "db6e49ddbcb711376bfacc90727b145921e3bd5a529530cc3aa6dbea2d7d963c",
    copi: "7925263b1aff069a191db67d5ac185c029f7f43e084a4ef6e5fa2848a56e2aa6",
    ntx: "face3a0164da55d1627cd6af895a9a0cd4e4edc110632d407494644e3c924937",
    vyfi: "33e3fda999087a35e6d6eac62402bbf25bcf63ae421b417ee968c664d66e8026",
    gens: "4705d99a4cf6bce9181e60fdbbf961edf6acad7141ed69186c8a8883600e59c5",
    wrt: "99d2ce140231b787c30c52ace4148951f2b54d66c9d7ebf29f89f5fbf8f7757b",
    c3: "2cb05a0cec80aa158dcc9faddf9de6a20a2acec78fa4101e3d271df7947fbcc5",
    nmkr: "5aebbb6030552e9313c5b8cd2c3eb710efd519fdf6c1b8861a64791e4cb7390c",
    fact: "b4ba2b47edce71234f328fa20efdb25c3f96e348ca19a683193880489bb368db"
};


var maintenant = new Date();
const annee = maintenant.getFullYear();
const mois = String(maintenant.getMonth() + 1).padStart(2, '0'); 
const jour = String(maintenant.getDate()).padStart(2, '0');
const heure = String(maintenant.getHours() - 5).padStart(2, '0');
const minute = '00';
const seconde = '00';
maintenant = `${annee}/${mois}/${jour} ${heure}:${minute}:${seconde}`;
var stopdate = new Date(maintenant); // date à laquelle on passe à la pool suivante

for (const nom in PoolId) { // pour chaque pool
    if (PoolId.hasOwnProperty(nom)) {
        const MIN_POOL_ID = PoolId[nom];
        var nombre = 0;
        var pagenumber = 0;
        const nomFichier = 'ada-' + nom + ".csv";
        const cheminFichier = path.join(dossier, nomFichier);
        if (fs.existsSync(cheminFichier)) {
            const contenu = fs.readFileSync(cheminFichier, 'utf-8');
            const lignes = contenu.split('\n');
            nombre = lignes.length
            console.log(`Le fichier ${nomFichier} existe et contient ${lignes.length} lignes.`);
        } else {
            const contenuInitial = '';
            fs.writeFileSync(cheminFichier, contenuInitial, 'utf-8');
            console.log(`Le fichier ${nomFichier} a été créé`);
        }
        if (nombre > 99) {
             pagenumber = Math.floor(nombre / 100);
        }


	for (var i = pagenumber; i < 999999999; i++) {
            const history = await api.getPoolHistory({ id: MIN_POOL_ID, page: i, count: 100, order: "asc" });
            var dateToCheck = ""
	    for (const historyPoint of history) {
                const pool = await api.getPoolInTx({ txHash: historyPoint.txHash });
                if (!pool) {
                     throw new Error("pool not found");
                }
                const [price0, price1] = await api.getPoolPrice({
                    pool,
                    decimalsA: 6,
                    decimalsB: 6,
                });
                var date = new Date(historyPoint.time);
                var year = date.getFullYear();
                var month = (date.getMonth() + 1).toString().padStart(2, '0');
                var day = date.getDate().toString().padStart(2, '0');
                var hours = date.getHours().toString().padStart(2, '0');
                var minutes = date.getMinutes().toString().padStart(2, '0');
                var seconds = date.getSeconds().toString().padStart(2, '0');
                var newDateString = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
                var lineToAdd = `${newDateString}, ${price0}, ${price1}`;



                fs.readFile(cheminFichier, 'utf8', (err, data) => {
                    if (err) {
                        console.error('Une erreur s\'est produite lors de la lecture du fichier :', err);
                        return;
                    }
                    if (data.includes(lineToAdd)) {
                         console.log(`${nom} ${lineToAdd} ::: La ligne est déjà présente, on ne fait rien.`);
                    } else {
                        const updatedData = data + lineToAdd + '\n';
                        const writeStream = fs.createWriteStream(cheminFichier, { flags: 'a' });
                        writeStream.write(lineToAdd + '\n');
                        writeStream.end();
		                    writeStream.on('error', (err) => {
                                console.error('Une erreur s\'est produite lors de l\'ajout de la ligne au fichier :', err);
                        });
                        writeStream.on('finish', () => {
                                console.log(`${nom} ${lineToAdd} ::: La ligne a été ajoutée.`);
                        });
                    }
                }); 
            		dateToCheck = new Date(lineToAdd.split(",")[0]);
		            }
                if (dateToCheck > stopdate) {
			                  console.log("=============== On passe à la pool suivante");
                        break;
            		}
  }
} 
} 
