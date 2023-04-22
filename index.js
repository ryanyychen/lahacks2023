var courses = new Map();
courses.set('MATH 181A', [null]);
courses.set('CSE 20', ['CSE 11']);
courses.set('CSE 21', ['CSE 20']);
courses.set('CSE 100', ['CSE 21', 'CSE 30']);
courses.set('CSE 101', ['CSE 21']);
courses.set('CSE 105', ['CSE 12', 'CSE 15L', 'CSE 20', 'CSE 21']);
courses.set('CSE 110', ['CSE 100']);
courses.set('MATH 20A', [null]);
courses.set('MATH 20B', ['MATH 20A']);
courses.set('MATH 20C', ['MATH 20B']);
courses.set('CSE 11', [null]);
courses.set('CSE 12', ['CSE 11']);
courses.set('CSE 15L', ['CSE 11']);
courses.set('CSE 30', ['CSE 12', 'CSE 15L']);

/* Sort map in alphabetical order */
courses = new Map([...courses.entries()].sort());

var completed = [];
var layerNum = 1;
var courseList = Array.from(courses.keys());

/* Run while requirements for degree not completed */
while (true) {
   let graduated = true;
   for (let i = 0; i < completed.length; i++) {
      if (!completed.includes(courseList[i])) {
         graduated = false;
      }
   }
   if (completed.length != courseList.length) graduated = false;
   if (graduated) break;
   /* Use iterator to iterate map */
   let iterator = courses.keys();

   /* Create new layer to tree */
   let layer = document.createElement('div');
   layer.className = "tree_layer";
   layer.id = "layer" + layerNum;
   /* Append layer to tree */
   let parentDiv = document.getElementById("tree_display");
   parentDiv.appendChild(layer);

   let taking = [];

   /* Iterate map to find classes that can be taken
      and create nodes of those classes */
   while (true) {
      let courseName = iterator.next().value; /* courseName = (key, done: T/F) */
      if (courseName == null) break;

      /* If node of course does not already exist then check for prerequisites
         then create new node if all prereqs satisfied*/
      if (!completed.includes(courseName)) {
         /* Get array of prerequisites using key */
         let prerequisites = courses.get(courseName);
         let canTake = true;
         /* Iterate through each prerequisite and check if in 'completed' array */
         if (prerequisites.length != 1 || prerequisites[0] != null) {
            for (let i = 0; i < prerequisites.length; i++) {
               if (!completed.includes(prerequisites[i])) {
                  canTake = false;
               }
            }
         }
         /* If all prereqs satisfied, create new node and add to layer */
         if (canTake) {
            let node = document.createElement('div');
            node.className = "node";
            let course = document.createElement('span');
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