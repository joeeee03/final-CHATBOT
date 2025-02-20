
import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { BlackList } from '@builderbot/bot/dist/utils'

const PORT = process.env.PORT ?? 3008

const contadorsaludo = {}

const saludo = addKeyword(EVENTS.WELCOME)
  .addAction(async (ctx, { flowDynamic, blacklist }) => {
    // Asegurar que contadorsaludo[ctx.from] tenga un valor inicial
    if (contadorsaludo[ctx.from] === undefined) {
      contadorsaludo[ctx.from] = 0;
    }

    if (contadorsaludo[ctx.from] === 0) {  // Corregido: comparación en lugar de asignación
      await flowDynamic(`¡Hola! Soy el asistente de Avon.\n\nEscribe "MENU" y estaré encantado de guiarte con las dudas que tengas. 😊`);
      contadorsaludo[ctx.from] = 1;  // Mantener el contador
    } else if (contadorsaludo[ctx.from] === 1) {  // Corregido
      await flowDynamic(`No encontré "MENU" en tu respuesta. Escríbelo cuando quieras y con gusto te ayudo. 💗`);
      contadorsaludo[ctx.from] = 0;  // Mantener el contador
      try {
        // Agregar el usuario a la blacklist
        blacklist.add(ctx.from);
        console.log(`${ctx.from} añadido a la blacklist.`);

        // Configurar el temporizador para eliminar al usuario de la blacklist después de 1 minuto
        setTimeout(() => {
            try {
                blacklist.remove(ctx.from);
                console.log(`${ctx.from} eliminado de la blacklist después de 1 minuto.`);
            } catch (err) {
                console.error(`Error al eliminar de la blacklist: ${err.message}`);
            }
        }, 3 * 60 * 60 * 1000); // 3 horas en milisegundos
    } catch (err) {
        console.error(`Error al agregar a la blacklist: ${err.message}`);
    }
    }
  });

const inicio = addKeyword(EVENTS.ACTION)
.addAnswer(`Por favor, seleccione una opcion 👇`)
.addAnswer(
    [
        '*a.* Cómo empezar\n*b.* Acompañamiento\n*c.* Volver al menú',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B","c","C","d","D"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(empezar);
                case "A":
                    return gotoFlow(empezar);
                    case "b":
                        return gotoFlow(regalo);
                        case "B":
                            return gotoFlow(regalo);
                    case "c":
                        return gotoFlow(menuprincipal);
                        case "C":
                            return gotoFlow(menuprincipal);
    
        }
    },
);

const ventasyganancias = addKeyword(EVENTS.ACTION)
.addAnswer(`Por favor, seleccione una opcion 👇`)
.addAnswer(
    [
        '*a.* Importes por ventas\n*b.* Ganancias\n*c.* Ventas en cuotas\n*d.* Volver al menú',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B","c","C","d","D"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(importes);
                case "A":
                    return gotoFlow(importes);
                    case "b":
                        return gotoFlow(ganancias);
                        case "B":
                            return gotoFlow(ganancias);
                    case "c":
                        return gotoFlow(cuotas);
                        case "C":
                            return gotoFlow(cuotas);
                            case "d":
                        return gotoFlow(menuprincipal);
                        case "D":
                            return gotoFlow(menuprincipal);
    
        }
    },
);

const materialdeapoyo = addKeyword(EVENTS.ACTION)
.addAnswer(`Por favor, seleccione una opcion 👇`)
.addAnswer(
    [
        '*a.* Ver folletos\n*b.* Folleto digital AVON\n*c.* Volver al menú',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B","c","C","d","D"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(folletos);
                case "A":
                    return gotoFlow(folletos);
                    case "b":
                        return gotoFlow(fdigital);
                        case "B":
                            return gotoFlow(fdigital);
                    case "c":
                        return gotoFlow(menuprincipal);
                        case "C":
                            return gotoFlow(menuprincipal);
    
        }
    },
);

