import { Hono } from "hono";
import CongregationController from "../../controller/admin/congregation/conggregation.controller";
import RegionController from "../../controller/admin/region/region.controller";

const data = new Hono()

const congregation = new CongregationController
const region = new RegionController

data.get("/congregation/:region_id", c => congregation.getByRegion(c))
data.get("/region", c => region.get(c))

export default data