const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const API_BASE_URL = isLocalhost 
    ? "http://localhost:3000" 
    : "https://jjtd4cc3icl3gqbugqmw63m2xq0mxohx.lambda-url.us-east-1.on.aws";

console.log("API collegata a:", API_BASE_URL);