const pedidosyfacturacion = addKeyword(EVENTS.ACTION)
.addAnswer(`Por favor, seleccione una opcion 👇`)
.addAnswer(
    [
        '*a.* Pasar mi pedido\n*b.* Factura de revendedora\n*c.* Volver al menú',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B","c","C","d","D"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(pasarpedido);
                case "A":
                    return gotoFlow(pasarpedido);
                    case "b":
                        return gotoFlow(factura);
                        case "B":
                            return gotoFlow(factura);
                    case "c":
                        return gotoFlow(menuprincipal);
                        case "C":
                            return gotoFlow(menuprincipal);
    
        }
    },
);

const campañasypromociones = addKeyword(EVENTS.ACTION)
.addAnswer(`Por favor, seleccione una opcion 👇`)
.addAnswer(
    [
        '*a.* Link personal campaña\n*b.* Duración de la campaña\n*c.* Volver al menú',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B","c","C","d","D"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(link);
                case "A":
                    return gotoFlow(link);
                    case "b":
                        return gotoFlow(fechas);
                        case "B":
                            return gotoFlow(fechas);
                    case "c":
                        return gotoFlow(menuprincipal);
                        case "C":
                            return gotoFlow(menuprincipal);
    
        }
    },
);

const regalo = addKeyword(EVENTS.ACTION)   
.addAnswer(`¡Mira como te *acompañamos* en cada paso de tu camino! 👀👇🏻`)
.addAnswer(` `, {
    media: "https://i.postimg.cc/fkn6G5xc/Whats-App-Image-2025-01-25-at-11-10-32.png"
})
.addAnswer(
    [
        '*a.* Volver al menú\n*b.* Finalizar',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(menuprincipal);
                case "A":
                    return gotoFlow(menuprincipal);
            case "b":
                return gotoFlow(finalizar);
                case "B":
                    return gotoFlow(finalizar);
    
        }
    },
);

const datospersonales = addKeyword(EVENTS.ACTION)   
.addAnswer(`Te dejo unas imagenes para que puedas *actualizar tus datos personales* 👀👇🏻`)
.addAnswer(` `, {
    media: "https://i.postimg.cc/59hy9Vg3/Whats-App-Image-2025-01-25-at-11-13-28.jpg"
})
.addAnswer(` `, {
    media: "https://i.postimg.cc/Jny7m6Bv/Whats-App-Image-2025-01-25-at-11-13-30.jpg"
})
.addAnswer(
    [
        '*a.* Volver al menú\n*b.* Finalizar',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(menuprincipal);
                case "A":
                    return gotoFlow(menuprincipal);
            case "b":
                return gotoFlow(finalizar);
                case "B":
                    return gotoFlow(finalizar);
    
        }
    },
);


const empezar = addKeyword(EVENTS.ACTION)   
.addAnswer(`¡Aquí tienes el video con toda la información *para empezar!* 👀👇🏻`)
.addAnswer(` `, {
    media: "https://ik.imagekit.io/sfoxlr1gr/VID-20250121-WA0030.mp4?updatedAt=1737599247842"
})
.addAnswer(
    [
        '*a.* Volver al menú\n*b.* Finalizar',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        try {
           
        if (!["a","b"].includes(ctx.body.trim().toLowerCase())) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body.trim().toLowerCase()){
            case "a":
                return gotoFlow(menuprincipal);
            case "b":
                return gotoFlow(finalizar);
    
        }
    } catch (error) {
        console.error('Error en el flujo empezar:', error);
        return fallBack('Ocurrió un error. Por favor, intenta nuevamente.');
    }
    },
);

