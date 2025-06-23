import { Hono } from "hono";
import CongregationController from "../../../controller/admin/congregation/conggregation.controller";


const congregation = new Hono();
const controller = new CongregationController


congregation.post("/add", c => controller.add(c))
congregation.get("/", c => controller.getAll(c))
congregation.get("/getByRegion/:region_id", c => controller.getByRegion(c))
congregation.get("/detail/:id", c => controller.getDetail(c))
congregation.put("/update/:id", c => controller.update(c))
congregation.delete("/delete/:id", c => controller.delete(c))


export default congregation