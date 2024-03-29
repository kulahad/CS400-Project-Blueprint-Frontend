/*////////////////////////////////////

Function to populate staff list dropdown for task view

*/ ////////////////////////////////////
$(document).ready(function() {
  //Get ID from url
  var url = window.location.href;
  var projectID = url.substring(url.lastIndexOf("?") + 1);

  //Urls
  var urlGetProjectMembers = urlMain + "api/GetMembersProjectID/" + projectID;
  fetch(urlGetProjectMembers, {
    async: false,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    }
  })
    .then(response => response.json())
    .then(a => {
      //Populate dropdown
      a.forEach(element => {
        $("#members_list").append(
          $("<option>", {
            value: element.ID,
            text: element.Username
          })
        );
      });
    })
    .catch(error => {
      Swal.fire({
        title: "Error!",
        text: error,
        type: "error",
        allowOutsideClick: false,
        confirmButtonText: "Ok"
      });
    });
});
