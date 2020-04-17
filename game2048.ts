class Matrix {
    width: number;
    height: number;
    data: number[][];
    constructor(w:number, h:number) {
        this.width = w;
        this.height = h;
        this.data = this.init(0);
    }

    init(v:number): number[][] {
        let dt = new Array(this.height)
        for (let y=0; y<this.height; y+=1) {
            dt[y] = new Array(this.width)
        }
        for (let y=0; y<this.height; y+=1) {
            for (let x=0; x<this.width; x+=1) {
                dt[y][x] = v
            }
        }
        return dt;
    }

    get(x:number, y:number): number {
        if (this.data.length === 0 || x>=this.width || y>=this.height) { return; }
        return this.data[y][x]
    }

    set(x:number, y:number, v:number):void {
        if (this.data.length == 0 || this.data.length < y || x>=this.width || y>=this.height) { return; }
        this.data[y][x] = v
    }

    get_row(y:number): number[] {
        return this.data[y];
    }

    get_col(x:number): number[] {
        let res = []
        for (let y=0; y<this.height; y+=1) {
            res.push(this.get(x, y))
        }
        return res;
    }
    max():number {
        let max = 0
        for (let y=0; y<this.height;y+=1) {
            for (let x=0; x<this.width; x+=1) {
                if (this.get(x, y) >= max) {
                    max = this.get(x, y)
                }
            }
        }
        return max;
    }
    rotate_90(){
        let dt = []
        for (let x=this.width-1; x>=0; x-=1) {
            dt.push(this.get_col(x))
        }
        // for (let y=0;y<this.height;y+=1) {
        //     for (let x=0; x<this.width; x+=1) {
        //         this.data[y][x] = dt[y][x]
        //     }
        // }
        this.data = dt
    }
    rotate_180() {
        this.rotate_90()
        this.rotate_90()
    }
    rotate_270() {
        this.rotate_90()
        this.rotate_90()
        this.rotate_90()
    }
}

// let m = new Matrix(4, 4)
// console.log(m)
// // console.log(m.get(3, 8))
// m.set(3, 3, 2)
// m.set(0, 0, 4)
// m.set(3, 0, 3)
// m.set(0, 3, 1)
// // console.log(m.get(3, 8))
// console.log(m)
// m.rotate_90()
// console.log(m)
class Grid extends Matrix{
    constructor(w:number, h:number) {
        super(w, h)
        // event
        window.addEventListener("keypress", (e)=>{
            let key = e.key
            if (key == 'a') {
                this.move_left()
                this.update_value(2,1)
            }
            if (key == 'd') {
                this.move_right()
                this.update_value(2,1)
            }
            if (key == 'w') {
                this.move_up()
                this.update_value(2,1)
            }
            if (key == 's') {
                this.move_down()
                this.update_value(2,1)
            }
        })
    }
    sum_row_left(row:number[]): number[]{
        let len:number = row.length
        if (len < 2) { return row }
        let first = row[0]
        let second = row[1]
        let rest = row.slice(2,len)
        if (first == second) {
            return [first + second].concat(this.sum_row_left(rest))
        } else {
            return [first].concat(this.sum_row_left([second].concat(rest)))
        }
    }
    move_row_left(row: number[]):number[] {
        let row_len = row.length
        let nums = row.filter((x)=>{ return x>0 })
        let sumrow = this.sum_row_left(nums)
        let sumrow_len = sumrow.length
        // test
        console.log(nums)
        console.log(sumrow)
        
        for (let pd=row_len-sumrow_len;pd>0;pd-=1) {
            sumrow.push(0)
        }
        return sumrow;
    }
    move_left(){
        let dt = []
        for (let y=0;y<this.height;y+=1) {
            dt.push(this.move_row_left(this.get_row(y)))
        }
        this.data = dt
    }
    move_right() {
        this.rotate_180()
        this.move_left()
        this.rotate_180()
    }
    move_up() {
        this.rotate_90()
        this.move_left()
        this.rotate_270()
    }
    move_down() {
        this.rotate_270()
        this.move_left()
        this.rotate_90()
    }
    update_value(v:number, n: number) {
        let x = Math.min(Math.floor(Math.random() * this.width),this.width)
        let y = Math.min(Math.floor(Math.random() * this.height),this.height)
        for (let i=0; i<n; i+=1) {
            while (this.get(x, y)>0) {
                x = Math.min(Math.floor(Math.random() * this.width),this.width)
                y = Math.min(Math.floor(Math.random() * this.height),this.height)
            }
            this.set(x, y, v)
        }
    }
    is_win():boolean {
        if (this.max() >= 2048) {
            return true
        }
        return false
    }
}


// render
const render = (grd: Grid, cvs:HTMLCanvasElement) => {
    let w = grd.width
    let h = grd.height
    let ctx = cvs.getContext('2d')
    let bw = Math.floor(cvs.width/w)-1
    let bh = Math.floor(cvs.height/h)-1
    for (let y=0; y<h; y+=1) {
        for (let x=0; x<w; x+=1) {
            let pos_x = (bw+1) * x
            let pos_y = (bh+1) * y
            if (grd.get(x, y) == 0) {
                    ctx.fillStyle = 'rgb(255, 0, 128)'
                    ctx.fillRect(pos_x, pos_y, bw, bh)
            } else  if (grd.get(x, y)>=2){                
                let v = grd.get(x, y)
                
                let r = ((v*24) % 255).toString()
                let g = ((v*12) % 255).toString()
                let b = ((v*4) % 255).toString()
                ctx.fillStyle = 'rgb('+ r + ',' + g + ',' + b + ')'
                // ctx.fillStyle =  "red"
                ctx.fillRect(pos_x, pos_y, bw, bh)
                ctx.fillStyle = "white"
                ctx.font = "12px serif"
                ctx.fillText(grd.get(x, y).toString(), pos_x + bw/2, pos_y + bh/2)
            }
                   
        }
    }
}
// 测试

function main() {
    let g = new Grid(8, 8)
    g.update_value(2, 8)
    // console.log(g)
    // g.move_left()
    // console.log(g)
    let the_canvas= <HTMLCanvasElement>document.getElementById("canvas")
    let the_ctx =  the_canvas.getContext('2d')
    setInterval(()=>{
        if (g.is_win()) {
            the_ctx.fillStyle = "whitle"
            the_ctx.font = "64px serif"
            the_ctx.fillText("You Win!", the_canvas.width/4, the_canvas.height/2)
            return;
        }
        render(g, the_canvas)
    }, 1000/30)

}

main()
// g.move_left()
// render(g, the_canvas)