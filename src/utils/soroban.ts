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

// Helper to fetch fresh account details before building tx
async function getFreshAccount(user: Keypair) {
  return await server.getAccount(user.publicKey());
}

// Helper to build, sign, and send a transaction with retry on txBadSeq error
async function sendTxWithRetry(buildTxFunc: (account: any) => any, user: Keypair, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const account = await getFreshAccount(user);
      const tx = buildTxFunc(account);
      tx.sign(user);
      const result = await server.sendTransaction(tx);
      console.log("[sendTxWithRetry] Transaction success:", result.hash);
      return result;
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.extras &&
        error.response.data.extras.result_codes &&
        error.response.data.extras.result_codes.transaction === "txBadSeq"
      ) {
        console.warn(`[sendTxWithRetry] txBadSeq detected, retrying attempt ${attempt + 1}...`);
        // wait a short moment before retrying
        await new Promise((res) => setTimeout(res, 1000));
        continue; // retry
      }
      // other error or no retries left
      console.error("[sendTxWithRetry] Transaction failed:", error);
      throw error;
    }
  }
  throw new Error("Failed to send transaction after retries due to txBadSeq");
}

// Updated initFounder using sendTxWithRetry
export async function initFounder(publicKey: string, name: string, equity: number) {
  const user = getUserKeypair();
  const founder = new Address(publicKey);
  const contract = new Contract(contractId);

  return sendTxWithRetry(
    (account) =>
      new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase,
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
        .build(),
    user
  );
}

// Updated mintFounder using sendTxWithRetry
export async function mintFounder(publicKey: string) {
  try {
    console.log("[mintFounder] Starting mintFounder with", publicKey);

    const user = getUserKeypair();

    // ALWAYS fetch fresh account to get current sequence number
    const account = await server.getAccount(user.publicKey());

    const contract = new Contract(contractId);
    const founder = new Address(publicKey);
    const tokenAddress = new Address(tokenId);

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase,
    })
      .addOperation(
        contract.call(
          "mint_founder",
          founder.toScVal(),
          tokenAddress.toScVal()
        )
      )
      .setTimeout(30)
      .build();

    tx.sign(user);

    const result = await server.sendTransaction(tx);
    console.log("[mintFounder] Transaction successful:", result.hash);
    return result;
  } catch (error) {
    console.error("[mintFounder] Error minting tokens:", error);
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
    if (!userPublicKey) throw new Error("User public key not found in localStorage");

    const sourceAccount = await server.getAccount(userPublicKey);

    const tx = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase,
    })
      .addOperation(contract.call("get_founder", founderAddress.toScVal()))
      .setTimeout(30)
      .build();

    console.log("[getFounder] Simulating transaction");
    const sim = await server.simulateTransaction(tx);

    if ("error" in sim) {
      console.error("[getFounder] Simulation error:", sim.error);
      return null;
    }

    const result = sim.result?.retval;
    if (!result) {
      console.warn("[getFounder] No result returned from simulation");
      return null;
    }

    // Your contract returns a tuple: (Symbol, i128, bool)
    // So result should be a Vec/Array of 3 ScVal items
    const tuple = result.vec?.();
    if (!tuple || tuple.length !== 3) {
      console.warn("[getFounder] Unexpected tuple length or type:", tuple);
      return null;
    }

    // Parse each element of the tuple
    const name = tuple[0].sym?.() || tuple[0].str?.() || "unknown";
    const equity = tuple[1].i128 ? tuple[1].i128().toString() : "0";
    const tokenized = tuple[2].b ? tuple[2].b() : false;

    console.log("[getFounder] Parsed founder info:", { name, equity, tokenized });

    return {
      name,
      equity,
      tokenized,
    };
  } catch (err: any) {
    console.error("[getFounder] Error fetching founder on-chain:", err);
    return null;
  }
}

// export async function getFounder(publicKey: string) {
//   console.log("[getFounder] Starting getFounder with publicKey:", publicKey);
//   try {
//     const contract = new Contract(contractId);
//     const founderAddress = new Address(publicKey);
//     console.log("[getFounder] Founder address created:", founderAddress.toString());

