function Translation() {
    this.tableName = "1 - Standard Code (default)";
    this.table = transTables[this.tableName];
    this.select = function() {
        var s = document.getElementById("transTableSelect");
        this.tableName = s.options[s.selectedIndex].value;
        this.table = transTables[this.tableName];
        this.showTable();
    };
    this.amino = function(codon) {
        return this.table[codon];
    };
    this.aminoName = function(codon) {
        return aliases[this.amino(codon)].amino;
    };
    this.aminoAbbr = function(codon) {
        return aliases[this.amino(codon)].abbr;
    };
    this.foreColor = function(codon) {
        return color.table[this.amino(codon)].fore;
    };
    this.bkgColor = function(codon) {
        return color.table[this.amino(codon)].bkg;
    };
    this.showTable = function() {
        var acids = [ "T", "C", "A", "G" ];
        var retv = "";
        retv = '<select id="transTableSelect" onchange="javascript: translation.select();">';
        for (var i in transTables) {
            retv += "<option";
            if (i == this.tableName) {
                retv += ' selected="true"';
            }
            retv += ">" + i + "</option>";
        }
        retv += "</select><br/><br/>";
        retv += '<table id="TransTable" border="1" cellpadding="3" cellspacing="0">';
        retv += '<tr><td rowspan="2" colspan="2"></td><th colspan="4">2nd base</th></tr>';
        retv += "<tr><th>T</th><th>C</th><th>A</th><th>G</th></tr>";
        retv += '<tr><th rowspan="4">1st<br />base</th>';
        for (var i1 in acids) {
            if (i1) {
                retv += "<tr>";
            }
            retv += "<th>" + acids[i1] + "</th>";
            for (var i2 in acids) {
                retv += "<td>";
                for (var i3 in acids) {
                    var codon = acids[i1] + acids[i2] + acids[i3];
                    retv += codon + ": " + this.aminoName(codon);
                    retv += ' (<span style="background: ' + this.bkgColor(codon);
                    retv += "; color: " + this.foreColor(codon) + ';">';
                    retv += this.amino(codon) + "</span>)<br/>";
                }
                retv += "</td>";
            }
            retv += "</tr>";
        }
        retv += "</table>";
        document.getElementById("d_trans").innerHTML = retv;
    };
}

function Colorizer() {
    var aminoLetters = "";
    for (var i in aliases) {
        if (i != "*" && i != "~") {
            aminoLetters += i;
        }
    }
    var aminoBlockStr = "\\b[" + aminoLetters + "][\\-." + aminoLetters + "]{3,}\\b";
    this.aminoBlock = RegExp(aminoBlockStr, "gmi");
    this.codonBlock = /\b[UTAGCutagc][UTAGCutagc\-\.][UTAGCutagc\-\. ]{7,}\b/gm;
    this.styleFromAmino = function(alet, txt) {
        if (alet == ".") {
            return ".";
        }
        return '<span style="color: ' + color.table[alet.toUpperCase()].fore + "; background: " + color.table[alet.toUpperCase()].bkg + ';">' + txt + "</span>";
    };
    this.styleFromCodon = function(codon, txt, ini, mid) {
        var alet = translation.amino(codon);
        var r = "";
        if (txt.length > 3) {
            r = txt.substring(0, ini);
            r += this.styleFromAmino(alet, txt[ini]);
            r += txt.substring(ini + 1, mid);
            r += this.styleFromAmino(alet, txt[mid]);
            r += txt.substring(mid + 1, txt.length - 1);
            r += this.styleFromAmino(alet, txt[txt.length - 1]);
        } else {
            r = this.styleFromAmino(alet, txt);
        }
        return r;
    };
    this.processAminoBlock = function(txt) {
        var retv = "";
        for (var i in txt) {
            if (txt[i] == "-") {
                retv += txt[i];
            } else {
                retv += this.styleFromAmino(txt[i], txt[i]);
            }
        }
        return retv;
    };
    this.processCodonBlock = function(txt) {
        var uppertxt = txt.toUpperCase();
        var retv = "";
        var ci = 0;
        var mid, ini;
        var codon = {};
        var strip = "";
        for (var i in txt) {
            var c = uppertxt[i];
            strip += txt[i];
            if (c == "T" || c == "A" || c == "G" || c == "C" || c == "U") {
                codon[ci] = c == "U" ? "T" : c;
                ci++;
                if (ci == 1) {
                    ini = strip.length - 1;
                } else if (ci == 2) {
                    mid = strip.length - 1;
                } else if (ci == 3) {
                    retv += this.styleFromCodon(codon[0] + codon[1] + codon[2], strip, ini, mid);
                    ci = 0;
                    mid = 0;
                    strip = "";
                }
            }
        }
        retv += strip;
        return retv;
    };
    this.processAminos = function(txt) {
        var lastIdx = 0;
        var retv = "";
        var exeres;
        this.aminoBlock.lastIndex = 0;
        while (1) {
            exeres = this.aminoBlock.exec(txt);
            if (!exeres) {
                return retv + txt.substring(lastIdx);
            }
            retv += txt.substring(lastIdx, exeres.index);
            retv += this.processAminoBlock(txt.substring(exeres.index, this.aminoBlock.lastIndex));
            lastIdx = this.aminoBlock.lastIndex;
        }
    };
    this.process = function(txt) {
        var lastIdx = 0;
        var retv = "";
        var exeres;
        while (1) {
            exeres = this.codonBlock.exec(txt);
            if (!exeres) {
                return retv + this.processAminos(txt.substring(lastIdx));
            }
            retv += this.processAminos(txt.substring(lastIdx, exeres.index));
            retv += this.processCodonBlock(txt.substring(exeres.index, this.codonBlock.lastIndex));
            lastIdx = this.codonBlock.lastIndex;
        }
    };
}

function initialize() {
    translation = new Translation();
    colorizer = new Colorizer();
    color = new Color();
    menu = new Menu("edit", {
        edit: function() {},
        color: function() {},
        trans: function() {},
        instructions: function() {},
        about: function() {},
        view: function() {
            var src = document.getElementById("alignEdit");
            var dest = document.getElementById("viewOutput");
            dest.innerHTML = colorizer.process(src.value);
        }
    });
    translation.showTable();
    color.init();
    menu.select("instructions");
    return false;
}