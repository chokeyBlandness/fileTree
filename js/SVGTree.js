svgTree=function(dataJsonObject){
	d3.select("body").select("#treeSVG").select("svg").remove()
var margin = [20, 120, 20, 120],
	    width = document.getElementById("treeSVG").offsetWidth,
	    height = document.getElementById("treeSVG").offsetHeight; 
	      
	var i = 0,  
	    duration = 750,  
	    root;  
	  
	var tree = d3.layout.tree()  
	    .size([height, width]);  
	  
	var diagonal = d3.svg.diagonal()  
	    .projection(function(d) { return [d.x, d.y]; });  
	  
	var zoom = d3.behavior.zoom().scaleExtent([0.1, 100]).on("zoom", zoomed);//添加放大缩小事件
	  
	var svg = d3.select("body").select("#treeSVG").append("svg")
	.call(zoom)//给svg绑定zoom事件
	  .append("g")  
	  .call(zoom)//给g绑定zoom事件
	  .append("g")
	    .attr("transform", "translate(" + margin[0] + "," + margin[3] + ")");  

      if(dataJsonObject.length==0){
		  dataJsonObject=[{"id":"-1","name": "", "url": "", "children": []}]
	  }
	  root = dataJsonObject[0];  
	  root.x0 = height / 2;  
	  root.y0 = 0;  
	  
	  function collapse(d) {  
	    if (d.children&&d.children.length>0) {  //add length judgement
	      d._children = d.children;  
	      d._children.forEach(collapse);  
	      d.children = null;  
	    }  
	  }  
	  
	  root.children.forEach(collapse);  
	  update(root);  
	  
	function zoomed() {
	    svg.attr("transform",
	        "translate(" + zoom.translate() + ")" +
	        "scale(" + zoom.scale() + ")"
	    );
	}
	  
	function update(source) {  
	  
	  // Compute the new tree layout.  
	  var nodes = tree.nodes(root).reverse(),  
	      links = tree.links(nodes);  
	  
	  // Normalize for fixed-depth.  
	  nodes.forEach(function(d) { d.y = d.depth * 90; });  
	  
	  // Update the nodes…  
	  var node = svg.selectAll("g.node")  
	      .data(nodes, function(d) { return d.id || (d.id = ++i); });  
	  
	  // Enter any new nodes at the parent's previous position.  
	  var nodeEnter = node.enter().append("g")  
	      .attr("class", "node")  
	      .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })  
	      .on("click", click); 
	  
	  nodeEnter.append("circle")  
		  .attr("r",1e-6)
		  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });  
		  
	  nodeEnter.append("text")  
	      .attr("y", function(d) { return d.children || d._children ? -15 : 15; })  
	      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })  
	      .text(function(d) { return d.name; })  
		  .style("fill-opacity", 1e-6)
		  .style("font-size","12px");  
	  
	  var nodeUpdate = node.transition()  
	      .duration(duration)  
	      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });  
	  
	  nodeUpdate.select("circle")  
		  .attr("r", 5)
	      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });  
	  
	  nodeUpdate.select("text")  
	      .style("fill-opacity", 1);  
	  
	  var nodeExit = node.exit().transition()  
	      .duration(duration)  
	      .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })  
	      .remove();  
	  
	  nodeExit.select("circle")  
		  .attr("r",1e-6);  
	  
	  nodeExit.select("text")  
	      .style("fill-opacity", 1e-6);  
	  
	  var link = svg.selectAll("path.link")  
	      .data(links, function(d) { return d.target.id; });  
	  
	  link.enter().insert("path", "g")  
	      .attr("class", "link")  
	      .attr("d", function(d) {  
	        var o = {x: source.x0, y: source.y0};  
	        return diagonal({source: o, target: o});  
	      });  
	    
	  link.transition()  
	      .duration(duration)  
	      .attr("d", diagonal);  
	    
	  link.exit().transition()  
	      .duration(duration)  
	      .attr("d", function(d) {  
	        var o = {x: source.x, y: source.y};  
	        return diagonal({source: o, target: o});  
	      })  
	      .remove();  
	   
	  nodes.forEach(function(d) {  
	    d.x0 = d.x;  
	    d.y0 = d.y;  
	  });  
	}  
	  
	function click(d) {  
	  if (d.children&&d.children.length>0) {//add length judgement  
	    d._children = d.children;  
	    d.children = null;  
	  } else {  
	    d.children = d._children;  
	    d._children = null;  
	  }  
	  update(d);  
    }  
}
// svgTree();