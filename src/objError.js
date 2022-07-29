class ObjError {
    constructor(estado, mensaje, detalles) {
        this.estado = estado
        this.mensaje = mensaje
        this.detalles = detalles
    }
}

module.exports = ObjError