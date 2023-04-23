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
        var taking = [];
        var overflow = false;

        while (newAdds != 0) {
            var origNum = completed.length;
            /* Add new layer to tree */
            var courseNum = 0;
            addLayer(layerNum, document.getElementById("tree_display"));

            if (overflow) {
                overflow = false;
            } else {
                taking = []
            }

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

                    // For now use first element in each 'and' list
                    let prerequisites = [];
                    for (let i = 0; i < allPrerequisites.length; i++) {
                        prerequisites.push(allPrerequisites[i][0])
                    }

                    let canTake = true;
                    let prereqs = [];
                    /* Iterate through each prerequisite and check if in 'completed' array */
                    if (prerequisites.length > 0 && prerequisites[0] !== null) {
                        for (let i = 0; i < prerequisites.length; i++) {
                            prereqs.push(prerequisites[i]);
                        if (!completed.includes(prerequisites[i])) {
                            canTake = false;
                        }
                        }
                    }
                    /* If all prereqs satisfied, create new node and add to layer */
                    if (canTake) {
                        if (Object.keys(courseListU).includes(course) && courseListU[course].length == 0) {
                            completed.push(course);
                        } else if (Object.keys(courseListU).includes(course) && layerNum < 4) {
                            continue;
                        } else {
                            addCourse(course, document.getElementById("layer" + layerNum), prereqs);
                            courseNum++;
                        }

                        /* Add course to list of courses in this layer */
                        taking.push(course);
                    }
                    if (courseNum >= 14) {
                        overflow = true;
                        break;
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
    })
    .catch(error => {
        console.error('Error fetching data:',error);
    });