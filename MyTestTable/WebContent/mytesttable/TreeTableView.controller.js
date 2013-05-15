sap.ui.controller("mytesttable.TreeTableView", {


/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
*/
	onInit: function() {
		var oCore = sap.ui.getCore();
		this.refreshData();
		var oModel = this.getMyModel();
		// т.к. onInit() вызывается всегда, то этот биндинг должен выполняться всегда
		// во View его сделать не получается, т.к. метод из вьюхи выполняется раньше, чем этот метод
		var oTable = oCore.getElementById("TreeTable");
		oTable.setModel(oModel);
		oTable.bindRows("/modelData");
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
*/
//   onBeforeRendering: function() {
//
//   },

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
*/
//   onAfterRendering: function() {
//
//   },

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
*/
//   onExit: function() {
//
//   }
	
	
	onAskToDelete: function(oEvent){
		var oCore = sap.ui.getCore();
		var oTable = oCore.getElementById("TreeTable");
		var idx = oTable.getSelectedIndex();
		if(idx == -1){
//			var now = (new Date()).toUTCString();
//			var oMsg = new sap.ui.core.Message({
//				level : sap.ui.core.MessageType.Error, // sap.ui.commons.MessageType
//				text : "Необходимо выбрать элемент для удаления!",
//				timestamp : now
//			});
//			this.showMessage("", oMsg, true);
		}else{
			var oCtrl = this;
			sap.ui.commons.MessageBox.confirm("Удалить выделенный элемент?", function(bResult) { oCtrl.onDelete(bResult); }, "Запрос подтверждения");
		}
	},
	
	
	onDelete: function(bResult){
		if(bResult){
			var oCore = sap.ui.getCore();
			var oTable = oCore.getElementById("TreeTable");
			var idx = oTable.getSelectedIndex();
			if(idx != -1){
				var sPath = oTable.getContextByIndex(idx).getPath();
				var oModel = this.getMyModel();
				var oData = oModel.getProperty(sPath);
				new TreeDAO().deleteRec(oData.id);
//				var now = (new Date()).toUTCString();
//				var oMsg = new sap.ui.core.Message({
//					level : sap.ui.core.MessageType.Success, // sap.ui.commons.MessageType
//					text : "Элемент удален.",
//					timestamp : now
//				});
//				this.showMessage("", oMsg, true);
//				this.refreshData();
			}
		}
	},
	
	
	onSaveBtnPressed: function(oEvent){
		var oCore = sap.ui.getCore();
		// значение из поля ввода уже "сидит" в модели
		var oModel = oCore.getModel("MyTreeModel");
		var oDict = oModel.getProperty("/treeDictData");
		this.saveData(oDict);
		this.refreshData();
	},
	
	
	refreshData: function(){
	   console.log("Begin refresh data...");
	   var oCore = sap.ui.getCore();
	   var aData = this.readData(null);
	   var oModel = this.getMyModel();
	   if(oModel == null){
		   // этот блок выполняется только при старте приложения,
		   // если, конечно, эта модель где-то в приложении не будет ВНЕЗАПНО удалена
		   //console.log("Init MyModel!");
		   oModel = new sap.ui.model.json.JSONModel();
	   }
	   oModel.setProperty("/modelData", aData);
	   oCore.setModel(oModel, "MyTreeModel");
	   console.log("End refresh data.");
	},
	
	
	getMyModel: function(){
		var oCore = sap.ui.getCore();
		// мы дали название модели - MyModel в методе onInit()
		//TODO: имена моделей лучше сделать константами
		return oCore.getModel("MyTreeModel");
	},
	
	
	saveData: function(oData){
		var oDao = new TreeDAO();
		oDao.save(oData, oData.id != "");
	},
	
	readData: function(sId) {
	   var oDao = new TreeDAO();
	   oDao.recalcCount();
	   return oDao.read(sId);
	}
});