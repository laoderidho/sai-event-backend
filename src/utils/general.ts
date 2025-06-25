export const getUserNameType = (username: string): "no_telp" | "email" => {
     if (!isNaN(Number(username))){
            return "no_telp"
        }else{
            return "email"
        }
}