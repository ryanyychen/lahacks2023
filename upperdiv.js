fetch('upperDivs.json')
   .then(response => response.json())
   .then(data => {
      var courseList = data;
      var layerNum = 1;
      var courseNum = 0;
      var courses = Object.keys(courseList);
      while (courseNum < courses.length) {
         /* Add new layer to tree */
         addLayer(layerNum, document.getElementById("tree_display"));
         var layer = document.getElementById("layer" + layerNum);
         var layerCourses = 0;

         while (layerCourses < 5) {
            if (courseList[courses[courseNum]].length == 0) {
               addCourse(courses[courseNum], layer, []);
               layerCourses++;
            }
            courseNum++;
            if (courseNum == courses.length) break;
         }
         layerNum++;
      }

      /* Function to create new layer and append to tree_display div */
      function addLayer(layerNum, parentDiv) {
         let layer = document.createElement('div');
         layer.className = "tree_layer";
         layer.id = "layer" + layerNum;
         parentDiv.appendChild(layer);
      }

      /* Function to create new course and append to layer */
      function addCourse(courseName, parentDiv, prereqs) {
         let node = document.createElement('div');
         node.className = "node";
         node.id = courseName;
         let course = document.createElement('span');
         course.className = "course";
         course.textContent = courseName;
         node.dataset.prerequisites = prereqs;
         node.appendChild(course);
         parentDiv.appendChild(node);
         //console.log("add "+courseName);
      }
      })
      .catch(error => {
         console.error('Error fetching JSON:',error);
})