//     const userPublicKey = localStorage.getItem("publicKey");
//     console.log("[getFounder] Retrieved userPublicKey from localStorage:", userPublicKey);
//     if (!userPublicKey) throw new Error("User public key not found.");

//     console.log("[getFounder] Checking account existence on testnet for:", userPublicKey);
//     // const res = await fetch(`https://stellar.expert/explorer/testnet/account/${userPublicKey}`);
//     // console.log("[getFounder] Account existence check status:", res.status);
//     // if (!res.ok) throw new Error("User account not found on Soroban testnet");

//     console.log("[getFounder] Getting source account for transaction");
//     const sourceAccount = await server.getAccount(userPublicKey);
//     console.log("[getFounder] Source account retrieved:", sourceAccount.accountId());

//     console.log("[getFounder] Building transaction to call get_founder");
//     const tx = new TransactionBuilder(sourceAccount, {
//       fee: BASE_FEE,
//       networkPassphrase,
//     })
//       .addOperation(
//         contract.call("get_founder", founderAddress.toScVal())
//       )
//       .setTimeout(30)
//       .build();

//     console.log("[getFounder] Simulating transaction");
//     const sim = await server.simulateTransaction(tx);

//     if ("error" in sim) {
//       console.error("[getFounder] Simulation error:", sim.error);
//       return null;
//     }

//     console.log("[getFounder] Simulation result received");
//     const result = sim.result?.retval;
//     if (!result) {
//       console.warn("[getFounder] No result returned from simulation");
//       return null;
//     }
//     if (!result.map) {
//       console.warn("[getFounder] Result is not a map:", result);
//       return null;
//     }

//     console.log("[getFounder] Parsing ScVal map result");
//     const mapEntries = result.map?.();
//     if (!Array.isArray(mapEntries)) return null;

//     const parsed = mapEntries.reduce((acc: any, entry: any) => {
//       const key = entry.key.sym();
//       const val = entry.val;
//       acc[key] = val;
//       return acc;
//     }, {});


//     console.log("[getFounder] Parsed founder info:", parsed);

//     return {
//       name: parsed.name && typeof parsed.name.str === 'function' ? parsed.name.str() : undefined,
//       role: parsed.role?.str(),
//       equity: parsed.equity?.i128().toString(),
//       vesting: parsed.vesting?.str(),
//       cliff: parsed.cliff?.str(),
//       tokenized: parsed.tokenized?.b() ?? false,
//     };
//   } catch (err: any) {
//     console.error("[getFounder] Error fetching founder on-chain:", err);
//     return null;
//   }
// }

// function scValToString(val: any): string {
//   try {
//     return val.str();
//   } catch {
//     console.warn("[scValToString] Expected ScVal string, got:", val);
//     return "";
//   }
// }

// function scValToBool(val: any): boolean {
//   try {
//     return val.b();
//   } catch {
//     console.warn("[scValToBool] Expected ScVal bool, got:", val);
//     return false;
//   }
// }

// function scValToU32(val: any): number {
//   try {
//     return val.u32();
//   } catch {
//     console.warn("[scValToU32] Expected ScVal u32, got:", val);
//     return 0;
//   }
// }




// export async function mintFounder(publicKey: string) {
//   try {
//     console.log("[mintFounder] Starting mintFounder with", publicKey);

//     const user = getUserKeypair();
//     const account = await server.getAccount(user.publicKey());

//     const contract = new Contract(contractId);
//     const founder = new Address(publicKey);
//     const tokenAddress = new Address(tokenId);

//     const tx = new TransactionBuilder(account, {
//       fee: BASE_FEE,
//       networkPassphrase,
//     })
//       .addOperation(
//         contract.call(
//           "mint_founder",
//           founder.toScVal(),
//           tokenAddress.toScVal()
//         )
//       )
//       .setTimeout(30)
//       .build();

//     tx.sign(user);

//     const result = await server.sendTransaction(tx);
//     console.log("[mintFounder] Transaction successful:", result.hash);
//     return result;
//   } catch (error) {
//     console.error("[mintFounder] Error minting tokens:", error);
//     throw error;
//   }
// }


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