const importes = addKeyword(EVENTS.ACTION)
.addAnswer(`🌟 Para quienes recién inician:\nEl mínimo de venta es de *$50000* y el máximo es de *$70000.*\n\n🔸 ¿Qué significa esto?\nPueden vender todo lo que deseen, ¡sin límite! 🙌\n
Si se exceden del máximo, deben adelantar el pago de la mercancía extra durante las primeras *6 campañas.*\n\n✅ Después de la *7ª campaña*, y según el cumplimiento, podrán acceder a más crédito.`)
.addAnswer(
    [
        '*a.* Volver al menú\n*b.* Finalizar',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(menuprincipal);
                case "A":
                    return gotoFlow(menuprincipal);
            case "b":
                return gotoFlow(finalizar);
                case "B":
                    return gotoFlow(finalizar);
    
        }
    },
);

const ganancias = addKeyword(EVENTS.ACTION)
.addAnswer(`Aca abajo te dejo una imagen con las *ganancias que obtendras* 👀👇🏻`)
.addAnswer(` `, {
    media: "https://i.postimg.cc/nV26RhzN/imagen-2025-01-21-203222869-transformed.png"
})
.addAnswer(
    [
        '*a.* Volver al menú\n*b.* Finalizar',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(menuprincipal);
                case "A":
                    return gotoFlow(menuprincipal);
            case "b":
                return gotoFlow(finalizar);
                case "B":
                    return gotoFlow(finalizar);
    
        }
    },
);

const registros = addKeyword(EVENTS.ACTION)
.addAnswer(`Por favor, seleccione en donde desea registrarse 👇`)
.addAnswer(
    [
        '*a.* MI ESPACIO AVON\n*b.* MI MUNDO AVON\n*c.* Volver al menú',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B","c","C"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(registro);
                case "A":
                    return gotoFlow(registro);
            case "b":
                return gotoFlow(registro2);
                case "B":
                    return gotoFlow(registro2);
                    case "c":
                        return gotoFlow(menuprincipal);
                        case "C":
                            return gotoFlow(menuprincipal);
    
        }
    },
);
 
const registro = addKeyword(EVENTS.ACTION)
.addAnswer(`Aca abajo te dejo un video explicativo para *registrarte en "Mi espacio AVON"* 👀👇🏻`)
.addAnswer(` `, {
    media: "https://ik.imagekit.io/sfoxlr1gr/Mi%20Espacio%20Avon%20-%20C%C3%B3mo%20Registrarse%20-%20Entrenamiento%20Avon%20Argentina%20(720p,%20h264).mp4?updatedAt=1737600011721"
})
.addAnswer(
    [
        '*a.* Volver al menú\n*b.* Finalizar',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(menuprincipal);
                case "A":
                    return gotoFlow(menuprincipal);
            case "b":
                return gotoFlow(finalizar);
                case "B":
                    return gotoFlow(finalizar);
    
        }
    },
);

const registro2 = addKeyword(EVENTS.ACTION)
.addAnswer(`Aca abajo te dejo un video explicativo para *registrarte en "Mi mundo AVON"* 👀👇🏻`)
.addAnswer(` `, {
    media: "https://ik.imagekit.io/eg3f7jpnp/Como%20registrarte%20en%20MI%20MUNDO%20AVON%20%E2%AD%90%EF%B8%8F%20a%20trav%C3%A9s%20de%20mensaje%20de%20texto!.mp4?updatedAt=1737506212109"
})
.addAnswer(
    [
        '*a.* Volver al menú\n*b.* Finalizar',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(menuprincipal);
                case "A":
                    return gotoFlow(menuprincipal);
            case "b":
                return gotoFlow(finalizar);
                case "B":
                    return gotoFlow(finalizar);
    
        }
    },
);

const cuotas = addKeyword(EVENTS.ACTION)
.addAnswer(`✨ *VENTAS EN CUOTA* ✨\n\nPara acceder a esta opción, necesitas al menos *6 campañas de antigüedad. 🌟*\n\nAsí podrás aprovechar este beneficio y ofrecer más facilidades a tus clientes. 💳😊`)
.addAnswer(
    [
        '*a.* Volver al menú\n*b.* Finalizar',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(menuprincipal);
                case "A":
                    return gotoFlow(menuprincipal);
            case "b":
                return gotoFlow(finalizar);
                case "B":
                    return gotoFlow(finalizar);
    
        }
    },
);

