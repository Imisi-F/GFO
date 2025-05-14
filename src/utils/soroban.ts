
// import { Server, TransactionBuilder, Networks, xdr, Operation, Address } from 'soroban-client';

// // Setup
// const contractId = import.meta.env.VITE_CONTRACT_ID;
// const rpcUrl = 'https://soroban-testnet.stellar.org';
// const server = new Server(rpcUrl, { allowHttp: true });

// // Example: Get founder info
// export async function getFounder(sourceAccount, address) {
//   const contractAddress = new Address(address).toScVal();

//   const tx = new TransactionBuilder(sourceAccount, {
//     fee: '100',
//     networkPassphrase: Networks.TESTNET
//   })
//     .addOperation(Operation.invokeContractFunction({
//       contract: contractId,
//       function: 'get_founder',
//       args: [contractAddress]
//     }))
//     .setTimeout(30)
//     .build();

//   const result = await server.simulateTransaction(tx);
//   return result;
// }
// soroban.ts
import {
  Server,
  TransactionBuilder,
  Networks,
  Operation,
  Address,
} from 'soroban-client';

const contractId = import.meta.env.VITE_CONTRACT_ID!;
const rpcUrl = 'https://soroban-testnet.stellar.org';
const server = new Server(rpcUrl, { allowHttp: true });

export async function getFounder(publicKey: string) {
  try {
    const account = await server.getAccount(publicKey);
    const founderAddress = new Address(publicKey);

    const tx = new TransactionBuilder(account, {
      fee: '100',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.invokeContractFunction({
          contract: contractId, // ✅ fixed key
          function: 'get_founder',
          args: [founderAddress.toScVal()],
        })
      )
      .setTimeout(30)
      .build();

    const simResult = await server.simulateTransaction(tx);

    if ('result' in simResult) {
      const returnVal = simResult.result.retval;
      console.log("Simulated getFounder return:", returnVal);

      return {
        tokenized: !!returnVal
      };
    } else {
      console.error("Simulation error:", simResult);
      return { tokenized: false };
    }
  } catch (error) {
    console.error("Error simulating getFounder:", error);
    return { tokenized: false };
  }
}

