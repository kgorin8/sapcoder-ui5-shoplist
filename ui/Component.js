jQuery.sap.declare("kgorin.shoplist.Component");
jQuery.sap.require("kgorin.shoplist.MyRouter");

sap.ui.core.UIComponent
	.extend(
		"kgorin.shoplist.Component", {

			metadata: {
				name: "Shoplist Demo App",
				version: "0.9",
				includes: [],
				dependencies: {
					libs: ["sap.m", "sap.ui.layout"],
					components: []
				},
				rootView: "kgorin.shoplist.view.App",
				config: {
					resourceBundle: "i18n/textBundle.properties",
					serviceConfig: {
						name: "EventReviewsService",
						//serviceUrl : "proxy/odataservicedest"
						//serviceUrl : "../services/KGORIN.xsodata"
						serviceUrl: "../../../kgorin/shoplist/services/secure_data.xsodata"
					}
				},

				routing: {
					config: {
						routerClass: "kgorin.shoplist.MyRouter",
						viewType: "XML",
						viewPath: "kgorin.shoplist.view",
						targetAggregation: "detailPages",
						clearTarget: false
					},
					routes: [{
						pattern: "",
						name: "main",
						view: "Master",
						targetAggregation: "masterPages",
						targetControl: "idAppControl",
						subroutes: [{
							pattern: "{evt}/:tab:",
							name: "evt",
							view: "Detail"
								}]
							}, {
						name: "catchallMaster",
						view: "Master",
						targetAggregation: "masterPages",
						targetControl: "idAppControl",
						subroutes: [{
							pattern: ":all*:",
							name: "catchallDetail",
							view: "NotFound"
								}]
							}]
				}
			},

			init: function() {

				sap.ui.core.UIComponent.prototype.init.apply(this,
					arguments);

				var mConfig = this.getMetadata().getConfig();

				// always use absolute paths relative to our own
				// component
				// (relative paths will fail if running in the Fiori
				// Launchpad)
				var rootPath = jQuery.sap
					.getModulePath("kgorin.shoplist");

				// set i18n model
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: [rootPath,
											mConfig.resourceBundle].join("/")
				});
				this.setModel(i18nModel, "i18n");

				// Create and set domain model to the component
				var sServiceUrl = mConfig.serviceConfig.serviceUrl;
				var oModel = new sap.ui.model.odata.ODataModel(
					sServiceUrl);
					oModel.setDefaultBindingMode("TwoWay");
				this.setModel(oModel);

				// set device model
				var deviceModel = new sap.ui.model.json.JSONModel({
					isTouch: sap.ui.Device.support.touch,
					isNoTouch: !sap.ui.Device.support.touch,
					isPhone: sap.ui.Device.system.phone,
					isNoPhone: !sap.ui.Device.system.phone,
					listMode: sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
					listItemType: sap.ui.Device.system.phone ? "Active" : "Inactive"
				});
				deviceModel.setDefaultBindingMode("OneWay");
				this.setModel(deviceModel, "device");

				this.getRouter().initialize();

			}
		});