// populate table
$(document).ready(function () {
  var table;
  var token = sessionStorage.getItem("token");
  var url = 'https://datectestapi.azurewebsites.net/api/UserMains';

  fetch(url, {
    async: false,
    method: 'GET',
    crossDomain: true,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }).then(response => response.json())
    .then((a) => {
      table = $('#staffTable').DataTable(
        {
          data: a,
          searching: true,
          dom: '<"top"l>rt<"bottom"ip><"clear">',
          select: true,
          columns: [
            { data: 'ID' },
            { data: 'Username' },
            { data: 'Email' },
            { data: 'Role' },
            { data: 'Department' },
            { data: 'Status' }
          ]
        }
      );

      $('#staffTable tbody').on('click', 'tr', function () {

        if ($(this).hasClass('clickedon')) {
          $(this).addClass('clickedon');
          $(this).removeClass('clickedon');
        }
        else {
          $(this).addClass('clickedon');
        }

        $('#add_members').on("click", function () {
          var oData = table.rows('.clickedon').data();
          table.row('.clickedon').remove().draw(false);

          //remove first row
          if (no_members == true) {
            document.getElementById("current_members").deleteRow(1);
            no_members = false
          }

          var memberTable = document.getElementById("current_members");

          var tr = memberTable.insertRow();
          
          var td1 = tr.insertCell(0);
          var td2 = tr.insertCell(1);

          var username = document.createTextNode(oData[0].Username);
          var department = document.createTextNode(oData[0].Department);

          td1.appendChild(username);
          td2.appendChild(department);
        });

      });


      table.search("Staff").draw();



      table.column(0).visible(false);
      table.column(3).visible(false);
      table.column(5).visible(false);

    }).catch(error => { console.error('Error:', error); return error; });

  // new change

});