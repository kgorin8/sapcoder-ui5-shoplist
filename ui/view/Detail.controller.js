sap.ui.core.mvc.Controller.extend("kgorin.shoplist.view.Detail", {

	onInit: function() {
		var oView = this.getView();

		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {
			// when detail navigation occurs, update the binding context
			if (oEvent.getParameter("name") === "evt") {

				var Event = "/" + oEvent.getParameter("arguments").evt;

				oView.bindElement(Event);

				// Check that the evt specified actually was found
				oView.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
					var oData = oView.getModel().getData(Event);
					if (!oData) {
						sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
							currentView: oView,
							targetViewName: "kgorin.shoplist.view.NotFound",
							targetViewType: "XML"
						});
					}
				}, this));

				// Make sure the master is here
				var oIconTabBar = oView.byId("idIconTabBar");
				/*				oIconTabBar.getItems().forEach(function(oItem) {
					oItem.bindElement(kgorin.shoplist.util.Formatter.uppercaseFirstChar(oItem.getKey()));
				});*/

				// Which tab?
				var sTabKey = oEvent.getParameter("arguments").tab || "ItemRef";
				if (oIconTabBar.getSelectedKey() !== sTabKey) {
					oIconTabBar.setSelectedKey(sTabKey);
				}

				// Make sure ... TODO
				var oReviewsList = oView.byId("idListNormal");
				oReviewsList.bindItems(oView.getElementBinding().sPath + "/ItemRef", oReviewsList.mBindingInfos.items.template);

				var oDoneList = oView.byId("idListDone");
				oDoneList.bindItems(oView.getElementBinding().sPath + "/ItemRef", oDoneList.mBindingInfos.items.template);

				/*				var oRatingIndicator = oView.byId("commentsRatingIndicatorId");
				oRatingIndicator.bindElement(oView.getElementBinding().sPath + "/StatusUpdate");
				var oNoRatingIndicator = oView.byId("noCommentsRatingIndicatorId");
				oNoRatingIndicator.bindElement(oView.getElementBinding().sPath + "/StatusUpdate");
				
				var oRatingText = oView.byId("commentsRatingTextId");
				oRatingText.bindElement(oView.getElementBinding().sPath + "/StatusUpdate");
				var oNoRatingText = oView.byId("noCommentsRatingTextId");
				oNoRatingText.bindElement(oView.getElementBinding().sPath + "/StatusUpdate");*/
			}
		}, this);
	},

	onDoneSelect: function() {
		console.log(this.getView().getModel());
		this.getView().getModel().submitChanges(function() {
				//this.getView().getModel().refresh();
				console.log("Update successful");
			},
			function() {
				console.log("Update failed");
			}
		);
	},

	onNavBack: function() {
		// This is only relevant when running on phone devices
		sap.ui.core.UIComponent.getRouterFor(this).myNavBack("main");
	},

	onDetailSelect: function(oEvent) {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("evt", {
			evt: oEvent.getSource().getBindingContext().getPath().slice(1),
			tab: oEvent.getParameter("selectedKey")
		}, true);

	},

	onAddItem: function() {

		this.initializeAddItemView();
		sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
			currentView: this.getView(),
			targetViewName: "kgorin.shoplist.view.AddItem",
			targetViewType: "XML",
			transition: "slide"
		});
	},

	initializeAddItemView: function() {
		// TODO: find better solution
		var xmlView3 = sap.ui.getCore().byId("__xmlview3");
		if (xmlView3 && xmlView3.sViewName == "kgorin.shoplist.view.AddItem") {
			xmlView3.getController().initializeNewCommentData();
		}
		var xmlView4 = sap.ui.getCore().byId("__xmlview4");
		if (xmlView4 && xmlView4.sViewName == "kgorin.shoplist.view.AddItem") {
			xmlView4.getController().initializeNewCommentData();
		}
	}
});