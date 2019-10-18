const w : number = window.innerWidth
const h : number = window.innerHeight
const scGap : number = 0.02
const strokeFactor : number = 90
const sizeFactor : number = 2.9
const nodes : number = 5
const MAXDEG : number = 180
const foreColor : string = "#3F51B5"
const backColor : string = "#BDBDBD"
const delay : number = 20

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.handleTap()
        stage.render()
    }
}

class DrawingUtil {

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawArc(context : CanvasRenderingContext2D, x : number, y : number, r : number, sc : number) {
        const updatingDeg : number = MAXDEG * ScaleUtil.sinify(sc)
        context.save()
        context.translate(x, y)
        context.beginPath()
        context.moveTo(0, 0)
        for (var i = 0; i <= updatingDeg; i++) {
            const xr : number = r * Math.cos(i * Math.PI / 180)
            const yr : number = r * Math.sin(i * Math.PI / 180)
            context.lineTo(xr, yr)
        }
        context.fill()
        context.restore()
    }

    static drawBlock(context : CanvasRenderingContext2D, x : number, h : number, size : number, sc : number) {
        const y : number = -(h - size) * ScaleUtil.sinify(sc)
        context.save()
        context.translate(x, y)
        context.fillRect(-size, -size, 2 * size, 2 * size)
        context.restore()
    }

    static drawABSNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        const gap : number = w / (nodes + 1)
        const size : number = gap / sizeFactor
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor
        context.strokeStyle = foreColor
        context.fillStyle = foreColor
        context.save()
        context.translate(gap * (i + 1), h / 2)
        DrawingUtil.drawBlock(context, 0, h / 2, size, scale)
        DrawingUtil.drawLine(context, -size, 0, size, 0)
        DrawingUtil.drawArc(context, 0, 0, size, scale)
        context.restore()
    }
}

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n
    }

    static sinify(scale : number) {
        return Math.sin(scale * Math.PI)
    }
}

class State {

    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        this.scale += this.dir * scGap
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class Animator {

    animated : boolean = false
    interval : number

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
