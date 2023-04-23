fetch()
   .then(response => response.json())
   .then(data => {
      var courses = data;
   })
   .catch(error => {
      console.error("Error fetching JSON:",error);      
   });