const folletos = addKeyword(EVENTS.ACTION)
.addAnswer(`Seleccione el folleto que deseas ver 👇`)
.addAnswer(
    [
        '*a.* Folleto HOME\n*b.* Folleto CÓSMETICA\n*c.* Volver al menú',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B","c","C"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(fhome);
                case "A":
                    return gotoFlow(fhome);
            case "b":
                return gotoFlow(fcosmetica);
                case "B":
                    return gotoFlow(fcosmetica);
                    case "c":
                        return gotoFlow(menuprincipal);
                        case "C":
                            return gotoFlow(menuprincipal);
    
        }
    },
);

const fhome = addKeyword(EVENTS.ACTION)
.addAnswer(`Te comparto el *Folleto HOME* en PDF para que lo veas fácilmente 👀👇🏻`)
.addAnswer(` `, {
    media: "https://ik.imagekit.io/sfoxlr1gr/FashionNHome_C0225-1.pdf?updatedAt=1737600085827"
})
.addAnswer(
    [
        '*a.* Volver al menú\n*b.* Finalizar',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(menuprincipal);
                case "A":
                    return gotoFlow(menuprincipal);
            case "b":
                return gotoFlow(finalizar);
                case "B":
                    return gotoFlow(finalizar);
    
        }
    },
);

const fcosmetica = addKeyword(EVENTS.ACTION)
.addAnswer(`Te comparto el *Folleto COSMÉTICA* en PDF para que lo veas fácilmente 👀👇🏻`)
.addAnswer(` `, {
    media: "https://ik.imagekit.io/sfoxlr1gr/Cosmetica_C0225-1_compressed.pdf?updatedAt=1737600307724"
})
.addAnswer(
    [
        '*a.* Volver al menú\n*b.* Finalizar',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(menuprincipal);
                case "A":
                    return gotoFlow(menuprincipal);
            case "b":
                return gotoFlow(finalizar);
                case "B":
                    return gotoFlow(finalizar);
    
        }
    },
);

const fdigital = addKeyword(EVENTS.ACTION)
.addAnswer(`¡Aquí tienes un video explicativo sobre los *folletos digitales de AVON!* 👀👇🏻`)
.addAnswer(` `, {
    media: "https://ik.imagekit.io/sfoxlr1gr/Descubr%C3%AD%20el%20Folleto%20Digital%20Avon.mp4?updatedAt=1737599237532"
})
.addAnswer(
    [
        '*a.* Volver al menú\n*b.* Finalizar',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(menuprincipal);
                case "A":
                    return gotoFlow(menuprincipal);
            case "b":
                return gotoFlow(finalizar);
                case "B":
                    return gotoFlow(finalizar);
    
        }
    },
);

const pasarpedido = addKeyword(EVENTS.ACTION)
.addAnswer(`Por favor, seleccioná el dispositivo con el que quieres pasar el pedido 👇`)
.addAnswer(
    [
        '*a.* Celular\n*b.* Computadora\n*c.* Volver al menú',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B","c","C"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(pasarpedidocelular);
                case "A":
                    return gotoFlow(pasarpedidocelular);
            case "b":
                return gotoFlow(pasarpedidocomputadora);
                case "B":
                    return gotoFlow(pasarpedidocomputadora);
                    case "c":
                        return gotoFlow(menuprincipal);
                        case "C":
                            return gotoFlow(menuprincipal);
    
        }
    },
);

