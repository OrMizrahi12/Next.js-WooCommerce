import OAuth from "oauth-1.0a";
import CryptoJS from "crypto-js";


export const CredentialsHelper = async (URL) => {

  const oauth = new OAuth({
    consumer: {
      key: process.env.WP_CONSUMER_KEY,
      secret: process.env.WP_CONSUMER_SECRET,
    },
    signature_method: process.env.SIGNATURE_METHOD_AUTH,
    hash_function: function (base_string, key) {
      return CryptoJS.HmacSHA256(base_string, key).toString(
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

  const countries = await response.json();

  return { countries };
};

// Create a sort algorithrm in c++