///http://www.jq22.com/jquery-info10461
$(document).ready(function () {

    //original data(can get from server)
    var infos=[
        {id:"1",name: "a", url: "",
         children: [{ id: "3", name: "b", url: "", 
                        children: [{ id: "6", name: "e", url: "", children: []},{ id: "7", name: "f", url: "", children: []}]}]},
        {id:"4",name:"c",url:"",children:[{ id: "5", name: "d", url: "", children: []}]}
    ]
    //make the data have the root node
    infos=[{id:"-1",name: "index", url: "",children:infos}]
    //the data used to show the trees
    dataInfos=JSON.parse(JSON.stringify(infos))

    //transform original data to the data used in the treeView
    function buildTreeTableData() {
    var data = [];
    function walk(nodes, data) {
        if (!nodes) { return; }
        $.each(nodes, function (id, node) {
            var obj = {
                id:node.id,
                text: node.name,
                href:node.url,
                tags: [node.children.length]
            };
            if (node.children.length > 0) {
                obj.nodes = [];
                walk(node.children, obj.nodes);
            }
            data.push(obj);
        });
    }
    walk(dataInfos, data);
    console.log(data)
    return data;
    }

    //treeView options
    var options={
        bootstrap2:false,
        showTags:true,
        enableLinks:true,
        levels:3,
        data: buildTreeTableData(),
        onNodeSelected:function(event,node){
            var result=searchTreeData(infos,node.id)
            result=JSON.parse(JSON.stringify(result))
            svgTree(result)
        }
    };

    //make the "treeView" show
    $("#treeTableView").treeview(options)
    svgTree(dataInfos)

    //search the tree's node through node's id
    searchTreeData=function(dataNodes,nodeId){
        for(var i in dataNodes){
            if(dataNodes[i].id==nodeId){
                return [dataNodes[i]]
            }
            var childrenResult=searchTreeData(dataNodes[i].children,nodeId)
            if(childrenResult.length>0){
                return childrenResult;
            }
        }
        return [];
    }

});


