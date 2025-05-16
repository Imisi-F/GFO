export async function fundTestnetAccount(publicKey: string): Promise<void> {
  try {
    const response = await fetch(`https://friendbot.stellar.org/?addr=${publicKey}`);
    if (!response.ok) {
      throw new Error("Friendbot request failed");
    }
    const data = await response.json();
    console.log("✅ Funded by Friendbot:", data);
  } catch (error) {
    console.error("❌ Failed to fund account with Friendbot:", error);
    throw error;
  }
}