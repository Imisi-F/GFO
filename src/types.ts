// types.ts
export type Founder = {
  id?: string;
  name?: string;
  role?: string;
  equity: number;
  vested?: string;
  cliff?: string;
  publicKey: string;
  tokenized: boolean;
};

// export type DisplayFounder = Omit<Founder, "tokenized"> & {
//   tokenized: false;
// };

export type EditRequest = {
  founderName: string;
  requestedEquity: string;
  justification: string;
};
