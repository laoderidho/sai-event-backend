import { Hono } from "hono";
import displayController from "../../controller/display/display.controller";


const display = new Hono()

const DisplayController = new displayController

display.get('/image/:type/:id', c=> DisplayController.displayImage(c))


export default display