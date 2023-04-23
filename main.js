var urls = ['lowerDivs.json', 'upperDivs.json'];
var promises = urls.map(url => fetch(url).then(response => response.json()));
Promise.all(promises) 
    .then(data => {
        courseListL = data[0];
        courseListU = data[1];
    
        var completed = [];
        var layerNum = 1;
        var courses = Object.keys(courseListL).concat(Object.keys(courseListU));
        var newAdds = 1;

        while (newAdds != 0) {
            var origNum = completed.length;
            /* Add new layer to tree */
            var courseNum = 0;
            addLayer(layerNum, document.getElementById("tree_display"));

            let taking = [];

            /* Iterate map to find classes that can be taken
            and create nodes of those classes */
            for (var course of courses) {
                /* If node of course does not already exist then check for prerequisites
                then create new node if all prereqs satisfied*/
                if (!completed.includes(course)) {
                    /* Get array of prerequisites using key */
                    let allPrerequisites;
                    if (Object.keys(courseListL).includes(course)) {
                        allPrerequisites = courseListL[course];
                    } else {
                        allPrerequisites = courseListU[course];
                    }

                    // Parse first course in each 'and' list and compile 'or' list
                    let prereqs = [];
                    let altPrereqs = [];
                    let canTake = true;
                    for (let i = 0; i < allPrerequisites.length; i++) {
                        prereqs.push(allPrerequisites[i][0]);
                        if (!completed.includes(allPrerequisites[i][0])) {
                            canTake = false;
                        }
                        var subAltPrereqs = [];
                        for (let j = 1; j < allPrerequisites[i].length; j++) {
                            subAltPrereqs.push(allPrerequisites[i][j]);
                        }
                        if (subAltPrereqs.length != 0) {
                            var subAltPrereqsStr = allPrerequisites[i][0] + ": " + subAltPrereqs.join(" / ");
                            altPrereqs.push(subAltPrereqsStr);
                        }
                    }

                    if (canTake) {
                        if (Object.keys(courseListU).includes(course) && courseListU[course].length == 0) {
                            completed.push(course);
                        } else if (Object.keys(courseListU).includes(course) && layerNum < 4) {
                            continue;
                        } else {
                            addCourse(course, document.getElementById("layer" + layerNum), prereqs, altPrereqs);
                        }

                        /* Add course to list of courses in this layer */
                        taking.push(course);
                    }
                }
            }
            /* Add all courses in this layer to completed courses */
            for (let i = 0; i < taking.length; i++) {
                completed.push(taking[i]);
            }
            layerNum++;
            newAdds = completed.length - origNum;
        }

        /* Function to create new layer and append to tree_display div */
        function addLayer(layerNum, parentDiv) {
            let layer = document.createElement('div');
            layer.className = "tree_layer";
            layer.id = "layer" + layerNum;
            parentDiv.appendChild(layer);
        }

        /* Function to create new course and append to layer */
        function addCourse(courseName, parentDiv, prereqs, altPrereqs) {
            let node = document.createElement('div');
            node.className = "node";
            node.id = courseName;
            let course = document.createElement('span');
            course.className = "course";
            course.textContent = courseName;
            node.dataset.prerequisites = prereqs;
            node.dataset.altprereqs = altPrereqs;
            node.appendChild(course);
            parentDiv.appendChild(node);
        }
    })
    .catch(error => {
        console.error('Error fetching data:',error);
    });