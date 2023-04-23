fetch("./deptHtmls/departments.json")
   .then(response => response.json())
   .then(data => {
      var departmentsList = data;
      for (let i = 0; i < departmentsList.length; i++) {
         var option = document.createElement('option');
         option.value = departmentsList[i][0];
         document.getElementById("depts").appendChild(option);
      }
   })
   .catch(error => {
      console.error("Error fetching JSON:",error);      
   });