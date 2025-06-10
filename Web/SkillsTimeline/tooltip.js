// Create tooltip
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "#f9f9f9")
    .style("border", "1px solid #d3d3d3")
    .style("padding", "8px")
    .style("border-radius", "4px")
    .style("visibility", "hidden")
    .style("font-size", "12px");

// Tooltip functions
function showTooltip(event, text) {
    tooltip.html(text)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px")
        .style("visibility", "visible");
}

function moveTooltip(event) {
    tooltip.style("left", (event.pageX + 10) + "px")
           .style("top", (event.pageY + 10) + "px");
}

function hideTooltip() {
    tooltip.style("visibility", "hidden");
}

// Export functions if using a module system, otherwise ensure they're in the global scope
window.showTooltip = showTooltip;
window.moveTooltip = moveTooltip;
window.hideTooltip = hideTooltip;
