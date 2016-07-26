/**
 * Created by amos on 2016. 4. 12..
 */

var forEach = require('lodash/forEach');
var ObjectID = require('mongodb').ObjectID;
var shortid = require('shortid');
var wsconn = require('../wsconn');

var tempReadData = {
	"PrivilegeNumber": 0,
	"TemplateGroupName": "TemplateMap"
};

var tempCreateData = {
	"Template": {
		"Name": "hihiNewDTG",
		"Description": "",
		"PrivilegeNumbers": [],
		"PrivilegeNumber": 0,
		"TemplateGroupName": "TemplateMap"
	}
};

var tempUpdateData = {
	"Template": {
		"Name": "DEFAULT",
		"Description": "DEFAULT Modified Amos",
		"PrivilegeNumber": 0,
		"PrivilegeNumbers": [
			1
		],
		"TemplateGroupName": "TemplateMap",
		"LinkCondition": {},
		"Templates": [
			{
				"Entry": true,
				"Name": "Level1",
				"Description": "",
				"MapTemplateName": "TP_LV1",
				"MapName": "Warriors",
				"Initialize": "",
				"Finalize": "",
				"Skips": [
					""
				],
				"Arguments": {},
				"Template": [
					{
						"Name": "Root",
						"Macro": "getObjectByType",
						"Arguments": {
							"Type": "company"
						},
						"Children": [
							{
								"Name": "Category",
								"Macro": "getObjectsSameParent",
								"Arguments": {
									"Parent": "$P.Name"
								},
								"Children": [
									{
										"Name": "Service",
										"Macro": "getObjectsSameParent",
										"Link": {
											"ChildListEntry": true,
											"Name": "Level2",
											"Arguments": {
												"Name": "$M.Name"
											}
										},
										"Arguments": {
											"Parent": "$P.Name"
										},
										"Children": []
									}
								]
							}
						]
					}
				]
			},
			{
				"Entry": false,
				"Name": "Level2",
				"Description": "",
				"MapTemplateName": "TP_LV2",
				"MapName": "SERVICE_{Name}",
				"Initialize": "",
				"Finalize": "",
				"Skips": [
					""
				],
				"Arguments": {
					"Name": "Object.Name"
				},
				"Template": [
					{
						"Name": "Service",
						"Macro": "getObjectByName",
						"Arguments": {
							"Name": "$A.Name"
						},
						"Children": [
							{
								"Name": "App",
								"Macro": "getObjectsSameParent",
								"Link": {
									"ChildListEntry": true,
									"Name": "Level3",
									"Arguments": {
										"Name": "$M.Name"
									}
								},
								"Arguments": {
									"Parent": "$P.Name"
								},
								"Children": []
							}
						]
					}
				]
			},
			{
				"Entry": false,
				"Name": "Level3",
				"Description": "",
				"MapTemplateName": "TP_LV3",
				"MapName": "APP_{Name}",
				"Initialize": "",
				"Finalize": "",
				"Skips": [
					""
				],
				"Arguments": {
					"Name": "Object.Name"
				},
				"Reference": [
					{
						"Name": "App",
						"Macro": "getObjectByName",
						"Arguments": {
							"Name": "$A.Name"
						}
					}
				],
				"Template": [
					{
						"Name": "Category",
						"Macro": "getObjectByName",
						"Link": {
							"ChildListEntry": false,
							"Name": "Level1",
							"Arguments": {}
						},
						"Arguments": {
							"Name": "$C.Parent"
						},
						"Children": [
							{
								"Name": "Service",
								"Macro": "getObjectByName",
								"Link": {
									"ChildListEntry": false,
									"Name": "Level1",
									"Arguments": {}
								},
								"Arguments": {
									"Name": "$C.Parent"
								},
								"Children": [
									{
										"Name": "App",
										"Macro": "getObjectByName",
										"Link": {
											"ChildListEntry": true,
											"Name": "Level4",
											"Arguments": {
												"Name": "$M.Name",
												"ZoomIn": "JVM"
											}
										},
										"Arguments": {
											"Name": "$A.Name"
										},
										"Children": [
											{
												"Name": "DB",
												"Macro": "MakeIfExists",
												"Link": {
													"ChildListEntry": false,
													"Name": "Level4",
													"Arguments": {
														"Name": "$G.App.0.Name",
														"ZoomIn": "Database"
													}
												},
												"Arguments": {
													"Check": "$G.App.0.Relations.db",
													"Name": "DB",
													"Label": "DB",
													"Type": "DB",
													"ParentName": "$P.Name"
												},
												"Children": [
													{
														"Name": "DB-App",
														"Macro": "getObjectsByName",
														"Link": {
															"ChildListEntry": false,
															"Name": "Level4",
															"Arguments": {
																"Name": "$G.App.0.Name",
																"ZoomIn": "$M.Name"
															}
														},
														"Arguments": {
															"Name": "$G.App.0.Relations.db",
															"ParentName": "$P.Name",
															"Type": "DB-App"
														},
														"Children": []
													}
												]
											},
											{
												"Name": "WSG",
												"Macro": "MakeIfExists",
												"Arguments": {
													"Check": "$G.App.0.Relations.WSG",
													"Name": "WSG",
													"Label": "WSG",
													"Type": "WSG",
													"ParentName": "$P.Name"
												},
												"Children": [
													{
														"Name": "WSG-app",
														"Macro": "getObjectsByName",
														"Link": {
															"ChildListEntry": false,
															"Name": "Level3",
															"Arguments": {
																"Name": "$M.Name"
															}
														},
														"Arguments": {
															"Name": "$G.App.0.Relations.WSG",
															"ParentName": "$P.Name"
														},
														"Children": []
													}
												]
											},
											{
												"Name": "MMX",
												"Macro": "MakeIfExists",
												"Link": {
													"ChildListEntry": false,
													"Name": "Level4",
													"Arguments": {
														"Name": "$G.App.0.Name",
														"ZoomIn": "MMX"
													}
												},
												"Arguments": {
													"Check": "$G.App.0.Relations.MMX",
													"Name": "MMX",
													"Label": "MMX",
													"Type": "MMX",
													"ParentName": "$P.Name"
												},
												"Children": [
													{
														"Name": "MMX-Send",
														"Macro": "MakeIfExists",
														"Arguments": {
															"Check": "$G.App.0.Relations.MMX-Send",
															"Name": "MMX-Send",
															"Label": "MMX-Send",
															"Type": "MMX-Send",
															"ParentName": "$P.Name"
														},
														"Children": [
															{
																"Name": "MMX-Send",
																"Macro": "getObjectsByName",
																"Link": {
																	"ChildListEntry": false,
																	"Name": "Level3",
																	"Arguments": {
																		"Name": "$M.Name"
																	}
																},
																"Arguments": {
																	"Name": "$G.App.0.Relations.MMX-Send",
																	"ParentName": "$P.Name"
																},
																"Children": []
															}
														]
													},
													{
														"Name": "MMX-Receive",
														"Macro": "MakeIfExists",
														"Arguments": {
															"Check": "$G.App.0.Relations.MMX-Receive",
															"Name": "MMX-Receive",
															"Label": "MMX-Receive",
															"Type": "MMX-Receive",
															"ParentName": "$P.Name"
														},
														"Children": [
															{
																"Name": "MMX-Receive",
																"Macro": "getObjectsByName",
																"Link": {
																	"ChildListEntry": false,
																	"Name": "Level3",
																	"Arguments": {
																		"Name": "$M.Name"
																	}
																},
																"Arguments": {
																	"Name": "$G.App.0.Relations.MMX-Receive",
																	"ParentName": "$P.Name"
																},
																"Children": []
															}
														]
													}
												]
											},
											{
												"Name": "OAM",
												"Macro": "MakeIfExists",
												"Link": {
													"ChildListEntry": false,
													"Name": "Level4",
													"Arguments": {
														"Name": "$G.App.0.Name",
														"ZoomIn": "OAM"
													}
												},
												"Arguments": {
													"Check": "$G.App.0.Relations.OAM",
													"Name": "OAM",
													"Label": "OAM",
													"Type": "OAM",
													"ParentName": "$P.Name"
												},
												"Children": []
											},
											{
												"Name": "OCM",
												"Macro": "MakeIfExists",
												"Link": {
													"ChildListEntry": false,
													"Name": "Level4",
													"Arguments": {
														"Name": "$G.App.0.Name",
														"ZoomIn": "OCM"
													}
												},
												"Arguments": {
													"Check": "$G.App.0.Relations.OCM",
													"Name": "OCM",
													"Label": "OCM",
													"Type": "OCM",
													"ParentName": "$P.Name"
												},
												"Children": []
											},
											{
												"Name": "IHS",
												"Macro": "MakeIfExists",
												"Link": {
													"ChildListEntry": false,
													"Name": "Level4",
													"Arguments": {
														"Name": "$G.App.0.Name",
														"ZoomIn": "IHS"
													}
												},
												"Arguments": {
													"Check": "$G.App.0.Relations.IHS",
													"Name": "IHS",
													"Label": "IHS",
													"Type": "IHS",
													"ParentName": "$P.Name"
												},
												"Children": []
											},
											{
												"Name": "RP",
												"Macro": "MakeIfExists",
												"Link": {
													"ChildListEntry": false,
													"Name": "Level4",
													"Arguments": {
														"Name": "$G.App.0.Name",
														"ZoomIn": "RP"
													}
												},
												"Arguments": {
													"Check": "$G.App.0.Relations.RP",
													"Name": "RP",
													"Label": "RP",
													"Type": "RP",
													"ParentName": "$P.Name"
												},
												"Children": []
											}
										]
									}
								]
							}
						]
					}
				]
			},
			{
				"Entry": false,
				"Name": "Level4",
				"Description": "",
				"MapTemplateName": "TP_LV4",
				"MapName": "INFRA_{Name}",
				"Initialize": "",
				"Finalize": "",
				"Skips": [
					""
				],
				"Arguments": {
					"Name": "Object.Name"
				},
				"Reference": [
					{
						"Name": "App",
						"Macro": "getObjectByName",
						"Arguments": {
							"Name": "$A.Name"
						}
					},
					{
						"Name": "MMX",
						"Macro": "getObjectsByName",
						"Arguments": {
							"Name": "$G.App.0.Relations.MMX"
						}
					},
					{
						"Name": "JVM",
						"Macro": "getObjectsByName",
						"Arguments": {
							"Name": "$G.App.0.Children"
						}
					}
				],
				"Template": [
					{
						"Name": "InfraRoot",
						"Macro": "MakeIfExistsOrNoData",
						"Arguments": {
							"Check": "$G.App.0.Children",
							"Name": "InfraRoot",
							"Label": "",
							"Type": "App",
							"ParentName": "$A.Name"
						},
						"Children": []
					},
					{
						"Name": "Database",
						"Macro": "MakeIfExists",
						"Arguments": {
							"Check": "$G.App.0.Relations.db",
							"Name": "Database",
							"Label": "Database",
							"Type": "App",
							"ParentName": "InfraRoot"
						},
						"Children": [
							{
								"Name": "DB rack instance",
								"Macro": "getObjectsByName",
								"Arguments": {
									"Name": "$G.App.0.Relations.db",
									"ParentName": "$P.Name"
								},
								"Children": [
									{
										"Name": "DB Host",
										"Macro": "getObjectsSameParent",
										"Arguments": {
											"Parent": "$P.Name"
										},
										"Children": [
											{
												"Name": "DB Detail",
												"Macro": "getObjectsSameParent",
												"Arguments": {
													"Parent": "$P.Name"
												},
												"Children": []
											}
										]
									}
								]
							}
						]
					},
					{
						"Name": "OAM",
						"Macro": "MakeIfExists",
						"Arguments": {
							"Check": "$G.App.0.Relations.OAM",
							"Name": "OAM",
							"Label": "OAM",
							"Type": "App",
							"ParentName": "InfraRoot"
						},
						"Children": [
							{
								"Name": "OAM Host",
								"Macro": "getObjectsByName",
								"Arguments": {
									"Name": "$G.App.0.Relations.OAM",
									"ParentName": "$P.Name"
								},
								"Children": []
							}
						]
					},
					{
						"Name": "OCM",
						"Macro": "MakeIfExists",
						"Arguments": {
							"Check": "$G.App.0.Relations.OCM",
							"Name": "OCM",
							"Label": "OCM",
							"Type": "App",
							"ParentName": "InfraRoot"
						},
						"Children": [
							{
								"Name": "OCM Host",
								"Macro": "getObjectsByName",
								"Arguments": {
									"Name": "$G.App.0.Relations.OCM",
									"ParentName": "$P.Name"
								},
								"Children": []
							}
						]
					},
					{
						"Name": "IHS",
						"Macro": "MakeIfExists",
						"Arguments": {
							"Check": "$G.App.0.Relations.IHS",
							"Name": "IHS",
							"Label": "IHS",
							"Type": "App",
							"ParentName": "InfraRoot"
						},
						"Children": [
							{
								"Name": "IHS Host",
								"Macro": "getObjectsByName",
								"Arguments": {
									"Name": "$G.App.0.Relations.IHS",
									"ParentName": "$P.Name"
								},
								"Children": []
							}
						]
					},
					{
						"Name": "RP",
						"Macro": "MakeIfExists",
						"Arguments": {
							"Check": "$G.App.0.Relations.RP",
							"Name": "RP",
							"Label": "RP",
							"Type": "App",
							"ParentName": "InfraRoot"
						},
						"Children": [
							{
								"Name": "RP Host",
								"Macro": "getObjectsByName",
								"Arguments": {
									"Name": "$G.App.0.Relations.RP",
									"ParentName": "$P.Name"
								},
								"Children": []
							}
						]
					},
					{
						"Name": "JVM",
						"Macro": "MakeIfExistsChild",
						"Arguments": {
							"Name": "JVM",
							"Label": "$G.JVM.0.ObjectTypeName",
							"Type": "App",
							"ParentName": "InfraRoot"
						},
						"Children": [
							{
								"Name": "JVM Host",
								"Macro": "getObjectsByName",
								"Arguments": {
									"Name": "$G.JVM.*.Relations.host",
									"ParentName": "$P.Name"
								},
								"Children": [
									{
										"Name": "Host Detail",
										"Macro": "getJVMInstance",
										"Arguments": {
											"Parent": "$A.Name",
											"Host": "$P.Name"
										},
										"Children": []
									}
								]
							}
						]
					}
				]
			}
		]
	}
}