const pasarpedidocelular = addKeyword(EVENTS.ACTION)
.addAnswer(`Aca abajo te dejo un video para *pasar el pedido desde tu celular* 👀👇🏻`)
.addAnswer(` `, {
    media: "https://ik.imagekit.io/eg3f7jpnp/AQON6cc45cw-NTK76GrcRWZyMibzRptWgeQrACn2vxgeVP_0C5KX6N5-i4rog7niVDw9F-34a-sVWmZ1JekAO_wh.mp4?updatedAt=1737506675140"
})
.addAnswer(
    [
        '*a.* Volver al menú\n*b.* Finalizar',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(menuprincipal);
                case "A":
                    return gotoFlow(menuprincipal);
            case "b":
                return gotoFlow(finalizar);
                case "B":
                    return gotoFlow(finalizar);
    
        }
    },
);

const pasarpedidocomputadora = addKeyword(EVENTS.ACTION)
.addAnswer(`Ya te mando el video para *pasar tu pedido desde la computadora* 👀👇🏻`)
.addAnswer(` `, {
    media: "https://ik.imagekit.io/eg3f7jpnp/C%C3%B3mo%20Cargar%20Pedido%20desde%20Computadora.mp4?updatedAt=1737507460347"
})
.addAnswer(
    [
        '*a.* Volver al menú\n*b.* Finalizar',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(menuprincipal);
                case "A":
                    return gotoFlow(menuprincipal);
            case "b":
                return gotoFlow(finalizar);
                case "B":
                    return gotoFlow(finalizar);
    
        }
    },
);

const factura = addKeyword(EVENTS.ACTION)
.addAnswer(`Te envío el video donde te explicamos cómo *descargar y pagar la factura* 👀👇🏻`)
.addAnswer(` `, {
    media: "https://ik.imagekit.io/eg3f7jpnp/Tu%20Factura%20Avon.%20_D%C3%B3nde%20encontrarla%20y%20c%C3%B3mo%20pagarla_.mp4?updatedAt=1737508393594"
})
.addAnswer(
    [
        '*a.* Volver al menú\n*b.* Finalizar',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(menuprincipal);
                case "A":
                    return gotoFlow(menuprincipal);
            case "b":
                return gotoFlow(finalizar);
                case "B":
                    return gotoFlow(finalizar);
    
        }
    },
);

const cambios = addKeyword(EVENTS.ACTION)
.addAnswer(`Te envío el video explicativo sobre cómo *gestionar cambios y devoluciones* 👀👇🏻`)
.addAnswer(` `, {
    media: "https://ik.imagekit.io/eg3f7jpnp/Gestion%20de%20Cambios%20y%20Devoluciones.mp4?updatedAt=1737508734534"
})
.addAnswer(
    [
        '*a.* Volver al menú\n*b.* Finalizar',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(menuprincipal);
                case "A":
                    return gotoFlow(menuprincipal);
            case "b":
                return gotoFlow(finalizar);
                case "B":
                    return gotoFlow(finalizar);
    
        }
    },
);

const acceso = addKeyword(EVENTS.ACTION)
.addAnswer(`Puedes acceder a la página de Avon mediante el siguiente enlace 👀👇🏻\n\nhttps://www.ar.avon.com/REPSuite/loginMain.page 🌐\n\n¡Ahí encontrarás todo lo que necesitas!`)
.addAnswer(
    [
        '*a.* Volver al menú\n*b.* Finalizar',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(menuprincipal);
                case "A":
                    return gotoFlow(menuprincipal);
            case "b":
                return gotoFlow(finalizar);
                case "B":
                    return gotoFlow(finalizar);
    
        }
    },
);

const link = addKeyword(EVENTS.ACTION)
.addAnswer(`Ya mismo te comparto el video para crear tu *link personalizado* 👀👇🏻`)
.addAnswer(` `, {
    media: "https://ik.imagekit.io/sfoxlr1gr/Tu%20Link%20Personal.mp4?updatedAt=1737599231516"
})
.addAnswer(
    [
        '*a.* Volver al menú\n*b.* Finalizar',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(menuprincipal);
                case "A":
                    return gotoFlow(menuprincipal);
            case "b":
                return gotoFlow(finalizar);
                case "B":
                    return gotoFlow(finalizar);
    
        }
    },
);

