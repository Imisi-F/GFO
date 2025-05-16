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

// Setup
const contractId = import.meta.env.VITE_CONTRACT_ID!;
const tokenId = import.meta.env.VITE_TOKEN_CONTRACT_ID!;
const server = new Server("https://soroban-testnet.stellar.org");
const networkPassphrase = Networks.TESTNET;

// Utility
function getUserKeypair(): Keypair {
  console.log("[getUserKeypair] Fetching secret key from localStorage");
  const secret = localStorage.getItem("secretKey");
  if (!secret) {
    console.error("[getUserKeypair] Secret key not found in localStorage");
    throw new Error("Secret key not found in localStorage");
  }
  console.log("[getUserKeypair] Secret key found, creating Keypair");
  return Keypair.fromSecret(secret);
}

// 🚀 Fixed initFounder function
export async function initFounder(publicKey: string, name: string, equity: number) {
  try {
    console.log("[initFounder] Starting initFounder with", { publicKey, name, equity });

    const founder = new Address(publicKey);
    const user = getUserKeypair();
    console.log("[initFounder] Getting account details for user:", user.publicKey());

    const account = await server.getAccount(user.publicKey());
    console.log("[initFounder] Account fetched:", account.accountId());

    const contract = new Contract(contractId);

    console.log("[initFounder] Building transaction");
    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: networkPassphrase,
    })
      .addOperation(
        contract.call(
          "init_founder",
          founder.toScVal(),
          nativeToScVal(name, { type: "string" }),
          nativeToScVal(equity, { type: "u32" }),
          new Address(tokenId).toScVal()
        )
      )
      .setTimeout(30)
      .build();

    console.log("[initFounder] Signing transaction");
    tx.sign(user);

    console.log("[initFounder] Sending transaction");
    const res = await server.sendTransaction(tx);
    console.log("[initFounder] Transaction sent successfully:", res);

    return res;
  } catch (error) {
    console.error("[initFounder] Error during initFounder:", error);
    throw error;
  }
}

export async function getFounder(publicKey: string) {
  console.log("[getFounder] Starting getFounder with publicKey:", publicKey);
  try {
    const contract = new Contract(contractId);
    const founderAddress = new Address(publicKey);
    console.log("[getFounder] Founder address created:", founderAddress.toString());

    const userPublicKey = localStorage.getItem("publicKey");
    console.log("[getFounder] Retrieved userPublicKey from localStorage:", userPublicKey);
    if (!userPublicKey) throw new Error("User public key not found.");

    console.log("[getFounder] Checking account existence on testnet for:", userPublicKey);
    const res = await fetch(`https://stellar.expert/explorer/testnet/account/${userPublicKey}`);
    console.log("[getFounder] Account existence check status:", res.status);
    if (!res.ok) throw new Error("User account not found on Soroban testnet");

    console.log("[getFounder] Getting source account for transaction");
    const sourceAccount = await server.getAccount(userPublicKey);
    console.log("[getFounder] Source account retrieved:", sourceAccount.accountId());

    console.log("[getFounder] Building transaction to call get_founder");
    const tx = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase,
    })
      .addOperation(
        contract.call("get_founder", founderAddress.toScVal())
      )
      .setTimeout(30)
      .build();

    console.log("[getFounder] Simulating transaction");
    const sim = await server.simulateTransaction(tx);

    if ("error" in sim) {
      console.error("[getFounder] Simulation error:", sim.error);
      return null;
    }

    console.log("[getFounder] Simulation result received");
    const result = sim.result?.retval;
    if (!result) {
      console.warn("[getFounder] No result returned from simulation");
      return null;
    }
    if (!result.map) {
      console.warn("[getFounder] Result is not a map:", result);
      return null;
    }

    console.log("[getFounder] Parsing ScVal map result");
    const parsed = result.map().reduce((acc: any, entry: any) => {
      const key = entry.key.sym();
      const val = entry.val;
      console.log(`[getFounder] Parsed key=${key}, val=`, val);
      acc[key] = val;
      return acc;
    }, {});

    console.log("[getFounder] Parsed founder info:", parsed);

    return {
      name: parsed.name?.str(),
      role: parsed.role?.str(),
      equity: parsed.equity?.u32(),
      vesting: parsed.vesting?.str(),
      cliff: parsed.cliff?.str(),
      tokenized: parsed.tokenized?.b(),
    };
  } catch (err: any) {
    console.error("[getFounder] Error fetching founder on-chain:", err);
    return null;
  }
}

function scValToString(val: any): string {
  try {
    return val.str();
  } catch {
    console.warn("[scValToString] Expected ScVal string, got:", val);
    return "";
  }
}

function scValToBool(val: any): boolean {
  try {
    return val.b();
  } catch {
    console.warn("[scValToBool] Expected ScVal bool, got:", val);
    return false;
  }
}

function scValToU32(val: any): number {
  try {
    return val.u32();
  } catch {
    console.warn("[scValToU32] Expected ScVal u32, got:", val);
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

