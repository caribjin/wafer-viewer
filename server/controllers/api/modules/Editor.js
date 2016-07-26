/**
 * Created by amos on 2016. 4. 12..
 */

var wsconn = require('../wsconn');
var tempReadData = {"Name": "ShowIfExist.cs"};

var tempCreateData = {
	"Data": {
		"Name": "helloScript.cs",
		"IconPath": "",
		"Script": "using System;\nusing System.Data;\nusing System.Collections.Generic;\nusing Content.Canvas.Canvas.UIElement;\nusing Content.Canvas.Canvas;\nusing System.Windows;\nusing System.Windows.Media;\nusing System.Linq;\nusing System.Text.RegularExpressions;\n\npublic class ShowIfExist\n{\n    public static void Draw(MapObjectTreeSet data, Dictionary<string, Dictionary<string, string>> Style)\n    {\n    if (data == null)\n    {\n      return;\n    }\n\n        var areaName = Common.GetTemplateAreaName();\n        Canvas templateCanvas = Common.GetTemplateCanvas();\n    Universal templateItem = templateCanvas.Items[areaName] as Universal;\n    Universal item = Common.GetCurrentTask().CreateUIElement<Universal>(data);\n\n    Common.GetCurrentTask().CopyProperty(item, templateItem);\n\n    item.TitleCaption = data.Label;\n    item.SplunkObjectID = data.ObjectNumber.ToString();\n\n    if (data.Properties != null && data.Properties.ContainsKey(\"url\"))\n    {\n      item.LinkUrl = data.Properties[\"url\"].FirstOrDefault();\n    }\n    else\n    {\n      item.LinkUrl = string.Empty;\n    }\n\n  }\n}\n"
	}
};

var tempUpdateData = {
	"Data": {
		"Name": "helloScript.cs",
		"IconPath": "",
		"Script": "using System;\nusing System.Data;\nusing System.Collections.Generic;\nusing Content.Canvas.Canvas.UIElement;\nusing Content.Canvas.Canvas;\nusing System.Windows;\nusing System.Windows.Media;\nusing System.Linq;\nusing System.Text.RegularExpressions;\n\npublic class ShowIfExist\n{\n    public static void Draw(MapObjectTreeSet data, Dictionary<string, Dictionary<string, string>> Style)\n    {\n    if (data == null)\n    {\n      return;\n    }\n\n        var areaName = Common.GetTemplateAreaName();\n        Canvas templateCanvas = Common.GetTemplateCanvas();\n    Universal templateItem = templateCanvas.Items[areaName] as Universal;\n    Universal item = Common.GetCurrentTask().CreateUIElement<Universal>(data);\n\n    Common.GetCurrentTask().CopyProperty(item, templateItem);\n\n    item.TitleCaption = data.Label;\n    item.SplunkObjectID = data.ObjectNumber.ToString();\n\n    if (data.Properties != null && data.Properties.ContainsKey(\"url\"))\n    {\n      item.LinkUrl = data.Properties[\"url\"].FirstOrDefault();\n    }\n    else\n    {\n      item.LinkUrl = string.Empty;\n    }\n\n  }\n}\n"
	}
};

var tempDeleteData = {"Names": ["helloScript.cs"]};

module.exports = {
	// Read
	'Script/List': function(_config, _callback) {
		wsconn('Script/List', {}, _callback);
	},

	'Script/Read': function(_config, _callback) {
		wsconn('Script/Read', tempReadData, _callback);
	},

	// Create
	'Script/Create': function(_config, _callback) {
		wsconn('Script/Create', tempCreateData, _callback);
	},

	// Update
	'Script/Update': function(_config, _callback) {
		wsconn('Script/Update', tempUpdateData, _callback);
	},

	// Delete
	'Script/Delete': function(_config, _callback) {
		wsconn('Script/Delete', tempDeleteData, _callback);
	}
};