//Do NOT delete this hook, it ensures that the user data is cleard between tests from the loacalstorage 
beforeEach(() => {
  indexedDB.deleteDatabase('firebaseLocalStorageDb');
});
