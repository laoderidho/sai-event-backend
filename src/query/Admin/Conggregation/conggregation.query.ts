
export function getDatCongregation () {
    return `select c.name, c.id, r.name as regionName, r.id as region_id from congregation c 
            inner join region r on r.id = c.region_id order by c.createdAt asc;`
}