var courses = new Map();
courses.set('CSE 11', [null]);
courses.set('CSE 12', ['CSE 11']);
courses.set('CSE 15L', ['CSE 11']);
courses.set('CSE 30', ['CSE 12', 'CSE 15L']);

var completed = [null];
var layerNum = 1;  
/* need some determination for when to stop a while loop for constructing nodes */
while (layerNum < 4) {
   console.log(completed);
   /* Use iterator to iterate map */
   var iterator = courses.keys();

   /* Create new layer to tree */
   var layer = document.createElement('div');
   layer.className = "tree_layer";
   layer.id = "layer" + layerNum;
   /* Append layer to tree */
   var parentDiv = document.getElementById("tree_display");
   parentDiv.appendChild(layer);
   console.log("Added layer");

   var taking = [];

   /* Iterate map to find classes that can be taken
      and create nodes of those classes */
   while (true) {
      console.log(taking);
      var courseName = iterator.next().value; /* courseName = (key, done: T/F) */
      if (courseName == null) break;
      console.log("Course: " + courseName);

      /* If node of course does not already exist then check for prerequisites
         then create new node if all prereqs satisfied*/
      if (!completed.includes(courseName)) {
         console.log("Attempting to add: " + courseName);
         /* Get array of prerequisites using key */
         var prerequisites = courses.get(courseName);
         var canTake = true;
         /* Iterate through each prerequisite and check if in 'completed' array */
         for (let i = 0; i < prerequisites.length; i++) {
            if (!completed.includes(prerequisites[i])) {
               canTake = false;
            }
         }
         /* If all prereqs satisfied, create new node and add to layer */
         if (canTake) {
            var node = document.createElement('div');
            node.className = "node";
            var course = document.createElement('span');
            course.className = "course";
            course.id = courseName;
            course.textContent = courseName;
            node.appendChild(course);
            layer.appendChild(node);

            /* Add course to list of courses taken this layer */
            taking.push(courseName);
         }
      }
   }
   /* Add all courses taken this layer to completed courses */
   for (let i = 0; i < taking.length; i++) {
      completed.push(taking[i]);
   }
   layerNum++;
}