import {
  Server,
  TransactionBuilder,
  Networks,
  Operation,
  Address,
  scValToNative,
} from "soroban-client";

const contractId = import.meta.env.VITE_CONTRACT_ID!;
const server = new Server("https://soroban-testnet.stellar.org", { allowHttp: true });

export async function getFounder(publicKey: string) {
  try {
    const account = await server.getAccount(publicKey);

    const tx = new TransactionBuilder(account, {
      fee: "100",
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.invokeContractFunction({
          contract: contractId,
          function: "get_founder",
          args: [new Address(publicKey).toScVal()],
        })
      )
      .setTimeout(30)
      .build();

    const simResult = await server.simulateTransaction(tx);

    if ("error" in simResult) {
      console.error("Simulation error:", simResult.error);
      return { tokenized: false };
    }

    const raw = simResult.result?.retval;
    if (!raw) return { tokenized: false };

    // Try to parse the result, assume if raw is valid founder info, founder is tokenized
    const founderData = scValToNative(raw);
    if (founderData) {
      return { tokenized: true };
    } else {
      return { tokenized: false };
    }
  } catch (error) {
    console.error("Error in getFounder:", error);
    return { tokenized: false };
  }
}





// import {
//   Server,
//   TransactionBuilder,
//   Networks,
//   Operation,
//   Address,
// } from 'soroban-client';

// const contractId = import.meta.env.VITE_CONTRACT_ID!;
// const rpcUrl = 'https://soroban-testnet.stellar.org';
// const server = new Server(rpcUrl, { allowHttp: true });

// export async function getFounder(publicKey: string) {
//   try {
//     const account = await server.getAccount(publicKey);
//     const founderAddress = new Address(publicKey);

//     const tx = new TransactionBuilder(account, {
//       fee: '100',
//       networkPassphrase: Networks.TESTNET,
//     })
//       .addOperation(
//         Operation.invokeContractFunction({
//           contract: contractId, 
//           function: 'get_founder',
//           args: [founderAddress.toScVal()],
//         })
//       )
//       .setTimeout(30)
//       .build();

//     const simResult = await server.simulateTransaction(tx);

//     if ('result' in simResult) {
//       const returnVal = simResult.result.retval;
//       console.log("Simulated getFounder return:", returnVal);

//       return {
//         tokenized: !!returnVal
//       };
//     } else {
//       console.error("Simulation error:", simResult);
//       return { tokenized: false };
//     }
//   } catch (error) {
//     console.error("Error simulating getFounder:", error);
//     return { tokenized: false };
//   }
// }

