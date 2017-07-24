sap.ui.core.mvc.Controller.extend("kgorin.shoplist.view.AddItem", {

	oAddItemFormAlertDialog: null,
	oAddItemSuccessDialog: null,
	oAddItemErrorDialog: null,

	onInit: function() {
		this.getView().setModel(new sap.ui.model.json.JSONModel(), "newItemModel");
		this.initializeNewCommentData();
	},

	handleSuggest: function(oEvent) {
		var sTerm = oEvent.getParameter("suggestValue");
		var aFilters = [];
		if (sTerm) {
			aFilters.push(new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sTerm));
		}
		oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
	},

	initializeNewCommentData: function() {
		// TODO: find better solution
		//var currEventTitle = (sap.ui.getCore().byId("__xmlview1")).byId("list").getSelectedItem().getProperty("title");

		var newItemModel = this.getView().getModel("newItemModel");
		newItemModel.setData({
			Details: {
				name: "",
				quantity: 1
			}
		});
	},

	checkIfAllCommentPropertiesDefined: function() {
		var newItemModel = this.getView().getModel("newItemModel");

		if (newItemModel.getProperty("/Details/name") !== ""
		&& newItemModel.getProperty("/Details/quantity") > 0) {
			return true;
		} else {
			return false;
		}
	},

	onSubmit: function() {
		if (this.checkIfAllCommentPropertiesDefined()) {
			var bindPath = sap.ui.getCore().byId("__xmlview2").getElementBinding().sPath;
			var currListId = bindPath.substring(bindPath.indexOf("(") + 2, bindPath.indexOf(")") - 1);
			var newItemModel = this.getView().getModel("newItemModel");
			var name = newItemModel.getProperty("/Details/name");
			var quantity = newItemModel.getProperty("/Details/quantity");

			var nItem = {};
			nItem.ShoplistID = currListId;
			nItem.Item = 1;
			nItem.Name = name;
			nItem.Quantity = quantity;

			var oDataModel = this.getView().getModel();

			oDataModel.create("/Items", nItem, {
				success: jQuery.proxy(function(mResponse) {
					this.successMsg();
					this.onCancel();
				}, this),
				error: jQuery.proxy(function() {
					this.errorMsg();
				}, this)
			});
		} else {
			if (!this.oAddItemFormAlertDialog) {
				this.oAddItemFormAlertDialog = sap.ui.xmlfragment("kgorin.shoplist.view.AddItemFormAlertDialog", this);
				this.getView().addDependent(this.oAddItemFormAlertDialog);
			}
			this.oAddItemFormAlertDialog.open();
		}

	},

	successMsg: function() {
	    return;
		if (!this.oAddItemSuccessDialog) {
			this.oAddItemSuccessDialog = sap.ui.xmlfragment("kgorin.shoplist.view.AddItemSuccessDialog", this);
			this.getView().addDependent(this.oAddItemSuccessDialog);
		}
		this.oAddItemSuccessDialog.open();
	},

	errorMsg: function() {
		if (!this.oAddItemErrorDialog) {
			this.oAddItemErrorDialog = sap.ui.xmlfragment("kgorin.shoplist.view.AddItemErrorDialog", this);
			this.getView().addDependent(this.oAddItemErrorDialog);
		}
		this.oAddItemErrorDialog.open();
	},

	onCancel: function() {
		this.initializeNewCommentData();
		sap.ui.core.UIComponent.getRouterFor(this).backWithoutHash(this.getView());
	},

	dialogCloseButton: function(oEvent) {
		oEvent.getSource().getParent().close();
	}

});