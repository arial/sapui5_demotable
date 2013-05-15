function TreeDAO(){
}

// при попытке присвоить какому-нибудь из атрибутов null возникает ошибка TypeError: j is null
//TreeDAO.prototype.data =  [
//          			{id: 1, name: "Группа 1!", checked: false, count: 20, parentId: "", children: []},
//    				{id: 2, name: "Группа 2", checked: false, count: 25, parentId: "", children: []},
//    				{id: 21, name: "Группа 21", parentId: 2, children: []},
//    				{id: 211, name: "Группа 211", parentId: 21, children: []},
//    				{id: 212, name: "Группа 212", parentId: 21, children: []},
//    				{id: 213, name: "Группа 213", parentId: 21, children: []},
//    				{id: 22, name: "Группа 22s", parentId: 2, children: []},
//    				{id: 3, name: "Группа 3", checked: false, parentId: "", count: 18, children: []},
//    				{id: 4, name: "Группа 4", checked: false, parentId: "", count: 20, children: []},
//    				{id: 5, name: "Группа 5", checked: false, parentId: "", count: 23, children: []}
//];


TreeDAO.prototype.data =  [
                 			{id: 1, name: "Группа 1", checked: false, count: 20, parentId: "", isLeaf: true, children: []},
           				{id: 2, name: "Группа 2", checked: false, count: 25, parentId: "", isLeaf: false, children: [
           				        {id: 21, name: "Группа 21", parentId: 2, isLeaf: false, children: [
           				                 {id: 211, name: "Группа 211", parentId: 21, count: 5, isLeaf: true, children: []},
           					        	 {id: 212, name: "Группа 212", parentId: 21, count: 12, isLeaf: true, children: []},
           					        	 {id: 213, name: "Группа 213", parentId: 21, count: 0, isLeaf: true, children: []},
           					    ]},
           					    {id: 22, name: "Группа 22", parentId: 2, count: 24, isLeaf: true, children: []}
           				]},
           				{id: 3, name: "Группа 3", checked: false, parentId: "", count: 18, isLeaf: true, children: []},
           				{id: 4, name: "Группа 4", checked: false, parentId: "", count: 20, isLeaf: false, children: [
           				    {id: 41, name: "Группа 41", parentId: 4, count: 35, isLeaf: true, children: []},
							{id: 42, name: "Группа 42", parentId: 4, count: 24, isLeaf: true, children: []}
           				                                                                                             ]},
           				{id: 5, name: "Группа 5", checked: false, parentId: "", count: 23, isLeaf: true, children: []}
       ];


TreeDAO.prototype.indexData = {
	"1": TreeDAO.prototype.data[0],
	"2": TreeDAO.prototype.data[1],
	"3": TreeDAO.prototype.data[2],
	"4": TreeDAO.prototype.data[3],
	"5": TreeDAO.prototype.data[4],
	"21": TreeDAO.prototype.data[1]["children"][0],
	"22": TreeDAO.prototype.data[1]["children"][1],
	"211": TreeDAO.prototype.data[1]["children"][0]["children"][0],
	"212": TreeDAO.prototype.data[1]["children"][0]["children"][1],
	"213": TreeDAO.prototype.data[1]["children"][0]["children"][2]
};


TreeDAO.prototype.save = function(oDictData, bIsEdit){
	console.log("Enter to TreeDao.save()");
	var iDictId = oDictData.id;
	if(bIsEdit){
		console.log("Try to modify data...");
		var oRec = this.findById(iDictId);
		if(oRec != null){
			oRec = oDictData;
		}else{
			console.error("Data not found for id = "+iDictId);
		}
	}else{
		var sParentId = oDictData.parentId;
		console.log("Try to save new data...");
		console.log("ParentId = "+sParentId);
		var oData = null;
		if(sParentId == ""){
			// это элемент верхнего уровня
			oData = this.data;
		}else{
			oData = this.findById(sParentId);
		}
		if(oData != null){
			oDictData.id = this.createId();
			oData.push(oDictData);
			this.rebuildIndex();
		}else{
			console.error("Data not found for parentId = "+sParentId);
		}
	}
	console.log(this.indexData);
	console.log(this.data);
	console.log("Exit from TreeDao.save()");
},


TreeDAO.prototype.recalcCount = function(){
	for(var i = 0; i < this.data.length; i++){
		var oData = this.data[i];
		if(oData.children !== undefined && oData.children.length > 0){
			var sum = this.recalcCountDeep(oData.children);
			oData.count = sum;
			//console.log("oData.name: " + oData.name + " count: " + oData.count);
		}
	}
},


TreeDAO.prototype.recalcCountDeep = function(oData){
	var total = 0;
	for(var i = 0; i < oData.length; i++){
		var oElemData = oData[i];
		if(oElemData.children !== undefined && oElemData.children.length > 0){
			// есть нижележащие ветки - посчитаем их
			var sum = this.recalcCountDeep(oElemData.children);
			total += sum;
			//console.log("oElemData.name: " + oElemData.name + " sum: " + sum);
			oElemData.count = sum;
		}else{
			// нижележащих веток нет - приплюсуем значение к итогу
			//console.log("oElemData.name: " + oElemData.name + " count: " + oElemData.count);
			total += oElemData.count;
		}
	}
	return total;
},


TreeDAO.prototype.rebuildIndex = function(){
	this.indexData = {};
	for(var i = 0; i < this.data.length; i++){
		var oData = this.data[i];
		this.indexData[""+oData.id] = oData;
		if(oData.children !== undefined){
			this.rebuildIndexDeep(oData.children);
		}
	}
},


TreeDAO.prototype.rebuildIndexDeep = function(oData){
	for(var i = 0; i < oData.length; i++){
		var oElemData = oData[i];
		this.indexData[""+oElemData.id] = oElemData;
		if(oElemData.children !== undefined){
			this.rebuildIndexDeep(oElemData.children);
		}
	}
},


TreeDAO.prototype.deleteRec = function(iId){
	var i = this.getRecNumberById(iId);
	if(i != -1){
		this.data.splice(i, 1);
	}
},


TreeDAO.prototype.createModel = function(){
	var oData = {id: 0, name: "", checked: false, count: 0, isLeaf: true, parentId: "", children: []};
	return oData;
},


TreeDAO.prototype.read = function(sId){
	if(sId == null){
		return this.data;
	}else{
		var oRec = this.findById(sId);
		return myClone(oRec);
	}
},


TreeDAO.prototype.findById = function(iId){
	if(iId == null || !this.data){
		return null;
	}
	var sId = iId.toString();
	return this.indexData[sId];
//	for ( var i = 0; i < this.data.length; i++) {
//		var oRec = this.data[i];
//		if(sId.toString() == oRec.id.toString()){
//			return oRec;
//		}
//	}
//	return null;
},


TreeDAO.prototype.getRecNumberById = function(sId){
	if(sId == null || !this.data ){
		return -1;
	}
	for ( var i = 0; i < this.data.length; i++) {
		var oRec = this.data[i];
		if(sId.toString() == oRec.id.toString()){
			return i;
		}
	}
	return -1;
},


TreeDAO.prototype.createId = function(){
	var maxId = -1;
	for ( var i = 0; i < this.data.length; i++) {
		var oRec = this.data[i];
		if(maxId < oRec.id){
			maxId = oRec.id;
		}
	}
	if(maxId == -1){
		maxId = 0;
	}
	return ++maxId;
}

;