const fechas = addKeyword(EVENTS.ACTION)
.addAnswer("Las *fechas de las campañas activas* se muestran directamente en el ícono de cada grupo, dependiendo de la campaña en la que estés.\n\n✅ Así podrás ver al instante:\n\n- *Estado* de la campaña.\n- *Duración* de la campaña.")
.addAnswer(
    [
        '*a.* Volver al menú\n*b.* Finalizar',
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
        if (!["a","b","A","B"].includes(ctx.body)) {
            return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch(ctx.body){
            case "a":
                return gotoFlow(menuprincipal);
                case "A":
                    return gotoFlow(menuprincipal);
            case "b":
                return gotoFlow(finalizar);
                case "B":
                    return gotoFlow(finalizar);
    
        }
    },
);

const otraduda = addKeyword(EVENTS.ACTION)
    .addAnswer(
        `Déjame en el siguiente mensaje tu duda, en breve te responderemos`,
        { capture: true } // Habilita la captura de respuestas
    )
    .addAction(async (ctx, { blacklist, gotoFlow }) => {  // Cambié a async
        try {
            // Agregar el usuario a la blacklist
            blacklist.add(ctx.from);
            console.log(`${ctx.from} añadido a la blacklist.`);

            // Configurar el temporizador para eliminar al usuario de la blacklist después de 1 minuto
            setTimeout(() => {
                try {
                    blacklist.remove(ctx.from);
                    console.log(`${ctx.from} eliminado de la blacklist después de 1 minuto.`);
                } catch (err) {
                    console.error(`Error al eliminar de la blacklist: ${err.message}`);
                }
            }, 3 * 60 * 60 * 1000); // 3 horas en milisegundos
        } catch (err) {
            console.error(`Error al agregar a la blacklist: ${err.message}`);
        }
        return gotoFlow(dudarecibida);  // Usamos await aquí
    });


    const dudarecibida = addKeyword(EVENTS.ACTION)
    .addAnswer(`¡Gracias por dejarnos tu consulta! En breves recibiras respuestas`)
 
const finalizar = addKeyword(EVENTS.ACTION)
.addAnswer(`¡Gracias por contactarme! Si tienes más dudas o necesitas más información, solo escribe "Hola" 👋🏻`)

const menuprincipal = addKeyword(["Hola", "Menu", "Menú"])
    .addAnswer(`¿En qué puedo ayudarte? Responde con la letra de la opción que necesitas.`)
    .addAnswer(
        [
            '*a.* 🚀 Inicio y acompañamiento\n*b.* 💰 Ventas y ganancias\n*c.* 📚 Material de apoyo\n*d.* 🛒 Pedidos y facturación\n*e.* 🎯 Campañas y promociones\n*f.* 🔄 Cambios y devoluciones\n*g.* 🌐 Acceso página de Avon\n*h.* ✏️ Actualizar datos\n*i.* ❓ Otra consulta',
        ].join('\n'),
        { capture: true },
        async (ctx, { gotoFlow, fallBack }) => {
            try {
            if (!["a","b","c","d","e","f","g","h","A","B","C","D","E","F","G","H","i","I"].includes(ctx.body)) {
                return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
            }
            switch(ctx.body){
                case "a":
                    return gotoFlow(inicio);
                    case "A":
                        return gotoFlow(inicio);
                case "b":
                    return gotoFlow(ventasyganancias);
                    case "B":
                        return gotoFlow(ventasyganancias);
                case "c":
                    return gotoFlow(materialdeapoyo);
                    case "C":
                        return gotoFlow(materialdeapoyo);
                case "d":
                    return gotoFlow(pedidosyfacturacion);
                    case "D":
                            return gotoFlow(pedidosyfacturacion);
                case "e":
                    return gotoFlow(campañasypromociones);
                    case "E":
                        return gotoFlow(campañasypromociones);
                case "f":
                    return gotoFlow(cambios);
                    case "F":
                        return gotoFlow(cambios);
                case "g":
                    return gotoFlow(acceso);
                    case "G":
                        return gotoFlow(acceso);
                        case "h":
                            return gotoFlow(datospersonales);
                        case "H":
                            return gotoFlow(datospersonales);
                case "i":
                        return gotoFlow(otraduda);
                    case "I":
                        return gotoFlow(otraduda);
            }
        } catch (error) {
            console.error('Error en el menú principal:', error)
            return fallBack('Ocurrió un error. Por favor, intenta de nuevo.')
        }
        },
    );
   
    const administrador = addKeyword("adminirma")
    .addAnswer(`Este es el panel de administrador, que desea hacer? 👇🏻`)
    .addAnswer(
        [
            '*a.* Agregar a la blacklist\n*b.* Eliminar de la blacklist',
        ].join('\n'),
        { capture: true },
        async (ctx, { gotoFlow, fallBack }) => {
            if (!["a","b","A","B"].includes(ctx.body)) {
                return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
            }
            switch(ctx.body){
                case "a":
                    return gotoFlow(agregarbl);
                    case "A":
                        return gotoFlow(agregarbl);
                case "b":
                    return gotoFlow(eliminarbl);
                    case "B":
                        return gotoFlow(eliminarbl);
            }
        },
    );

    const agregarbl = addKeyword(EVENTS.ACTION)
    .addAnswer(
      `Indíqueme el número de teléfono de la persona`,
      { capture: true } // Habilita la captura de respuestas
    )
    .addAction(async (ctx, { blacklist, flowDynamic }) => { // Agregar async aquí
        try {
        // Agregar el número limpio a la blacklist
        blacklist.add(ctx.body.replace(/\D/g, ""));
        console.log(`${ctx.body.replace(/\D/g, "")} añadido a la blacklist.`);
  
        // Enviar un mensaje confirmando que el número se añadió a la blacklist
        await flowDynamic(`${ctx.body.replace(/\D/g, "")} ha sido añadido a la blacklist.`); // Usar await
    } catch (error) {
        console.error(`Error al agregar a la blacklist:`, error);
        await flowDynamic(`Hubo un error al agregar el número a la blacklist. Por favor, intente nuevamente.`);
    }
    });
  

    const eliminarbl = addKeyword(EVENTS.ACTION)
    .addAnswer(
      `Indíqueme el número de teléfono de la persona`,
      { capture: true } // Habilita la captura de respuestas
    )
    .addAction(async (ctx, { blacklist, flowDynamic }) => { // Añadir async aquí
      try {
        // Eliminar el número limpio de la blacklist
        blacklist.remove(ctx.body.replace(/\D/g, ""));
        console.log(`${ctx.body.replace(/\D/g, "")} removido de la blacklist.`);
  
        // Enviar un mensaje confirmando que el número fue removido
        await flowDynamic(`${ctx.body.replace(/\D/g, "")} ha sido removido de la blacklist.`); // Usar await
      } catch (err) {
        console.error(`Error al eliminar de la blacklist: ${err.message}`);
      }
    });

const main = async () => {
    try {
    const adapterFlow = createFlow([saludo, menuprincipal, inicio, ventasyganancias, materialdeapoyo, pedidosyfacturacion, campañasypromociones, datospersonales, empezar, regalo, importes, ganancias,cuotas,fhome, fcosmetica, folletos, fdigital, registro, registro2, registros, pasarpedido, pasarpedidocelular, pasarpedidocomputadora, factura, cambios,acceso,link,otraduda,dudarecibida, finalizar, administrador, eliminarbl, agregarbl, fechas])
    
    const adapterProvider = createProvider(Provider)
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    httpServer(+PORT)

} catch (error) {
    console.error('Error en la función principal:', error)
}
}

main()