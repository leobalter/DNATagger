function Menu(first, items) {
    this.items = items;
    this.last = first;
    this.select = function(item) {
        document.getElementById("m_" + this.last).className = "";
        document.getElementById("d_" + this.last).style.display = "none";
        this.last = item;
        document.getElementById("m_" + item).className = "here";
        document.getElementById("d_" + item).style.display = "block";
        this.items[item]();
        return false;
    };
}