const nodes = document.getElementsByClassName('node');

// Add event listener for mousemove event on the body element
document.body.addEventListener('mousemove', (event) => {
  const target = event.target;
  
  // Check if the mouse pointer is over a node
  if (target.classList.contains('node')) {
    target.classList.add('hovered');
    // Perform actions when mouse pointer is over the node
    // e.g. change color, update UI, etc.
    
    // Get prerequisites of the hovered node
    const prerequisites = target.dataset.prerequisites.split(','); // Assuming prerequisites are stored as a comma-separated string in the 'data-prerequisites' attribute
    
    // Change color of prerequisites
    updateHovered(prerequisites);

  } else {
    // Revert color of all nodes if mouse pointer is not over a node
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      node.classList.remove('hovered');
    }
  }
});

function updateHovered(prerequisites) {
   for (let j = 0; j < prerequisites.length; j++) {
      const prerequisite = document.getElementById(prerequisites[j]);
      prerequisite.classList.add('hovered');
      if (prerequisite.dataset.prerequisites.length != 0) {
         updateHovered(prerequisite.dataset.prerequisites.split(','));
      }
   }
}