import * as StellarSdk from "stellar-sdk";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "../firebase";

const server = "https://horizon-testnet.stellar.org";

export async function tokenizeCapTable(founders: any[]) {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");

  const db = getFirestore();
  const userDoc = await getDoc(doc(db, "users", user.uid));
  const userData = userDoc.data();

  if (!userData?.secretKey) throw new Error("No wallet found");

  const sourceKeypair = StellarSdk.Keypair.fromSecret(userData.secretKey);
  const account = await server.loadAccount(sourceKeypair.publicKey());

  const txBuilder = new StellarSdk.TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: StellarSdk.Networks.TESTNET
  });

  for (const founder of founders) {
    if (founder.tokenized === "Yes") continue;

    const assetCode = `${founder.name.split(" ")[0].toUpperCase()}_EQ`;
    const equityAsset = new StellarSdk.Asset(assetCode, sourceKeypair.publicKey());

    txBuilder.addOperation(
      StellarSdk.Operation.changeTrust({
        asset: equityAsset,
        limit: "1000"
      })
    );

    txBuilder.addOperation(
      StellarSdk.Operation.payment({
        destination: sourceKeypair.publicKey(),
        asset: equityAsset,
        amount: "1"
      })
    );
  }

  const transaction = txBuilder.setTimeout(60).build();
  transaction.sign(sourceKeypair);

  await server.submitTransaction(transaction);

  return founders.map((f) => ({ ...f, tokenized: "Yes" }));
}
