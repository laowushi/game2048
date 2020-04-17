var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Matrix = /** @class */ (function () {
    function Matrix(w, h) {
        this.width = w;
        this.height = h;
        // this.data = this.init(0);
        this.init(0);
    }
    Matrix.prototype.init = function (v) {
        var dt = new Array(this.height);
        for (var y = 0; y < this.height; y += 1) {
            dt[y] = new Array(this.width);
        }
        for (var y = 0; y < this.height; y += 1) {
            for (var x = 0; x < this.width; x += 1) {
                dt[y][x] = v;
            }
        }
        this.data = dt;
    };
    Matrix.prototype.get = function (x, y) {
        if (this.data.length === 0 || x >= this.width || y >= this.height) {
            return;
        }
        return this.data[y][x];
    };
    Matrix.prototype.set = function (x, y, v) {
        if (this.data.length == 0 || this.data.length < y || x >= this.width || y >= this.height) {
            return;
        }
        this.data[y][x] = v;
    };
    Matrix.prototype.get_row = function (y) {
        return this.data[y];
    };
    Matrix.prototype.get_col = function (x) {
        var res = [];
        for (var y = 0; y < this.height; y += 1) {
            res.push(this.get(x, y));
        }
        return res;
    };
    Matrix.prototype.max = function () {
        var max = 0;
        for (var y = 0; y < this.height; y += 1) {
            for (var x = 0; x < this.width; x += 1) {
                if (this.get(x, y) >= max) {
                    max = this.get(x, y);
                }
            }
        }
        return max;
    };
    Matrix.prototype.min = function () {
        var min = this.get(0, 0);
        for (var y = 0; y < this.height; y += 1) {
            for (var x = 0; x < this.width; x += 1) {
                if (this.get(x, y) < min) {
                    min = this.get(x, y);
                }
            }
        }
        return min;
    };
    Matrix.prototype.rotate_90 = function () {
        var dt = [];
        for (var x = this.width - 1; x >= 0; x -= 1) {
            dt.push(this.get_col(x));
        }
        this.data = dt;
    };
    Matrix.prototype.rotate_180 = function () {
        this.rotate_90();
        this.rotate_90();
    };
    Matrix.prototype.rotate_270 = function () {
        this.rotate_90();
        this.rotate_90();
        this.rotate_90();
    };
    return Matrix;
}());
var Grid = /** @class */ (function (_super) {
    __extends(Grid, _super);
    function Grid(w, h) {
        var _this = _super.call(this, w, h) || this;
        // event
        window.addEventListener("keypress", function (e) {
            var key = e.key;
            if (key == 'a') {
                _this.move_left();
                _this.update_value(2, 1);
            }
            if (key == 'd') {
                _this.move_right();
                _this.update_value(2, 1);
            }
            if (key == 'w') {
                _this.move_up();
                _this.update_value(2, 1);
            }
            if (key == 's') {
                _this.move_down();
                _this.update_value(2, 1);
            }
        });
        return _this;
    }
    Grid.prototype.sum_row_left = function (row) {
        var len = row.length;
        if (len < 2) {
            return row;
        }
        var first = row[0];
        var second = row[1];
        var rest = row.slice(2, len);
        if (first == second) {
            return [first + second].concat(this.sum_row_left(rest));
        }
        else {
            return [first].concat(this.sum_row_left([second].concat(rest)));
        }
    };
    Grid.prototype.move_row_left = function (row) {
        var row_len = row.length;
        var nums = row.filter(function (x) { return x > 0; });
        var sumrow = this.sum_row_left(nums);
        var sumrow_len = sumrow.length;
        // test
        // console.log(nums)
        // console.log(sumrow)
        for (var pd = row_len - sumrow_len; pd > 0; pd -= 1) {
            sumrow.push(0);
        }
        return sumrow;
    };
    Grid.prototype.move_left = function () {
        var dt = [];
        for (var y = 0; y < this.height; y += 1) {
            dt.push(this.move_row_left(this.get_row(y)));
        }
        this.data = dt;
    };
    Grid.prototype.move_right = function () {
        this.rotate_180();
        this.move_left();
        this.rotate_180();
    };
    Grid.prototype.move_up = function () {
        this.rotate_90();
        this.move_left();
        this.rotate_270();
    };
    Grid.prototype.move_down = function () {
        this.rotate_270();
        this.move_left();
        this.rotate_90();
    };
    Grid.prototype.update_value = function (v, n) {
        var x = Math.min(Math.floor(Math.random() * this.width), this.width);
        var y = Math.min(Math.floor(Math.random() * this.height), this.height);
        for (var i = 0; i < n; i += 1) {
            while (this.get(x, y) > 0) {
                x = Math.min(Math.floor(Math.random() * this.width), this.width);
                y = Math.min(Math.floor(Math.random() * this.height), this.height);
            }
            this.set(x, y, v);
        }
    };
    Grid.prototype.is_win = function () {
        if (this.max() >= 2048) {
            return true;
        }
        return false;
    };
    Grid.prototype.is_lose = function () {
        if (this.min() > 0) {
            return true;
        }
        return false;
    };
    return Grid;
}(Matrix));
// render
var render = function (grd, cvs) {
    var w = grd.width;
    var h = grd.height;
    var ctx = cvs.getContext('2d');
    var bw = Math.floor(cvs.width / w) - 1;
    var bh = Math.floor(cvs.height / h) - 1;
    for (var y = 0; y < h; y += 1) {
        for (var x = 0; x < w; x += 1) {
            var pos_x = (bw + 1) * x;
            var pos_y = (bh + 1) * y;
            var v = grd.get(x, y);
            if (v == 0) {
                ctx.fillStyle = 'rgb(255, 0, 128)';
                ctx.fillRect(pos_x, pos_y, bw, bh);
            }
            else if (v >= 2) {
                var r = ((v * 24) % 255).toString();
                var g = ((v * 12) % 255).toString();
                var b = ((v * 4) % 255).toString();
                ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
                ctx.fillRect(pos_x, pos_y, bw, bh);
                ctx.fillStyle = "white";
                ctx.font = "12px serif";
                ctx.fillText(v.toString(), pos_x + bw / 2, pos_y + bh / 2);
            }
        }
    }
};
// main
function main() {
    var g = new Grid(5, 5);
    g.update_value(2, 8);
    var the_canvas = document.getElementById("canvas");
    var the_ctx = the_canvas.getContext('2d');
    setInterval(function () {
        if (g.is_win()) {
            the_ctx.fillStyle = "yellow";
            the_ctx.font = "64px serif";
            the_ctx.fillText("You Win!", the_canvas.width / 4, the_canvas.height / 2);
            return;
        }
        if (g.is_lose()) {
            the_ctx.fillStyle = "grey";
            the_ctx.font = "64px serif";
            the_ctx.fillText("You Lose!", the_canvas.width / 4, the_canvas.height / 2);
            return;
        }
        render(g, the_canvas);
    }, 1000 / 30);
}
main();
