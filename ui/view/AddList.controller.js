sap.ui.core.mvc.Controller.extend("kgorin.shoplist.view.AddList", {

	oAddListFormAlertDialog : null,
	oAddListSuccessDialog : null,
	oAddListErrorDialog : null,

	onInit : function() {
		this.getView().setModel(new sap.ui.model.json.JSONModel(), "newHeaderModel");
		this.initializeNewEventData();
	},

	initializeNewEventData : function() {
		var newHeaderModel = this.getView().getModel("newHeaderModel");
		newHeaderModel.setData({
			Details: {
				description: "",
				date : null
			}
		});
	},
	
	checkIfAllEventPropertiesDefined : function() {
		var newHeaderModel = this.getView().getModel("newHeaderModel");

		if (newHeaderModel.getProperty("/Details/description")!== ""
				&& newHeaderModel.getProperty("/Details/date")!== ""
				&& newHeaderModel.getProperty("/Details/date")!== null ) {
			return true;
		} else {
			return false;
		}
	},

	onSubmit : function() {
		if (this.checkIfAllEventPropertiesDefined()) {
			var newHeaderModel = this.getView().getModel("newHeaderModel");
			var	eventDescr =  newHeaderModel.getProperty("/Details/description");
			var	eventDate =  newHeaderModel.getProperty("/Details/date");
			eventDate.setTime(eventDate.getTime() + (23*60*60*1000)); //otherwise it's off by server time zone...
			//TODO answers.sap.com/questions/205026/index.html

				
			var newHeader = {};
			newHeader.ShoplistID = 1; // this id will be replaced on server by a generated one
			newHeader.UserID = ' '; // this id will be replaced on server by current user
			newHeader.Description = eventDescr;
			newHeader.Date = eventDate.toISOString();//'2013-05-01T01:02:03.000Z';
			
			var oDataModel = this.getView().getModel();

			oDataModel.create("/Header", newHeader, {
				success : jQuery.proxy(function(mResponse) {
					this.successMsg();
					this.onCancel();
				}, this),
				error : jQuery.proxy(function() {
					this.errorMsg();
				}, this)
			});
		}else{
			if (!this.oAddListFormAlertDialog) {
				this.oAddListFormAlertDialog = sap.ui.xmlfragment("kgorin.shoplist.view.AddListFormAlertDialog", this);
				this.getView().addDependent(this.oAddListFormAlertDialog);
			}
			this.oAddListFormAlertDialog.open();
		}
	},

	successMsg : function(newEventTitle) {
		if (!this.oAddListSuccessDialog) {
			this.oAddListSuccessDialog = sap.ui.xmlfragment("kgorin.shoplist.view.AddListSuccessDialog", this);
			this.getView().addDependent(this.oAddListSuccessDialog);
		}
		this.oAddListSuccessDialog.open();
	},

	errorMsg : function() {
		if (!this.oAddListErrorDialog) {
			this.oAddListErrorDialog = sap.ui.xmlfragment("kgorin.shoplist.view.AddListErrorDialog", this);
			this.getView().addDependent(this.oAddListErrorDialog);
		}
		this.oAddListErrorDialog.open();
	},
	
	selectNewEventInMasterView : function(newEventTitle) {
		if(newEventTitle){
			var oEventsList = sap.ui.getCore().byId("__xmlview1").byId("list");
			var items = oEventsList.getItems();

			for (var int = 0; int < items.length; int++) {
				if(items[int].getProperty("title")===newEventTitle){
					oEventsList.setSelectedItemById(items[int].getId());
					return;
				}
			}
		}
	},
	
	onCancel : function() {
		this.initializeNewEventData();
		sap.ui.core.UIComponent.getRouterFor(this).backWithoutHash(this.getView());
	},

	dialogCloseButton : function(oEvent) {
		oEvent.getSource().getParent().close();
	}

});

