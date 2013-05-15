sap.ui.jsview("mytesttable.TreeTableView", {

      getControllerName : function() {
         return "mytesttable.TreeTableView";
      },

      createContent : function(oController) {
    	  var oView = this;
    	  //Create an instance of the table control
    	  var oTable = new sap.ui.table.TreeTable("TreeTable", {
    		  columns: [
    		            new sap.ui.table.Column({label: "Имя", template: "name"}),
    		            new sap.ui.table.Column({label: "Количество",
    		            	template: new sap.ui.commons.InPlaceEdit( {
    		            		content: new sap.ui.commons.TextField( { value: { path: "/count", type: new sap.ui.model.type.Integer() }, editable: "{isLeaf}" } )
    		            	})
    		            })
    		  ],
    		  selectionMode: sap.ui.table.SelectionMode.Single,
    	      allowColumnReordering: true,
    	      expandFirstLevel: true,
    	      toggleOpenState: function(oEvent) {
//    	    	  var iRowIndex = oEvent.getParameter("rowIndex");
//    	    	  var oRowContext = oEvent.getParameter("rowContext");
//    	    	  var bExpanded = oEvent.getParameter("expanded");
//    	    	  var oTable = sap.ui.getCore().getElementById("TreeTable");
//    	    	  var oObj = oTable.getContextByIndex(iRowIndex);
//    	    	  console.log(oObj);
//    	    	  console.log(oObj.getPath());
//    	    	  alert("rowIndex: " + iRowIndex + 
//    	    			  "; rowContext: " + oRowContext.getPath() + 
//    	    			  "; expanded? " + bExpanded);
    	      }
    	  });

    	  
    	  // table toolbar
    	  var oTblToolbar = new sap.ui.commons.Toolbar("TblToolbar");
    	  oTblToolbar.addItem( new sap.ui.commons.Button({
        	  id : "AddBtn", // sap.ui.core.ID
        	  text : 'Добавить', // string
        	  style : sap.ui.commons.ButtonStyle.Default, // sap.ui.commons.ButtonStyle
        	  press : function() { oView.createInputDialog(oController); }
          }) );
//    	  oTblToolbar.addItem( new sap.ui.commons.Button({
//        	  id : "EditBtn", // sap.ui.core.ID
//        	  text : 'Изменить', // string
//        	  style : sap.ui.commons.ButtonStyle.Default, // sap.ui.commons.ButtonStyle
//        	  press : function() { oController.onBtnEditPressed(); }
//          }) );
    	  oTblToolbar.addItem( new sap.ui.commons.Button({
        	  id : "DeleteBtn", // sap.ui.core.ID
        	  text : 'Удалить', // string
        	  style : sap.ui.commons.ButtonStyle.Default, // sap.ui.commons.ButtonStyle
        	  press : function() { oController.onAskToDelete(); }
          }) );
    	  oTable.setToolbar(oTblToolbar);
    	  
    	  
    	  var oThemeCombobox = new sap.ui.commons.ComboBox( {
    	        items: [new sap.ui.core.ListItem("sap_goldreflection",{text: "Gold reflection", key: "sap_goldreflection"}),
  	                new sap.ui.core.ListItem("sap_hcb",{text: "High Contrast Black", key: "sap_hcb"}),
  	                new sap.ui.core.ListItem("sap_platinum",{text: "Platinum", key: "sap_platinum"}),
  	                new sap.ui.core.ListItem("sap_ux",{text: "Ux Target Design", key: "sap_ux"})],
  	        selectedKey: "sap_platinum",
  	        tooltip: new sap.ui.commons.RichTooltip( {title: "Информация", text:"Выберите одну из 4 предлагаемых SAP тем оформления внешнего вида приложения."}), 
  	        change: function(oEvent){
  	        		var oKey = oEvent.oSource.getSelectedKey();
  	        		sap.ui.getCore().applyTheme(oKey);  
  	        	}
  	        });
      	  
      	  
      	  var oMLayout = new sap.ui.commons.layout.MatrixLayout({ layoutFixed : false, columns: 2, width: "100%" });
      	  oMLayout.createRow(
      			  new sap.ui.commons.TextView({text: "Это - пример, демонстрирующий некоторые возможности фреймворка SAP UI5.\n" +
      			  		"Данный пример рассматривает в своей работе такие рутинные операции, " +
      			  		"как создание, изменение и удаление записей в табличных данных.\n" +
      			  		"Для некоторых контрольных элементов, как, например, для \"Текущей темы оформления\" предусмотрены всплывающие подсказки.\n" +
      			  		"При необходимости для увеличения размеров шрифтов можно изменить масштаб представления страницы.\n" +
      			  		"Пример не использует в своей работе какую-либо базу данных, поэтому никакие реальные данные в ходе его работы повреждены не будут.\n" +
      			  		"Для корректной работы данного примера необходим браузер IE версии не ниже 9.0 или Firefox версии не ниже 10."}),
      			  new sap.ui.commons.layout.MatrixLayoutCell({
      		  hAlign : sap.ui.commons.layout.HAlign.Right, // sap.ui.commons.layout.HAlign
      		  vAlign: sap.ui.commons.layout.VAlign.Top,
      		  content : [ new sap.ui.commons.layout.HorizontalLayout({
      			  content:[ new sap.ui.commons.Label({text: "Текущая тема оформления:", labelFor: oThemeCombobox}), oThemeCombobox ]
      		  }) ]
      	  }));
      	  
      	  
      	  var oVertLayout = new sap.ui.commons.layout.VerticalLayout( {
      		  content: [oMLayout, oTable]
      	  });
      	  
      	  
      	  this.addContent(oVertLayout);
      	  
      	  var oNotifBar = new sap.ui.ux3.NotificationBar("NotifBar", {
      		  visibleStatus : sap.ui.ux3.NotificationBarStatus.None, // sap.ui.ux3.NotificationBarStatus
      		  resizeEnabled : false, // boolean
      	  });
      	  this.addContent(oNotifBar);
    	  
      },
      
      
      
      createInputDialog: function(oController){
    	  var oCore = sap.ui.getCore();
    	  var oModel = oCore.getModel("MyTreeModel");
    	  var oDictData = null;
    	  // в WDJ мы бы создавали новую bean-модель и биндили ее на ноду. Здесь - своего рода аналог.
    	  oDictData = new TreeDAO().createModel();
    	  // Биндим данные на модель для формы ввода
    	  oModel.setProperty("/treeDictData", oDictData);
    	  
    	  
    	  var oDialog = new sap.ui.commons.Dialog("Dialog", {
              modal: true,
              closed: function(oControlEvent){
            	  oCore.getElementById('Dialog').destroy();
              }
    	  });
    	  oDialog.setTitle("Новая запись");
    	  
    	  // Create a layout to place the controls in the dialog 
    	  var oLayout = new sap.ui.commons.layout.MatrixLayout({
    	          columns: 2, 
    	          width: "100%"
    	  });

    	  // Create text field for the name
    	  var oTF = new sap.ui.commons.TextField("inputDictName", {
    		  value: "{/treeDictData/name}",
    		  tooltip: 'Название', 
    		  editable: true, 
    		  width: '200px'
    	  });
    	  oTF.setModel(oModel);

    	  // Label for the name field
    	  var oLabel = new sap.ui.commons.Label("inputDictName_label", {
    		  text: 'Название:', 
    		  labelFor: oTF
    	  });

    	  // Create the first row
    	  oLayout.createRow(oLabel, oTF);

    	  // Create text field for the Quantity
    	  oTF = new sap.ui.commons.TextField("inputDictCount", {
    		  value: "{/treeDictData/count}",
    		  tooltip: 'Количество', 
    		  editable: true, 
    		  width: '100px'
    	  });
    	  oTF.setModel(oModel);
    	  

    	  // Label for the Qty field
    	  oLabel = new sap.ui.commons.Label("inputDictCount_label", {
    		  text: 'Количество:', 
    		  labelFor: oTF
    	  });

    	  // Create the third row
    	  oLayout.createRow(oLabel, oTF);

    	  // Add the layout to the dialog
    	  oDialog.addContent(oLayout);
    	  
    	  // Add a button to post the contact's data to the REST interface
    	  oDialog.addButton( new sap.ui.commons.Button( {text: "Сохранить", press:function(){
    		  oController.onSaveBtnPressed();
    		  // Close the Dialog
    		  oCore.getElementById('Dialog').close();
    	  }}));
    	  
    	  
    	  oDialog.addButton( new sap.ui.commons.Button( {text: "Отмена", press:function(){  
    		  // Close the Dialog
    		  oCore.getElementById('Dialog').close();
    	  }}));
    	  oDialog.open();
      }
});
