import { Hono } from "hono";
import RegionController from "../../../controller/admin/region/region.controller";

const region = new Hono();

const controller = new RegionController

region.post("/add", (c)=> controller.add(c))
region.get("/", (c)=> controller.get(c))
region.get("/detail/:id", (c)=> controller.getDetail(c))
region.put("/update/:id", (c)=> controller.update(c))
region.delete("/delete/:id", (c)=> controller.delete(c))

export default region