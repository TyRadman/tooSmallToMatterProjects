function getTextWidth(text) {
    const padding = 10;       // Extra padding for the rectangle
    const charWidth = 8;      // Approximate width of each character (adjust as needed)
    return text.length * charWidth + padding * 2; // Calculate width based on text length
}

function getLeafWidth(amount) {
    const maxLeafWidth = 500;
    return amount * maxLeafWidth;
}

// Function to get the width based on whether the node has children
function getWidth(d) {
    return d.children ? getTextWidth(d.data.name) : getLeafWidth(d.data.amount);
}

// Define the spacing for nodes
const nodeHeight = 420; // Vertical space between levels
const nodeWidth = 40;  // Horizontal space between sibling nodes
const padding = 10;     // Padding inside the rectangles

// Convert data into a D3 hierarchy and layout the tree
const root = d3.hierarchy(data);
const treeLayout = d3.tree().nodeSize([nodeWidth, nodeHeight]);
treeLayout(root);

// Calculate the extent (bounding box) of all nodes to set the SVG dimensions
const nodes = root.descendants();
const xExtent = d3.extent(nodes, d => d.x);
const yExtent = d3.extent(nodes, d => d.y);

// Calculate SVG width and height based on the tree's bounding box
const svgWidth = yExtent[1] - yExtent[0] + nodeWidth * 18; // Add padding to the right side
const svgHeight = xExtent[1] - xExtent[0] + nodeHeight * 2; // Add padding on top and bottom

// Set up the SVG with calculated width and height, anchored to the left
const svg = d3.select("#treeSvg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("viewBox", [
        0, // Start from 0 on the x-axis to anchor root to the left
        xExtent[0] - nodeHeight / 2, // Center vertically
        svgWidth,
        svgHeight
    ]);

// Draw links between nodes
const link = svg.selectAll(".link")
    .data(root.links())
    .enter().append("path")
    .attr("class", "link")
    .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x))
    .style("fill", "none")
    .style("stroke", "#555")
    .style("stroke-width", "1.5px");

// Draw nodes as rectangles with centered text
const node = svg.selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.y},${d.x})`);

// Append rectangles as containers for each node, using CSS for fill color and hover effects
// Append rectangles as containers for each node, using CSS for fill color and hover effects
node.append("rect")
    .attr("width", d => getWidth(d)) // Use getWidth function to get width based on text length or amount
    .attr("height", 30) // Fixed height for rectangles
    .attr("x", d => d.children ? -(getWidth(d) / 2) : 0) // Center if it has children, align left if it's a leaf
    .attr("y", -15) // Center rectangle vertically around the node position
    .attr("rx", 5) // Rounded corners
    .attr("ry", 5)
    .attr("class", "node-rect")
    .style("fill", d => d.data.color)
    .style("pointer-events", d => d.children? "none" : "auto");

node.append("text")
    .attr("dy", 5) // Center text vertically
    .attr("x", d => d.children ? 0 : padding) // Center for parents, offset right by padding for leaves
    .style("text-anchor", d => d.children ? "middle" : "start")
    .style("fill", "white")
    .style("font-size", "12px")
    .text(d => d.data.name);

    const maxLeafWidth = getLeafWidth(1); // Maximum width for amount = 1
    const minLeafWidth = getLeafWidth(0); // Minimum width for amount = 0 (assuming it has a width)
    
    // Calculate positions for each threshold
    const thresholds = [0, 0.25, 0.5, 0.75, 1];
    const thresholdText = ["None", "Curiousity", "Good", "Advanced", "Proficient"];
    const offset = nodeHeight * 2;
    const positions = thresholds.map(threshold => offset + threshold * maxLeafWidth);
    
    // Append lines and labels for each threshold
    thresholds.forEach((threshold, i) => {
        const xPos = positions[i];
    
        // Draw vertical line for threshold
        svg.append("line")
            .attr("x1", xPos)
            .attr("y1", xExtent[0] - nodeHeight / 4) // Top of the tree
            .attr("x2", xPos)
            .attr("y2", xExtent[1] + nodeHeight / 2) // Bottom of the tree
            .attr("class", "level-line")
    
        // Add header label at the top of each line
        svg.append("text")
            .attr("x", xPos)
            .attr("y", xExtent[0] - nodeHeight / 4 - padding)
            .attr("text-anchor", "middle")
            .attr("class", "level-text")
            .text(thresholdText[i]);
    });
    
