
export function getDatCongregation () {
    return `select c.name, c.id, r.name as regionName from congregation c 
            inner join region r on r.id = c.region_id;`
}