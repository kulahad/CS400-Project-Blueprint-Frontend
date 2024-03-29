/*////////////////////////////////////

Function to Get token for user login

*/ ////////////////////////////////////
async function getToken() {
  //Get html containers
  var username = document.getElementById("usrnme").value;
  var password = document.getElementById("pass").value;
  var data;

  //Urls
  var urlToken = urlMain + "token";

  //data encapsulation
  var details = {
    userName: username,
    password: password,
    grant_type: "password"
  };

  //Create a form
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  //Fetch token
  await fetch(urlToken, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: formBody
  })
    .then(response => response.json())
    .then(response => {
      if (response.access_token != null) {
        data = response.access_token;
      } else {
        console.error("Error:", response.error_description);
        data = false;
      }
    })
    .catch(error => {
      console.error("Error:", error);
      return error;
    });

  return data;
}
