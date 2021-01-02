

// Use value from REACT_APP_SERVER_URL environment variable for serverURL if it is set
// See this link for more info: https://create-react-app.dev/docs/adding-custom-environment-variables/
const serverURL = process.env.REACT_APP_SERVER_URL || "http://localhost:3030";

export default serverURL;