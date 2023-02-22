import OAuth from "oauth-1.0a";
import CryptoJS from "crypto-js";

export const GetStatesHalper = async (URL) => {

  const oauth = new OAuth({
    consumer: {
      key: "ck_2f82b019f1c8e5aab144e2893dee7425919431ba",
      secret: "cs_65d97da2eb91d46fbd4db83dcd56728c31661078",
    },
    signature_method: "HMAC-SHA1",
    hash_function: function (base_string, key) {
      return CryptoJS.HmacSHA1(base_string, key).toString(
        CryptoJS.enc.Base64
      );
    },
  });


  const requestData = {
    url: URL,
    method: "GET",
  };

  const headers = oauth.toHeader(oauth.authorize(requestData));

  const response = await fetch(requestData.url, {
    method: "GET",
    headers,
  });

  const {states} = await response.json();
  
  console.log("THIS IS THE STATES",states)
  return {states};
};