const getMpesaToken = require("./mpesaAuth");



getMpesaToken().then((token) => {
  console.log("M-Pesa Access Token:", token);
});
