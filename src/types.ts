// types.ts
export type Founder = {
  name: string;
  role?: string;
  equity: number;
  vested?: string;
  cliff?: string;
  publicKey: string;
  tokenized: boolean;
};

export type DisplayFounder = Omit<Founder, "tokenized"> & {
  tokenized: "Yes" | "No";
};

export type EditRequest = {
  founderName: string;
  requestedEquity: string;
  justification: string;
};
