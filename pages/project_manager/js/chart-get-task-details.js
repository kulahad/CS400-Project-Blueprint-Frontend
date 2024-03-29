/*////////////////////////////////////

Display tasks in donut chart

*/ ////////////////////////////////////
$(document).ready(function() {
  //Get ID from url
  var url = window.location.href;
  var projectID = url.substring(url.lastIndexOf("?") + 1);

  //Urls
  var urlGetTasksByPerProject = urlMain + "api/GetTasksPerProject/" + projectID;

  //Get all tasks for project
  fetch(urlGetTasksByPerProject, {
    async: false,
    method: "GET",
    crossDomain: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    }
  })
    .then(function(a) {
      return a.json();
    })
    .then(function(j) {
      var tasksDoneCounter = 0,
        tasksDoingCounter = 0,
        tasksTodoCounter = 0;

      j.forEach(element => {
        if (
          element.Progress_Status == "Todo" &&
          element.If_Milestone == false &&
          element.If_Objective == false
        ) {
          tasksTodoCounter++;
        } else if (
          element.Progress_Status == "Doing" &&
          element.If_Milestone == false &&
          element.If_Objective == false
        ) {
          tasksDoingCounter++;
        } else if (
          element.Progress_Status == "Done" &&
          element.If_Milestone == false &&
          element.If_Objective == false
        ) {
          tasksDoneCounter++;
        }
      });

      if (j.length == 0) {
        document.getElementById("chart_container").classList.toggle("d-none");
        document.getElementById("no_tasks").classList.toggle("d-none");
      }

      //Display doughnut chart
      var ctx = document.getElementById("myPieChart");
      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Tasks Completed", "Tasks Left to do", "Tasks being done"],
          datasets: [
            {
              data: [tasksDoneCounter, tasksTodoCounter, tasksDoingCounter],
              backgroundColor: ["#1cc88a ", "#e74a3b ", "#f6c23e"],
              hoverBackgroundColor: ["#81CCB2", "#FF968B", "#FFD467"],
              hoverBorderColor: "rgba(234, 236, 244, 1)"
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            borderColor: "#dddfeb",
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            caretPadding: 10
          },
          legend: {
            display: false
          },
          cutoutPercentage: 80
        }
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
