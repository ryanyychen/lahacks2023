var courseList = {
   "CSE 6R": [],
   "CSE 8A": [],
   "CSE 8B": ["CSE 8A"],
   "CSE 11": [],
   "CSE 12": ["CSE 11"],
   "CSE 15L": ["CSE 11"],
   "CSE 20": ["CSE 11"],
   "CSE 21": ["CSE 20"],
   "CSE 30": ["CSE 12", "CSE 15L"],
   "CSE 42": [],
   "CSE 86": ["CSE 12"],
   "CSE 87": [],
   "CSE 90": [],
   "CSE 91": [],
   "CSE 95": [],
   "CSE 99": [],
   "CSE 100": ["CSE 21", "CSE 12", "CSE 15L", "CSE 30"]
}

var completed = [];
var layerNum = 1;
var courses = Object.keys(courseList);

/* Run while requirements for degree not completed */
while (layerNum < 10) {
   let fullList = true;
   for (let i = 0; i < completed.length; i++) {
      if (!completed.includes(courses[i])) {
         fullList = false;
      }
   }
   if (completed.length != courses.length) fullList = false;
   if (fullList) break;

   /* Add new layer to tree */
   addLayer(layerNum, document.getElementById("tree_display"));

   let taking = [];

   /* Iterate map to find classes that can be taken
      and create nodes of those classes */
   for (var course of courses) {
      /* If node of course does not already exist then check for prerequisites
         then create new node if all prereqs satisfied*/
      if (!completed.includes(course)) {
         /* Get array of prerequisites using key */
         let prerequisites = courseList[course];
         let canTake = true;
         let prereqs = [];
         /* Iterate through each prerequisite and check if in 'completed' array */
         if (prerequisites.length != 1 || prerequisites[0] != null) {
            for (let i = 0; i < prerequisites.length; i++) {
               prereqs.push(prerequisites[i]);
               if (!completed.includes(prerequisites[i])) {
                  canTake = false;
               }
            }
         }
         /* If all prereqs satisfied, create new node and add to layer */
         if (canTake) {
            addCourse(course, document.getElementById("layer" + layerNum), prereqs);

            /* Add course to list of courses in this layer */
            taking.push(course);

            let currentCourse = document.getElementById(course);
            for (let i = 0; i < prerequisites.length; i++) {
               let prerequisiteCourse = document.getElementById(prerequisites[i]);
               console.log(prerequisiteCourse.textContent + " is a prereq of " + currentCourse.textContent);
            }
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
}