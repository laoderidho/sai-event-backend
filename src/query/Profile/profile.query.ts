export function getDataProfile (id: number, host: string) {
    return `select u.id, u.name, c.name as congregationName, r.name as regionName, u.email, u.no_telp, rl.name as roleName,
            '${host}display/image/profile/${id}' as linkImage 
            from user u join user_congregation uc on u.id = uc.user_id
            join congregation c on c.id = uc.congregation_id 
            join region r on r.id = c.region_id
            join role rl on rl.id = u.roleId
            where u.id = ${id}
            limit 1`
}