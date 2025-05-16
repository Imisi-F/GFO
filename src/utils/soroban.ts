import {
  Address,
  Contract,
  Keypair,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  Server,
  nativeToScVal,
} from "soroban-client";
import ScVal from "soroban-client";
import { StrKey } from "stellar-sdk";
// import Server from "stellar-sdk";



// Setup
const contractId = import.meta.env.VITE_CONTRACT_ID!;
const tokenId = import.meta.env.VITE_TOKEN_CONTRACT_ID!;
const server = new Server("https://soroban-testnet.stellar.org");
const networkPassphrase = Networks.TESTNET;
const accountExists = async () => {
  try {
    const res = await fetch(`https://soroban-testnet.stellar.org/accounts/${localStorage.getItem("publicKey")}`);
    return res.ok;
  } catch {
    return false;
  }
};

// Utility
function getUserKeypair(): Keypair {
  const secret = localStorage.getItem("secretKey");
  if (!secret) throw new Error("Secret key not found in localStorage");
  return Keypair.fromSecret(secret);
}

// 🚀 Fixed initFounder function
export async function initFounder(publicKey: string, name: string, equity: number) {
  const founder = new Address(publicKey);
  const user = getUserKeypair();
  const account = await server.getAccount(user.publicKey());

  const contract = new Contract(contractId);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: networkPassphrase,
  })
    .addOperation(contract.call(
      "init_founder",
      founder.toScVal(),
      nativeToScVal(name, { type: "string" }),
      nativeToScVal(equity, { type: "u32" }),
      new Address(tokenId).toScVal()
    ))
    .setTimeout(30)
    .build();

  tx.sign(user);
  const res = await server.sendTransaction(tx);
  console.log("initFounder result:", res);
  return res;
}

export async function getFounder(publicKey: string) {
  const contract = new Contract(contractId);
  const decoded = StrKey.decodeEd25519PublicKey(publicKey); // Converts to Uint8Array
  const address = Address.account(decoded);

  try {
    const source = await server.getAccount(localStorage.getItem("publicKey"));

    const tx = new TransactionBuilder(source, {
      fee: "100000",
      networkPassphrase,
    })
      .addOperation(contract.call("get_founder", address.toScVal()))
      .setTimeout(30)
      .build();

    const sim = await server.simulateTransaction(tx);
    console.log("Calling getFounder with:", publicKey);
    console.log("Contract:", contract);



    // Type guard for success response
    if ("error" in sim) {
      console.error("Simulation error:", sim.error);
      return null;
    }

    const result = sim.result?.retval;
    if (!result || !result.map) return null;

    const parsed = result.map().reduce((acc: any, entry: any) => {
      const key = entry.key.sym();
      const val = entry.val;
      acc[key] = val;
      return acc;
    }, {});

    return {
      name: scValToString(parsed.name),
      role: scValToString(parsed.role),
      equity: Number(scValToU32(parsed.equity)),
      vesting: scValToString(parsed.vesting),
      cliff: scValToString(parsed.cliff),
      tokenized: scValToBool(parsed.tokenized),
    };
  } catch (err: any) {
    console.error("Error fetching founder on-chain:", err);
    return null;
  }
}

function scValToString(val: any): string {
  try {
    return val.str();
  } catch {
    console.warn("Expected ScVal string, got:", val);
    return "";
  }
}

function scValToBool(val: any): boolean {
  try {
    return val.b();
  } catch {
    console.warn("Expected ScVal bool, got:", val);
    return false;
  }
}

function scValToU32(val: any): number {
  try {
    return val.u32();
  } catch {
    console.warn("Expected ScVal u32, got:", val);
    return 0;
  }
}

// import {
//   Server,
//   TransactionBuilder,
//   Networks,
//   Operation,
//   Address,
//   scValToNative,
// } from "soroban-client";

// const contractId = import.meta.env.VITE_CONTRACT_ID!;
// const server = new Server("https://soroban-testnet.stellar.org", { allowHttp: true });

// export async function getFounder(publicKey: string) {
//   try {
//     const account = await server.getAccount(publicKey);

//     const tx = new TransactionBuilder(account, {
//       fee: "100",
//       networkPassphrase: Networks.TESTNET,
//     })
//       .addOperation(
//         Operation.invokeContractFunction({
//           contract: contractId,
//           function: "get_founder",
//           args: [new Address(publicKey).toScVal()],
//         })
//       )
//       .setTimeout(30)
//       .build();

//     const simResult = await server.simulateTransaction(tx);

//     if ("error" in simResult) {
//       console.error("Simulation error:", simResult.error);
//       return { tokenized: false };
//     }

//     const raw = simResult.result?.retval;
//     if (!raw) return { tokenized: false };

//     // Try to parse the result, assume if raw is valid founder info, founder is tokenized
//     const founderData = scValToNative(raw);
//     if (founderData) {
//       return { tokenized: true };
//     } else {
//       return { tokenized: false };
//     }
//   } catch (error) {
//     console.error("Error in getFounder:", error);
//     return { tokenized: false };
//   }
// }





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

