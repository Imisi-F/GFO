#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, Symbol};

#[contract]
pub struct CapTable;

#[contractimpl]
impl CapTable {
    pub fn init_founder(env: Env, founder: Address, name: Symbol, equity: u32) {
        env.storage().temporary().set(&(founder.clone(), symbol_short!("name")), &name);
        env.storage().temporary().set(&(founder, symbol_short!("equity")), &equity);
    }

    pub fn get_founder(env: Env, founder: Address) -> (Symbol, u32) {
        let name: Symbol = env
            .storage()
            .temporary()
            .get(&(founder.clone(), symbol_short!("name")))
            .unwrap_or(symbol_short!("unknown"));

        let equity: u32 = env
            .storage()
            .temporary()
            .get(&(founder, symbol_short!("equity")))
            .unwrap_or(0);

        (name, equity)
    }
}
