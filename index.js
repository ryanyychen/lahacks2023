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

   /* Add new layer to tree */
   addLayer(layerNum, document.getElementById("tree_display"));

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
            addCourse(courseName, document.getElementById("layer" + layerNum));

            /* Add course to list of courses in this layer */
            taking.push(courseName);
/*
            let currentCourse = document.getElementById(courseName);
            for (let i = 0; i < prerequisites.length; i++) {
               let prerequisiteCourse = document.getElementById(prerequisites[i]);
               if (prerequisiteCourse) {
                  drawLine(currentCourse, prerequisiteCourse);
               }
            }*/
         }
      }
   }
   /* Add all courses in this layer to completed courses */
   for (let i = 0; i < taking.length; i++) {
      completed.push(taking[i]);
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
function addCourse(courseName, parentDiv) {
   let node = document.createElement('div');
   node.className = "node";
   let course = document.createElement('span');
   course.className = "course";
   course.id = courseName;
   course.textContent = courseName;
   node.appendChild(course);
   parentDiv.appendChild(node);
}
/*
function drawLine(node1, node2) {
   let parentDiv = node1.parentElement;
   let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
   svg.className = "line";
   parentDiv.appendChild(svg);
   let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
   line.setAttribute("x1", node1.offsetLeft + node1.offsetWidth / 2);
   line.setAttribute("y1", node1.offsetTop + node1.offsetHeight / 2);
   line.setAttribute("x2", node2.offsetLeft + node2.offsetWidth / 2);
   line.setAttribute("y2", node2.offsetTop + node2.offsetHeight / 2);
   svg.appendChild(line);
} */