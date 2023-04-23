const nodes = document.getElementsByClassName('node');
var appended = false;

// Add event listener for mousemove event on the body element
document.body.addEventListener('mousemove', (event) => {
  const target = event.target;
  const altPrereqBox = document.getElementById("altptext")
  
  // Check if the mouse pointer is over a node
  if (target.classList.contains('node')) {
    target.classList.add('hovered');

    // Access AltPrereqs and add to text box
    document.getElementById("altprereqs").classList.remove('hidden');
    const altPrereqs = target.dataset.altprereqs.split(',');
    if (!appended) {
      for (var course of altPrereqs) {
        let text = document.createElement('p');
        text.className = "alttext";
        text.textContent = course;
        altPrereqBox.appendChild(text);
      }
      appended = true;
    }
    
    // Get prerequisites of the hovered node
    const prerequisites = target.dataset.prerequisites.split(','); // Assuming prerequisites are stored as a comma-separated string in the 'data-prerequisites' attribute
    
    // Change color of prerequisites
    if (prerequisites[0] != "") {
      updateHovered(prerequisites);
    }

  } else {
    // Revert color of all nodes if mouse pointer is not over a node
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      node.classList.remove('hovered_prereq');
      node.classList.remove('hovered');
    }

    while (altPrereqBox.firstChild) {
      altPrereqBox.removeChild(altPrereqBox.firstChild);
    }
    document.getElementById("altprereqs").classList.add('hidden');
    appended = false;
  }
});

/* Recursively add 'hovered' to ll prereqs */
function updateHovered(prerequisites) {
   for (let j = 0; j < prerequisites.length; j++) {
      const prerequisite = document.getElementById(prerequisites[j]);
      prerequisite.classList.add('hovered_prereq');
      if (prerequisite.dataset.prerequisites.length != 0) {
         updateHovered(prerequisite.dataset.prerequisites.split(','));
      }
   }
}