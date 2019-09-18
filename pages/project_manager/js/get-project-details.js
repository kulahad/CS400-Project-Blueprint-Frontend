/*////////////////////////////////////

Function to Display project details

*/////////////////////////////////////
$(document).ready(function () {
    //Get ID from url
    var url = window.location.href;
    var projectID = url.substring(url.lastIndexOf('?') + 1);

    //Urls
    var urlGetProjectByID = urlMain+'api/Projects/'+projectID;
    var urlGetProjectFiles = urlMain+'api/GetFilesProjectID/'+projectID;
    var urlGetProjectTeam = urlMain+'api/GetMembersProjectID/'+projectID;

    //Get project details
    fetch(urlGetProjectByID, {
        async: false,
        method: 'GET',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(function (a) { return a.json() })
    .then(function (j) {

        //Get html Containers
        var project_name =  document.getElementById("project_name_title");
        var project_name_side =  document.getElementById("project_name_side");
        var project_name_crumb =  document.getElementById("project_name_crumb");
        var project_client =  document.getElementById("project_client");
        var project_status  =  document.getElementById("project_status");
        var startDate =  document.getElementById("project_startDate");
        var endDate =  document.getElementById("project_endDate");
        var project_desc =  document.getElementById("project_desc");
        var project_percentage =  document.getElementById("project_percentage_text");
        var progress_meter  =  document.getElementById("progress_meter");
        var project_document  =  document.getElementById("document_list");
        
        //Get dates only
        var start = j.Start_Date; 
        var end = j.End_Date;
        
        var datestart ="";
        var dateend ="";

        //Get start date
        for (var i = 0; i < start.length; i++) {
            if(start.charAt(i) == "T"){
                break;
            }
            datestart += start.charAt(i);
        }

        //Get end date
        for (var i = 0; i < end.length; i++) {
            if(start.charAt(i) == "T"){
                break;
            }
            dateend += start.charAt(i);
        }

        //Display critical status
        var critical = document.createElement("p");
        critical.classList.add('text-center','text-danger');
        critical.innerHTML = "! CRITICAL !"

        //Create edit button for project
        var button = document.createElement("button");
        button.classList.add('btn', 'btn-danger', 'btn-block', 'text-white',  'float-right', 'col-md-3');
        button.setAttribute("data-toggle","modal");
        button.setAttribute("data-target","#editProjectModel");
        button.setAttribute("disabled-target","true");
        button.setAttribute("id","edit_button");
        button.innerHTML = "Edit Project";

        //Appending data onto the htmk containers
        project_name.innerHTML = j.Name;

        project_name.appendChild(button);
        project_name_side.innerHTML = j.Name;
        project_name_crumb.innerHTML = j.Name;

        project_desc.innerHTML = j.Description;
        project_client.innerHTML = j.Client_Name;
        startDate.innerHTML = datestart;
        endDate.innerHTML = dateend;
        progress_meter.setAttribute("Style","width:"+j.Percentage+"%;")
        project_percentage.innerHTML = j.Percentage+"%";

        // Check critical project
        if(j.Critical_flag == true){
            //Diplsay Critial Status
            var icon = document.createElement("i");
            icon.classList.add('fas', 'fa-info-circle','text-red','ml-1');
            project_status.classList.add('text-danger','font-weight-bold','text-blink');
            project_status.innerHTML = "CRITICAL";
            project_status.appendChild(icon);
        }else{
            // Check Project status and display
            if(j.Progress_Status == "OnGoing"){
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-chevron-circle-right','text-blue','ml-1');
                project_status.innerHTML = "On Going";
                project_status.appendChild(icon);

            }else if(j.Progress_Status == "OnHold"){
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-pause-circle','text-yellow','ml-1');
                project_status.innerHTML = "On Hold";
                project_status.appendChild(icon);

            }else if(j.Progress_Status == "Completed"){
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-check-circle','text-green','ml-1');
                project_status.innerHTML = "Completed";
                project_status.appendChild(icon);

            }else if(j.Progress_Status == "Cancelled"){
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-times-circle','text-red','ml-1');
                project_status.innerHTML = "Cancelled";
                project_status.appendChild(icon);
            }
        }

        //Get members related to project
        fetch(urlGetProjectTeam, {
            async: false,
            method: 'GET',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(function (a) { return a.json() })
        .then(function (k) {
            //Get html container
            var ul = document.getElementById("user_list");

            //Loop thorugh array of users and append them to the display list
            for(var i = 0; i< k.length; i++){
                userIdList.push(k[i].ID);

                var li = document.createElement("li");
                var p = document.createElement("p");
                p.classList.add('text-info')
                p.innerHTML = k[i].Username + " - <div class='text-danger display-inline-block'>" + k[i].Department + "</div>";
                li.appendChild(p);
                ul.appendChild(li);
            }

            //Remove loading icon and display output
            document.getElementById("load").style.display = "none";
            document.getElementById("container").classList.remove("display-none");

        }).catch(error => { console.error('Error:', error); return error; });

        //Get files realted to project
        fetch(urlGetProjectFiles, {
            async: false,
            method: 'GET',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(function (a) { return a.json() })
        .then(function (k) {
            //Get html container
            var ul = document.getElementById("document_list");

            //Loop thorugh array of users and append them to list
            for(var i = 0; i< k.length; i++){

                //Storing files into array for edit modal use
                var files = {
                    'Name': k[i].Name,
                    'Directory': k[i].Directory,
                    'FileID': k[i].FileID,
                    'ProjectID': k[i].ProjectID
                }

                file_array.push(files);

                //Append project team members to html list container
                var li = document.createElement("li");
                var a = document.createElement("a");
                a.innerHTML ="<a href='" + k[i].Directory + "'>" +  k[i].Name  + "</a>";;
                li.appendChild(a);
                ul.appendChild(li);
            }
        }).catch(error => { console.error('Error:', error); return error; });

         //Remove loading icon and display output for sidebar
        document.getElementById("icon_container").classList.remove("display-none");
        document.getElementById("sidebarToggle").classList.remove("display-none");
        
        //Load data into Edit project modal
        $('#edit_button').on("click", function () {
            document.getElementById("projName").value = j.Name;
            document.getElementById("project_client").value = j.Client_Name;
            document.getElementById("projDesc").value = j.Description;
            document.getElementById("status").value = j.Status;
            document.getElementById("project_status").value = j.Progress_Status;
            document.getElementById("project_startDate").value = j.Start_Date;
            document.getElementById("project_endDate").value = j.End_Date;
            document.getElementById("project_percentage").value = j.Percentage;
            document.getElementById("project_critical").value = j.Critical_flag;

            //Get html container
            var ul = document.getElementById("fileList");
            $('#fileList').empty();//Empty list from previous load

            
            /*////////////////////////////////////

            Function to populate project memebrs in list

            */////////////////////////////////////
            function populateList(){
                //Loop through file array and display with hyperlinks
                for(var i = 0; i< file_array.length; i++){

                    var li = document.createElement("li");
                    li.id = file_array[i].FileID;//Store for list item reference 

                    var p = document.createElement("p");
                    p.innerHTML = file_array[i].Name;
    
                    var btn = document.createElement("button");
                    btn.classList.add('btn-circle-edit','btn-danger','col-md-2','ml-2');
                    btn.id = file_array[i].Name;
                    btn.innerHTML = "X";
                    btn.setAttribute("type","button");
                    //Function which deletes file on edit view 
                    btn.onclick = function(){
                        for(var j = 0; j< file_array.length; j++){

                            if(file_array[j].Name == this.id){
                                deleted_file_array.push(file_array[j].FileID);
                                file_array.splice(j,1);
                                var elem = document.getElementById(li.id);
                                elem.parentNode.removeChild(elem);
                                populateList();
                            }

                        }
                        populateList();
                    };

                    //Append elements 
                    p.appendChild(btn);
                    li.appendChild(p);
                    ul.appendChild(li);
                }
            }

            //Populate the list 
            populateList();
            
        });   
    }).catch(error => { console.error('Error:', error); return error; });
});

