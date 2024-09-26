import {
  reactExtension,
  BlockStack,
  TextField,
  useApplyAttributeChange,
  useEmail,
  useBuyerJourneyIntercept
} from "@shopify/ui-extensions-react/checkout";
import { useState, useEffect } from "react";
// Choose an extension target
export default reactExtension("purchase.checkout.contact.render-after", () => (
  <Extension />
));

function Extension() {
  const email = useEmail();
  console.log(email);
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");

  useBuyerJourneyIntercept(({canBlockProgress})=>{
    console.log("PASS:");
    console.log(password);
    if(canBlockProgress && password == ""){
      console.log("YES");
      return{
        behavior: "block",
        reason: "You must enter a password",
        perform: (result) => {
          if(result.behavior === "block"){
            setError("You must enter a password");
          }
        }
      }
    }else{
      console.log("NO");
      return {behavior : "allow"}
    }
  })
  // Handle password change
  const handlePasswordChange = (event) => {
    setPassword(event);
    // setPassword(event.target.value);
    console.log('Password:', event); // Debug password change
    const url = new URL('https://fmp-app-production.herokuapp.com/customer/create/');
    // const encodedEmail = encodeURIComponent(email);

    // url.searchParams.append('email', encodedEmail);
    // url.searchParams.append('password', event);
    // console.log(url);
    // return;
    if(event !== ''){
      setError("");
    let requestData ={
      email:email,
      password:event
    }
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-fmp-key': "588cab541c833bfda55c31139a31f8f5"
      },
      body: JSON.stringify(requestData)  // Convert the data object to a JSON string
    })
      .then(response => response.json())  // Assuming the server responds with JSON
      .then(data => {
        console.log("Response:");
        console.log(data);
      })
      .catch(error => {
        console.error("Fetch error:", error);
      });
    }
  };

  // Debug email
  // useEffect(() => {
  // console.log('Customer Email:', email); // Debug log
  // }, [email]);

  return (
    <BlockStack border={"dotted"} padding={"tight"}>
      <TextField
        onChange={handlePasswordChange}
        error={error}
        label="Password"
        type="password"
      />
    </BlockStack>
  );
}