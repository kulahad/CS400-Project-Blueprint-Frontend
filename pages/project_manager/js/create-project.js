/*////////////////////////////////////

Function to create a project

*/////////////////////////////////////
function create_project() {
    //Urls
    urlPostProject = urlMain+'api/Projects';
    urlPostUserProject =  urlMain+'api/UserProjects';
    urlPostFiles =  urlMain+'api/Files';

    //Get html containers
    var projectName = document.getElementById("projName").value;
    var projClient = document.getElementById("projClient").value;
    var projDesc = document.getElementById("projDesc").value;
    var projStartDate = document.getElementById("projStartDate").value;
    var projEndDate = document.getElementById("projEndDate").value;
    var ProjectMangerId = sessionStorage.getItem("userID");

    //Validates dates
    if (projStartDate > projEndDate) {
        alert("Dates do not match!");
    } else if (projStartDate == projEndDate) {
        alert("Dates do not match!");
    } else {
        //Validates selected members
        if(userIdList === undefined  || userIdList.length == 0){
            alert("Please add members!");
        }else{
            //Data encapsulation
            var payload_project = {
                'Name': projectName,
                'Description': projDesc,
                'Start_Date': projStartDate,
                'Project_managerID' : ProjectMangerId,
                'End_Date': projEndDate,
                'Client_Name': projClient,
                'Expected_Date': projEndDate,
                'Progress_Status': "OnGoing",
                'Percentage': 0,
                'Status': true,
                'Critical_flag': false
            };

            //Create project and returns ID of new project
            fetch(urlPostProject, {
                async: false,
                method: 'POST',
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(payload_project)
            }).then(function (a) { return a.json() })
            .then(function (j) {

                //Loop for each user store project id and link users to project
                for (var i = 0; i < userIdList.length; i++) {

                    //Data encapsulation
                    var payload_user_project = {
                        'ProjectID': j.ProjectID,
                        'UserID': userIdList[i]
                    }

                    //Create Users in UserProject
                    fetch(urlPostUserProject, {
                        async: false,
                        method: 'POST',
                        crossDomain: true,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                        body: JSON.stringify(payload_user_project)
                    }).catch(error => { console.error('Error:', error); return error; });
                }
                
                //Link uploaded files to the project ID 
                for (var i = 0; i < ArrayOfFiles.length; i++) {
                    
                    fetch(urlPostFiles, {
                        async: false,
                        method: 'POST',
                        crossDomain: true,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                        body: JSON.stringify(ArrayOfFiles[i])
                    }).catch(error => { console.error('Error:', error); return error; });
                }
                
                $('#successModal').modal('show');

            }).catch(error => { console.error('Error:', error); return error; });
        }    
    }
}