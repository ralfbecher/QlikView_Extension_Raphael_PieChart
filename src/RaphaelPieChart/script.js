/* Raphael PieChart

Created by Ralf Becher - ralf.becher@tiq-solutions.de - TIQ Solutions, Leipzig, Germany

Tested on QV 11.0, 11.2

TIQ Solutions takes no responsbility for any code.
Use at your own risk. */

var template_path = Qva.Remote + "?public=only&name=Extensions/RaphaelPieChart/";
function extension_Init()
{
	// Use QlikView's method of loading other files needed by an extension. These files should be added to your extension .zip file (.qar)
	    Qva.LoadScript(template_path + 'raphael.js', function() {
		    Qva.LoadScript(template_path + 'g.raphael.js', function() {
            Qva.LoadScript(template_path + 'g.pie.js', extension_Done);
		    });
	    });
}

function extension_Done(){
	//Add extension
	Qva.AddExtension('RaphaelPieChart', 
	function(){
		//Load a CSS style sheet
		//Qva.LoadCSS(template_path + "demo.css");
		//Qva.LoadCSS(template_path + "demo-print.css");
		
	var _this = this;
	
	var iFrameWidth = _this.GetWidth();
	var iFrameHeight = _this.GetHeight();

	var divName = _this.Layout.ObjectId.replace("\\", "_");

	if (_this.Element.children.length == 0) {
		var ui = document.createElement("div");
		ui.setAttribute("id", divName);
		_this.Element.appendChild(ui);
		$("#" + divName).css("height", iFrameHeight + "px").css("width", iFrameWidth + "px");
	} else {
		$("#" + divName).css("height", iFrameHeight + "px").css("width", iFrameWidth + "px");
		$("#" + divName).empty();
	};
	
/* Title settings */		
	title = _this.Layout.Text0.text;
	titleXpos = 390;
	titleYpos = 55;

/* Pie Data */
	pieRadius = 130;
	pieXpos = 150;
	pieYpos = 150;
	pieData =new Array();;
	pieLegend =new Array();;
	pieLegendPos = "east";		
	
  for (var i=0,k=_this.Data.Rows.length;i<k;i++){
		var row = _this.Data.Rows[i];
		pieLegend[i] = "%%.%% – " + row[0].text;
		pieData[i] = Number(row[1].text);
	}

	var r = Raphael(divName, iFrameWidth, iFrameHeight);
	r.text(titleXpos, titleYpos, title).attr({"font-size": 20});

	var pie = r.piechart(pieXpos, pieYpos, pieRadius, pieData, {legend: pieLegend, legendpos: pieLegendPos});
	pie.hover(function () {
	    this.sector.stop();
	    this.sector.scale(1.1, 1.1, this.cx, this.cy);
	    if (this.label) {
	        this.label[0].stop();
	        this.label[0].scale(1.1);
	        this.label[1].attr({"font-weight": 800});
	    }
	}, function () {
//	    this.sector.animate({scale: [0.9, 0.9, this.cx, this.cy]}, 500, "bounce");
	    this.sector.scale(0.9091, 0.9091, this.cx, this.cy);
	    if (this.label) {
//	        this.label[0].animate({scale: 0.9}, 500, "bounce");
	        this.label[0].scale(0.9091);
	        this.label[1].attr({"font-weight": 400});
	    }
	});

	});
}

//Initiate extension
extension_Init();
