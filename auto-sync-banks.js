// Script to sync banks that have #AutoSync tag in their notes
// Useful for selectively syncing specific banks on a schedule
const { closeBudget, getAccountNote, openBudget } = require('./utils');
const api = require('@actual-app/api');

(async () => {
  await openBudget();

  console.log("Checking accounts for #AutoSync tag...");
  
  const accounts = await api.getAccounts();
  let syncCount = 0;

  for (const account of accounts) {
    const note = await getAccountNote(account);
    
    if (note && note.indexOf('#AutoSync') > -1) {
      console.log(`Syncing account: ${account.name}`);
      try {
        await api.runBankSync({ accountId: account.id });
        syncCount++;
        console.log(`Successfully synced: ${account.name}`);
      } catch (error) {
        console.error(`Error syncing ${account.name}:`, error.message);
      }
    }
  }

  console.log(`\nCompleted: ${syncCount} account(s) synced`);

  await closeBudget();
})();
