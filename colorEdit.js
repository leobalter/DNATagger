function Color() {
    this.currentName = "Default";
    this.table = colorTables[this.currentName];
    this.amino = "*";
    this.showAminoMenu = function() {
        var r = '<table style="font-size: smaller;">';
        for (var i in aliases) {
            r += "<tr style='cursor: pointer;' onclick='color.setAmino(\"" + i + "\")'>";
            r += "<td><b>" + i + "</b>:</td><td>" + aliases[i].amino;
            r += "</td><td>(" + colorizer.styleFromAmino(i, aliases[i].abbr) + ")</td></tr>";
        }
        r += "</table>";
        document.getElementById("colorAminoMenu").innerHTML = r;
    };
    this.showTableCode = function() {
        var r = "color.table={\n";
        var n = false;
        for (var i in this.table) {
            r += "'" + i + "': { fore: '" + this.table[i].fore + "', bkg: '" + this.table[i].bkg + "' }, ";
            if (n) {
                r += "\n";
            }
            n = !n;
        }
        r += "\n}";
        document.getElementById("colorTableEdit").value = r;
    };
    this.updateAll = function() {
        this.showAminoMenu();
        this.showTableCode();
        translation.select();
    };
    this.setAmino = function(amino) {
        this.amino = amino;
        this.color = [ [ 0, 0, 0 ], [ 0, 0, 0 ] ];
        var f = this.table[amino].fore;
        var b = this.table[amino].bkg;
        this.color[0][0] = parseInt(f.substring(1, 2), 16);
        this.color[0][1] = parseInt(f.substring(2, 3), 16);
        this.color[0][2] = parseInt(f.substring(3, 4), 16);
        this.color[1][0] = parseInt(b.substring(1, 2), 16);
        this.color[1][1] = parseInt(b.substring(2, 3), 16);
        this.color[1][2] = parseInt(b.substring(3, 4), 16);
        this.rgbSelectorDraw(0);
        this.rgbSelectorDraw(1);
        this.updateResult();
    };
    this.colorCode = function(idx) {
        var r = "#", i;
        for (i = 0; i < 3; ++i) {
            r += this.color[idx][i].toString(16);
        }
        return r;
    };
    this.updateResult = function() {
        var r = "Editing: " + aliases[this.amino].amino + " (<span style='color: ";
        r += this.colorCode(0) + "; background: ";
        r += this.colorCode(1) + ";'>" + aliases[this.amino].abbr + "</span>) ";
        r += "<a style='font-size: smaller;' ";
        r += "href='#' onclick='color.apply()'>apply changes</a>";
        document.getElementById("aminoColorEditing").innerHTML = r;
    };
    this.apply = function() {
        this.table[this.amino].fore = this.colorCode(0);
        this.table[this.amino].bkg = this.colorCode(1);
        this.updateAll();
    };
    this.setComponent = function(layer, idx, level) {
        this.color[layer][idx] = level;
        this.rgbSelectorDraw(layer);
        this.updateResult();
    };
    this.rgbSelectorDraw = function(layer) {
        var rgbn = [ "Red", "Green", "Blue" ];
        var rgbt = [ 0, 0, 0 ];
        for (i = 0; i < 3; i++) {
            var selcode = "";
            for (j = 0; j < 3; j++) {
                rgbt[j] = this.color[layer][j];
            }
            for (j = 0; j < 16; j++) {
                rgbt[i] = j;
                selcode += "<span style='cursor: pointer; padding-right: 10px; height: 10px; background: #";
                selcode += rgbt[0].toString(16);
                selcode += rgbt[1].toString(16);
                selcode += rgbt[2].toString(16);
                selcode += "; ";
                if (j == this.color[layer][i]) {
                    selcode += "border: #000 solid 1px;";
                }
                selcode += "' onclick='color.setComponent(" + layer + "," + i + "," + j + ")'>&nbsp;</span>";
            }
            selcode += " " + rgbn[i] + ": " + this.color[layer][i].toString(16);
            document.getElementById("Selector" + layer + i).innerHTML = selcode;
        }
    };
    this.select = function() {
        var s = document.getElementById("colorTableSelect");
        this.currentName = s.options[s.selectedIndex].value;
        this.table = colorTables[this.currentName];
        this.updateAll();
        this.setAmino(this.amino);
    };
    this.interpret = function() {
        var toInterpret = document.getElementById("colorTableEdit").value;
        try {
            /*jshint evil:true*/
            eval(toInterpret);
            /*jshint evil:false*/
            colorTables[this.currentName] = this.table;
            this.updateAll();
            this.setAmino(this.amino);
        } catch (e) {
            var m = "Couldn't interpret the color table code because\n";
            m += "of the following error:\n\n";
            m += "Name: " + e.name + "\n";
            m += "Description: " + e.message + "\n\nPlease correct it, and try again.";
            alert(m);
        }
    };
    this.init = function() {
        var ihe = "";
        for (var i in colorTables) {
            ihe += "<option";
            if (i == this.currentName) {
                ihe += ' selected="true"';
            }
            ihe += ">" + i + "</option>";
        }
        document.getElementById("colorTableSelect").innerHTML = ihe;
        this.updateAll();
        this.setAmino(this.amino);
    };
}