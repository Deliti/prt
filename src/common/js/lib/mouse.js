var temp = {
    pt: [],
    mk: [],
    iw: [],
    iwOpenIndex: null,
    mouseLabel: null,
    poiSearchMark: null,
    geoCoder: null
};
function createMouseMoveLabel(map,c) {
    var a = map.pixelToPoint(new BMap.Pixel(0, 0));
    var b = c.lng + "," + c.lat;
    var d = new BMap.Label(b, {
        point: a,
        offset: new BMap.Size(13, 20),
        enableMassClear: false
    });
    d.setStyle({
        background: "#fff",
        border: "#999 solid 1px",
        zIndex: 10000000
    });
    map.addOverlay(d);
    temp.mouseLabel = d;
}
const mouseEnterHandle = function(c){
    this.setDefaultCursor("crosshair");
    if (!temp.mouseLabel) {
        createMouseMoveLabel(this,c.point)
    }
    if (!temp.mouseLabel.isVisible()) {
        temp.mouseLabel.show()
    }
    var k = temp.mouseLabel;
    var h = this.getContainer();
    var g = h.clientWidth;
    var f = h.clientHeight;
    var j = 132;
    var i = 19;
    var n = this.pointToPixel(c.point).x + 13;
    var l = this.pointToPixel(c.point).y + 20;
    var m = this.pixelToPoint(new BMap.Pixel(g - j - 13, f - i - 20));
    var b = this.pixelToPoint(new BMap.Pixel(n - j - 33, f - i - 20));
    var d = c.point;
    if (g - n < j) {
        d = new BMap.Point(m.lng, d.lat)
    }
    if (f - l < i) {
        d = new BMap.Point(d.lng, m.lat)
    }
    if (g - n - 16 < j && f - l < i) {
        d = b
    }
    k.setPosition(d);
    k.setContent(c.point.lng + "," + c.point.lat)
}

const mouseOutHandle = function(c){
    debugger
    if (temp.mouseLabel && temp.mouseLabel.isVisible()) {
        temp.mouseLabel.hide()
    }
}
module.exports = {
    mouseEnterHandle,
    mouseOutHandle 
}