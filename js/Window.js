function Window(id) {
	var that = this;
	this.element = document.getElementById(id);

	var $header = that.element.getElementsByTagName("header")[0];
	$header.addEventListener("mousedown", mousedown, true);

	var orig;
	var start;
	function mousedown(e) {
		$header.addEventListener("mouseup", mouseup, true);
		$header.addEventListener("mousemove", mousemove, true);

		orig = new Point(that.element.offsetLeft, that.element.offsetTop);
		start = new Point(e.clientX, e.clientY);

		e.preventDefault();
		return false;
	}
	function mousemove(e) {
		that.element.style.left = orig.x + (e.clientX - start.x) + "px";
		that.element.style.top = orig.y + (e.clientY - start.y) + "px";
		console.log(that.element.style.left);

		e.preventDefault();
		return false;
	}
	function mouseup(e) {
		$header.removeEventListener("mouseup", mouseup, true);
		$header.removeEventListener("mousemove", mousemove, true);

		e.preventDefault();
		return false;
	}
}
Window.prototype.show = function () {
	this.element.style.display = "none"
}
Window.prototype.hide = function () {
	this.element.style.display = "inherit"
}
Window.prototype.toggle = function () {
	this.element.style.display = this.element.style.display == "none" ? "inherit" : "none";
}