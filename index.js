var courses = new Map();
courses.set('CSE 11', [null]);
courses.set('CSE 12', ['CSE 11']);
courses.set('CSE 15L', ['CSE 11']);

var completed = [];
var layerNum = 1;  
/* need some determination for when to stop a while loop for constructing nodes */
while (layerNum < 2) {
   var iterator = courses.keys();
   var layer = document.createElement('div');
   layer.className = "tree_layer";
   layer.id = "layer" + layerNum;
   var parentDiv = document.getElementById("tree_display");
   parentDiv.appendChild(layer);
   while (true) {
      var courseName = iterator.next();
      if (courseName == null) break;
      for (let i = 0; i < courseName.value.length; i++) {
         var canTake = true;
         if (!completed.includes(courseName.value[i])) {
            canTake = false;
         }
      }
      if (canTake) {
         var node = document.createElement('div');
         node.className = "node";
         var course = document.createElement('span');
         course.className = "course";
         course.id = courseName;
         document.getElementById(courseName).textContent=courseName;
         layer.appendChild(course);
      }
   }
   layerNum++;
}