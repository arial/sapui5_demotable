// init app

//jQuery.sap.log.setLevel(jQuery.sap.log.LogLevel['DEBUG']);


sap.ui.localResources("mytesttable");
var view = sap.ui.view({id:"vwDictList", viewName:"mytesttable.TreeTableView", type:sap.ui.core.mvc.ViewType.JS});


var oShell;
var useShell = false;
if(useShell){
	oShell = new sap.ui.ux3.Shell("MainShell", {
		appTitle: "Демо-приложение для справочников"
	});
	oShell.setContent(view);
}else{
	oShell = new sap.ui.commons.layout.VerticalLayout("MainShell",{
		width: "70%"
	});
	oShell.addContent(view);
}
oShell.placeAt("content");




// common functions
/**
 * @param sViewId - ID экрана
 * @param sViewName - имя экрана
 * @param sTargetPlug - название метода контроллера вызываемого экрана, который играет роль входного плага (идея аналогична WD-плагам)
 * @param oEvent - объект события
 * @param oModel - объект модели для установки этой модели в вызываемом экране
 * @param oParams - дополнительные параметры (необязательно)
 */
function navigate(sViewId, sViewName, sTargetPlug, oEvent, oModel, oParams){
	//TODO: name of shell should be passed by parameter or set by constant
	console.log("Firing plug '" + sTragetPlug + "' for view (ID = '" + sViewId+"')");
	var oShell = sap.ui.getCore().byId("MainShell");
	var oView = sap.ui.getCore().byId(sViewId);
	var oCtrl = null;
    // instantiate the content view if it doesn't exist yet
	if (!oView) {
	    oView = sap.ui.view({
			type : sap.ui.core.mvc.ViewType.JS,
			id : sViewId,
			viewName : sViewName
	    });

	}

	if(oView != null){
	    if(oModel){
	    	// bind it to the same model
		    oView.setModel(oModel);	    	
	    }
		oCtrl = oView.getController();
		if(oCtrl != null){
			// Navigate to the content view
			if(oParams){
				oCtrl[sTargetPlug](oEvent, oParams);
			}else{
				oCtrl[sTargetPlug](oEvent);
			}
			// show the view
			oShell.destroyContent();
			oShell.addContent(oView, true);
			return oCtrl;
		}else{
			console.error("Unable to get controller of view (ID='" + sViewId + "')!");
			return null;
		}
	}else{
		console.error("Unable to find/init view (ID='" + sViewId + "')!");
		return null;
	}
}


function myClone(obj){
	if(obj == null || typeof(obj) != 'object') {
		return obj;
	}
	var temp = {};
	for(var key in obj){
		temp[key] = myClone(obj[key]);
	}
	return temp;
}