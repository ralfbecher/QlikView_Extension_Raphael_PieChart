/* Raphael PieChart

Created by Ralf Becher - ralf.becher@tiq-solutions.de - TIQ Solutions, Leipzig, Germany

Tested on QV 11.2

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

	var objId = _this.Layout.ObjectId.replace("\\", "_");

	var showTooltip = ((this.Layout.Text1.text.toString() * 1) > 0);
	
	$(this.Element).empty();
	
	if (showTooltip) {
		/* Create Tooltip */	
		var tip = $('<div />').css({
					position : 'absolute',
					border : '1px solid gray',
					"background-color" : '#efefef',
					padding : '3px',
					"z-index": '1000',
					/* set this to create word wrap */
					"max-width": '200px',
					font: '12px Arial'
				}).attr({
					id: objId + '_tip',
				}).appendTo($(this.Element)).hide();
	}
	
	var tipText = "";
	var over = false;
	
	var myDiv = $('<div />').css({
				height: this.GetHeight(),
				width: this.GetWidth(),
				overflow: 'auto'
			}).attr({
				id: objId,
			}).appendTo($(this.Element));

	var myDivPos = myDiv.offset();

	if (showTooltip) {
		$(myDiv).mousemove(function(e){
			if (over){
			  tip.css("left", e.clientX - myDivPos.left + 20).css("top", e.clientY - myDivPos.top + 20);
			  tip.text(tipText);
			}
		});
	}
	
/* Pie Data */
	var pieRadius = this.GetHeight() * 0.4;
	var pieXpos = pieRadius + 24;
	var pieYpos = pieXpos;
	var pieData = [];
	var pieLegend = [];
	var pieLegendPos = "east";		

/* Title settings */		
	var title = _this.Layout.Text0.text;
	var titleXpos = (pieRadius * 2) + 94;
	var titleYpos = Math.max(14, pieRadius - 120);
	

  for (var i=0,k=_this.Data.Rows.length;i<k;i++){
		var row = _this.Data.Rows[i];
		pieLegend[i] = "%%.%% – " + row[0].text;
		pieData[i] = Number(row[1].text);
	}

	var r = Raphael(objId, iFrameWidth, iFrameHeight);
	r.text(titleXpos, titleYpos, title).attr({"font-size": 20});

	var pie = r.piechart(pieXpos, pieYpos, pieRadius, pieData, {legend: pieLegend, legendpos: pieLegendPos});
	
	pie.hover(function () {
	    this.sector.stop();
	    this.sector.scale(1.1, 1.1, this.cx, this.cy);
	    if (this.label) {
			if (showTooltip && !over) {
				over = true;
				tipText = this.label[1].node.textContent;
				tip.fadeIn();
			}
	        this.label[0].stop();
	        this.label[0].scale(1.1);
	        this.label[1].attr({"font-weight": 800});
	    }
	}, function () {
	    this.sector.scale(0.9091, 0.9091, this.cx, this.cy);
	    if (this.label) {
	        this.label[0].scale(0.9091);
	        this.label[1].attr({"font-weight": 400});
			if (showTooltip && over) {
				tip.fadeOut(100);
				over = false;
			}
	    }
	});

	pie.each(function() {
     r[i].g.label(this.x, this.y, this.label[1].attrs.text).show();
    });
	
	});
}

//Initiate extension
extension_Init();
