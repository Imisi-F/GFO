#![no_std]

use core::result::Result;
use core::clone::Clone;
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, Symbol};
use soroban_sdk::{IntoVal, Vec, Val};


#[contract]
pub struct CapTable;

#[contractimpl]
impl CapTable {
    pub fn init_founder(env: Env, founder: Address, name: Symbol, equity: i128, _token: Address) {
        // Store founder info
        env.storage().persistent().set(&(founder.clone(), symbol_short!("name")), &name);
        env.storage().persistent().set(&(founder.clone(), symbol_short!("equity")), &equity);
        // env.storage().temporary().set(&(founder.clone(), symbol_short!("tokenised")), &true);

        // Mint tokens by calling the token contract

    }
    pub fn mint_founder(env: Env, founder: Address, token: Address) {
    let equity: i128 = env.storage()
        .persistent()
        .get(&(founder.clone(), symbol_short!("equity")))
        .unwrap_or(0);

    if equity > 0 {
        let args: Vec<Val> = Vec::from_array(
            &env,
            [
                founder.clone().into_val(&env),
                equity.into_val(&env),
            ],
        );
        let _ = env.invoke_contract::<()>(&token, &symbol_short!("mint"), args);

        env.storage().persistent().set(&(founder.clone(), symbol_short!("tokenised")), &true);
        }
    }

    pub fn get_founder(env: Env, founder: Address) -> (Symbol, i128, bool) {
        let name = env.storage()
            .persistent()
            .get(&(founder.clone(), symbol_short!("name")))
            .unwrap_or(symbol_short!("unknown"));
        let equity = env.storage()
            .persistent()
            .get(&(founder.clone(), symbol_short!("equity")))
            .unwrap_or(0);
        let tokenised = env.storage()
            .persistent()
            .get(&(founder.clone(), symbol_short!("tokenised")))
            .unwrap_or(false);

        (name, equity, tokenised)
    }
}