var tempSetData = {
	"Templates": [
		{
			"Name": "DEFAULT",
			"Description": "DEFAULT",
			"PrivilegeNumber": 0,
			"PrivilegeNumbers": [
				1,
				2,
				3
			],
			"TemplateGroupName": "TemplateMap",
			"LinkCondition": {},
			"Templates": [
				{
					"Entry": true,
					"Name": "Level1",
					"Description": "",
					"MapTemplateName": "TP_LV1",
					"MapName": "Warriors",
					"Initialize": "",
					"Finalize": "",
					"Skips": [
						""
					],
					"Arguments": {},
					"Template": [
						{
							"Name": "Root",
							"Macro": "getObjectByType",
							"Arguments": {
								"Type": "company"
							},
							"Children": [
								{
									"Name": "Category",
									"Macro": "getObjectsSameParent",
									"Arguments": {
										"Parent": "$P.Name"
									},
									"Children": [
										{
											"Name": "Service",
											"Macro": "getObjectsSameParent",
											"Link": {
												"ChildListEntry": true,
												"Name": "Level2",
												"Arguments": {
													"Name": "$M.Name"
												}
											},
											"Arguments": {
												"Parent": "$P.Name"
											},
											"Children": []
										}
									]
								}
							]
						}
					]
				},
				{
					"Entry": false,
					"Name": "Level2",
					"Description": "",
					"MapTemplateName": "TP_LV2",
					"MapName": "SERVICE_{Name}",
					"Initialize": "",
					"Finalize": "",
					"Skips": [
						""
					],
					"Arguments": {
						"Name": "Object.Name"
					},
					"Template": [
						{
							"Name": "Service",
							"Macro": "getObjectByName",
							"Arguments": {
								"Name": "$A.Name"
							},
							"Children": [
								{
									"Name": "App",
									"Macro": "getObjectsSameParent",
									"Link": {
										"ChildListEntry": true,
										"Name": "Level3",
										"Arguments": {
											"Name": "$M.Name"
										}
									},
									"Arguments": {
										"Parent": "$P.Name"
									},
									"Children": []
								}
							]
						}
					]
				},
				{
					"Entry": false,
					"Name": "Level3",
					"Description": "",
					"MapTemplateName": "TP_LV3",
					"MapName": "APP_{Name}",
					"Initialize": "",
					"Finalize": "",
					"Skips": [
						""
					],
					"Arguments": {
						"Name": "Object.Name"
					},
					"Reference": [
						{
							"Name": "App",
							"Macro": "getObjectByName",
							"Arguments": {
								"Name": "$A.Name"
							}
						}
					],
					"Template": [
						{
							"Name": "Category",
							"Macro": "getObjectByName",
							"Link": {
								"ChildListEntry": false,
								"Name": "Level1",
								"Arguments": {}
							},
							"Arguments": {
								"Name": "$C.Parent"
							},
							"Children": [
								{
									"Name": "Service",
									"Macro": "getObjectByName",
									"Link": {
										"ChildListEntry": false,
										"Name": "Level1",
										"Arguments": {}
									},
									"Arguments": {
										"Name": "$C.Parent"
									},
									"Children": [
										{
											"Name": "App",
											"Macro": "getObjectByName",
											"Link": {
												"ChildListEntry": true,
												"Name": "Level4",
												"Arguments": {
													"Name": "$M.Name",
													"ZoomIn": "JVM"
												}
											},
											"Arguments": {
												"Name": "$A.Name"
											},
											"Children": [
												{
													"Name": "DB",
													"Macro": "MakeIfExists",
													"Link": {
														"ChildListEntry": false,
														"Name": "Level4",
														"Arguments": {
															"Name": "$G.App.0.Name",
															"ZoomIn": "Database"
														}
													},
													"Arguments": {
														"Check": "$G.App.0.Relations.db",
														"Name": "DB",
														"Label": "DB",
														"Type": "DB",
														"ParentName": "$P.Name"
													},
													"Children": [
														{
															"Name": "DB-App",
															"Macro": "getObjectsByName",
															"Link": {
																"ChildListEntry": false,
																"Name": "Level4",
																"Arguments": {
																	"Name": "$G.App.0.Name",
																	"ZoomIn": "$M.Name"
																}
															},
															"Arguments": {
																"Name": "$G.App.0.Relations.db",
																"ParentName": "$P.Name",
																"Type": "DB-App"
															},
															"Children": []
														}
													]
												},
												{
													"Name": "WSG",
													"Macro": "MakeIfExists",
													"Arguments": {
														"Check": "$G.App.0.Relations.WSG",
														"Name": "WSG",
														"Label": "WSG",
														"Type": "WSG",
														"ParentName": "$P.Name"
													},
													"Children": [
														{
															"Name": "WSG-app",
															"Macro": "getObjectsByName",
															"Link": {
																"ChildListEntry": false,
																"Name": "Level3",
																"Arguments": {
																	"Name": "$M.Name"
																}
															},
															"Arguments": {
																"Name": "$G.App.0.Relations.WSG",
																"ParentName": "$P.Name"
															},
															"Children": []
														}
													]
												},
												{
													"Name": "MMX",
													"Macro": "MakeIfExists",
													"Link": {
														"ChildListEntry": false,
														"Name": "Level4",
														"Arguments": {
															"Name": "$G.App.0.Name",
															"ZoomIn": "MMX"
														}
													},
													"Arguments": {
														"Check": "$G.App.0.Relations.MMX",
														"Name": "MMX",
														"Label": "MMX",
														"Type": "MMX",
														"ParentName": "$P.Name"
													},
													"Children": [
														{
															"Name": "MMX-Send",
															"Macro": "MakeIfExists",
															"Arguments": {
																"Check": "$G.App.0.Relations.MMX-Send",
																"Name": "MMX-Send",
																"Label": "MMX-Send",
																"Type": "MMX-Send",
																"ParentName": "$P.Name"
															},
															"Children": [
																{
																	"Name": "MMX-Send",
																	"Macro": "getObjectsByName",
																	"Link": {
																		"ChildListEntry": false,
																		"Name": "Level3",
																		"Arguments": {
																			"Name": "$M.Name"
																		}
																	},
																	"Arguments": {
																		"Name": "$G.App.0.Relations.MMX-Send",
																		"ParentName": "$P.Name"
																	},
																	"Children": []
																}
															]
														},
														{
															"Name": "MMX-Receive",
															"Macro": "MakeIfExists",
															"Arguments": {
																"Check": "$G.App.0.Relations.MMX-Receive",
																"Name": "MMX-Receive",
																"Label": "MMX-Receive",
																"Type": "MMX-Receive",
																"ParentName": "$P.Name"
															},
															"Children": [
																{
																	"Name": "MMX-Receive",
																	"Macro": "getObjectsByName",
																	"Link": {
																		"ChildListEntry": false,
																		"Name": "Level3",
																		"Arguments": {
																			"Name": "$M.Name"
																		}
																	},
																	"Arguments": {
																		"Name": "$G.App.0.Relations.MMX-Receive",
																		"ParentName": "$P.Name"
																	},
																	"Children": []
																}
															]
														}
													]
												},
												{
													"Name": "OAM",
													"Macro": "MakeIfExists",
													"Link": {
														"ChildListEntry": false,
														"Name": "Level4",
														"Arguments": {
															"Name": "$G.App.0.Name",
															"ZoomIn": "OAM"
														}
													},
													"Arguments": {
														"Check": "$G.App.0.Relations.OAM",
														"Name": "OAM",
														"Label": "OAM",
														"Type": "OAM",
														"ParentName": "$P.Name"
													},
													"Children": []
												},
												{
													"Name": "OCM",
													"Macro": "MakeIfExists",
													"Link": {
														"ChildListEntry": false,
														"Name": "Level4",
														"Arguments": {
															"Name": "$G.App.0.Name",
															"ZoomIn": "OCM"
														}
													},
													"Arguments": {
														"Check": "$G.App.0.Relations.OCM",
														"Name": "OCM",
														"Label": "OCM",
														"Type": "OCM",
														"ParentName": "$P.Name"
													},
													"Children": []
												},
												{
													"Name": "IHS",
													"Macro": "MakeIfExists",
													"Link": {
														"ChildListEntry": false,
														"Name": "Level4",
														"Arguments": {
															"Name": "$G.App.0.Name",
															"ZoomIn": "IHS"
														}
													},
													"Arguments": {
														"Check": "$G.App.0.Relations.IHS",
														"Name": "IHS",
														"Label": "IHS",
														"Type": "IHS",
														"ParentName": "$P.Name"
													},
													"Children": []
												},
												{
													"Name": "RP",
													"Macro": "MakeIfExists",
													"Link": {
														"ChildListEntry": false,
														"Name": "Level4",
														"Arguments": {
															"Name": "$G.App.0.Name",
															"ZoomIn": "RP"
														}
													},
													"Arguments": {
														"Check": "$G.App.0.Relations.RP",
														"Name": "RP",
														"Label": "RP",
														"Type": "RP",
														"ParentName": "$P.Name"
													},
													"Children": []
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					"Entry": false,
					"Name": "Level4",
					"Description": "",
					"MapTemplateName": "TP_LV4",
					"MapName": "INFRA_{Name}",
					"Initialize": "",
					"Finalize": "",
					"Skips": [
						""
					],
					"Arguments": {
						"Name": "Object.Name"
					},
					"Reference": [
						{
							"Name": "App",
							"Macro": "getObjectByName",
							"Arguments": {
								"Name": "$A.Name"
							}
						},
						{
							"Name": "MMX",
							"Macro": "getObjectsByName",
							"Arguments": {
								"Name": "$G.App.0.Relations.MMX"
							}
						},
						{
							"Name": "JVM",
							"Macro": "getObjectsByName",
							"Arguments": {
								"Name": "$G.App.0.Children"
							}
						}
					],
					"Template": [
						{
							"Name": "InfraRoot",
							"Macro": "MakeIfExistsOrNoData",
							"Arguments": {
								"Check": "$G.App.0.Children",
								"Name": "InfraRoot",
								"Label": "",
								"Type": "App",
								"ParentName": "$A.Name"
							},
							"Children": []
						},
						{
							"Name": "Database",
							"Macro": "MakeIfExists",
							"Arguments": {
								"Check": "$G.App.0.Relations.db",
								"Name": "Database",
								"Label": "Database",
								"Type": "App",
								"ParentName": "InfraRoot"
							},
							"Children": [
								{
									"Name": "DB rack instance",
									"Macro": "getObjectsByName",
									"Arguments": {
										"Name": "$G.App.0.Relations.db",
										"ParentName": "$P.Name"
									},
									"Children": [
										{
											"Name": "DB Host",
											"Macro": "getObjectsSameParent",
											"Arguments": {
												"Parent": "$P.Name"
											},
											"Children": [
												{
													"Name": "DB Detail",
													"Macro": "getObjectsSameParent",
													"Arguments": {
														"Parent": "$P.Name"
													},
													"Children": []
												}
											]
										}
									]
								}
							]
						},
						{
							"Name": "OAM",
							"Macro": "MakeIfExists",
							"Arguments": {
								"Check": "$G.App.0.Relations.OAM",
								"Name": "OAM",
								"Label": "OAM",
								"Type": "App",
								"ParentName": "InfraRoot"
							},
							"Children": [
								{
									"Name": "OAM Host",
									"Macro": "getObjectsByName",
									"Arguments": {
										"Name": "$G.App.0.Relations.OAM",
										"ParentName": "$P.Name"
									},
									"Children": []
								}
							]
						},
						{
							"Name": "OCM",
							"Macro": "MakeIfExists",
							"Arguments": {
								"Check": "$G.App.0.Relations.OCM",
								"Name": "OCM",
								"Label": "OCM",
								"Type": "App",
								"ParentName": "InfraRoot"
							},
							"Children": [
								{
									"Name": "OCM Host",
									"Macro": "getObjectsByName",
									"Arguments": {
										"Name": "$G.App.0.Relations.OCM",
										"ParentName": "$P.Name"
									},
									"Children": []
								}
							]
						},
						{
							"Name": "IHS",
							"Macro": "MakeIfExists",
							"Arguments": {
								"Check": "$G.App.0.Relations.IHS",
								"Name": "IHS",
								"Label": "IHS",
								"Type": "App",
								"ParentName": "InfraRoot"
							},
							"Children": [
								{
									"Name": "IHS Host",
									"Macro": "getObjectsByName",
									"Arguments": {
										"Name": "$G.App.0.Relations.IHS",
										"ParentName": "$P.Name"
									},
									"Children": []
								}
							]
						},
						{
							"Name": "RP",
							"Macro": "MakeIfExists",
							"Arguments": {
								"Check": "$G.App.0.Relations.RP",
								"Name": "RP",
								"Label": "RP",
								"Type": "App",
								"ParentName": "InfraRoot"
							},
							"Children": [
								{
									"Name": "RP Host",
									"Macro": "getObjectsByName",
									"Arguments": {
										"Name": "$G.App.0.Relations.RP",
										"ParentName": "$P.Name"
									},
									"Children": []
								}
							]
						},
						{
							"Name": "JVM",
							"Macro": "MakeIfExistsChild",
							"Arguments": {
								"Name": "JVM",
								"Label": "$G.JVM.0.ObjectTypeName",
								"Type": "App",
								"ParentName": "InfraRoot"
							},
							"Children": [
								{
									"Name": "JVM Host",
									"Macro": "getObjectsByName",
									"Arguments": {
										"Name": "$G.JVM.*.Relations.host",
										"ParentName": "$P.Name"
									},
									"Children": [
										{
											"Name": "Host Detail",
											"Macro": "getJVMInstance",
											"Arguments": {
												"Parent": "$A.Name",
												"Host": "$P.Name"
											},
											"Children": []
										}
									]
								}
							]
						}
					]
				}
			]
		}
	]
};

var tempDeleteData = {
	"Names": [
		"DEFAULT"
	],
	"PrivilegeNumber": 0,
	"TemplateGroupName": "TemplateMap"
};

module.exports = {
	// Read
	'mapTree.list': function(_config, _callback) {
		wsconn('MapTreeTemplate/ReadAll', tempReadData, function(result) {
			var list;
			
			forEach(result.result.Result, function(item) {
				var arr = templateDataAdapter(item);

				list = forEach(arr, function(tpl) {
					tpl._id = shortid.generate();
				});
			});

			return _callback({
				success: true,
				result: list
			});
		});
	},

	// Create
	'MapTreeTemplate/Create': function(_config, _callback) {
		wsconn('MapTreeTemplate/Create', tempCreateData, _callback);
	},

	// file update set
	'MapTreeTemplate/Set': function(_config, _callback) {
		wsconn('MapTreeTemplate/Set', tempSetData, _callback);
	},

	// Update
	'MapTreeTemplate/Update': function(_config, _callback) {
		wsconn('MapTreeTemplate/Update', tempUpdateData, _callback);
	},

	// Delete dtg
	'MapTreeTemplate/Delete': function(_config, _callback) {
		wsconn('MapTreeTemplate/Delete', tempDeleteData, _callback);
	}
};


function templateDataAdapterChildren(_array, _parent, _childProperty) {
	var children = _parent[_childProperty];

	if (children && children.length > 0) {
		for (var i = 0, iLen = children.length; i < iLen; i += 1) {
			var childItem = children[i];

			_parent.childNodes.push(childItem.Name);
			childItem.id = _array.length;
			childItem.depth = _parent.depth + 1;
			childItem.levelName = _parent.levelName;
			childItem.nodeType = 'node';
			childItem.childNodes = [];
			childItem.parentId = _parent.id;

			_array.push(childItem);

			templateDataAdapterChildren(_array, childItem, _childProperty);
			//delete childItem[_childProperty];
		}
	}
}

function templateDataAdapter(_data) {
	var data = _data;
	var array = [];

	/**
	 * Level parse
	 */
	forEach(data['Templates'], function(_levelItem) {
		_levelItem.id = array.length;
		_levelItem.depth = 1;
		_levelItem.nodeType = 'level';
		_levelItem.childNodes = [];
		_levelItem.parentId = null;

		array.push(_levelItem);

		/**
		 * Service parse
		 */
		forEach(_levelItem['Template'], function(_serviceItem) {
			_levelItem.childNodes.push(_serviceItem.Name);

			_serviceItem.id = array.length;
			_serviceItem.depth = _levelItem.depth + 1;
			_serviceItem.levelName = _levelItem.Name;
			_serviceItem.nodeType = 'root';
			_serviceItem.childNodes = [];
			_serviceItem.parentId = _levelItem.id;

			array.push(_serviceItem);

			templateDataAdapterChildren(array, _serviceItem, 'Children');
			//delete _serviceItem['Children'];
		});

		if (_levelItem.childNodes.length > 0) {
			_levelItem.hasChildren = true;
		}
		//delete _levelItem['Template'];
	});

	return array;
}
