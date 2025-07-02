import { prisma } from '../../utils/prisma'
import { userId as defaultRoleId } from '../../config/general.config';
import ILogin from '../../interface/auth/login.interface';
import { HTTPException } from 'hono/http-exception'
import {sign} from 'hono/jwt'
import { secretAccessToken, secretRefreshToken } from '../../config/jwtSecret.config';
import { setCookie } from "hono/cookie";
import { Context } from 'hono';
import { getUserNameType } from '../../utils/general';
import { IRegister } from '../../interface/auth/register.interface';

class AuthServices{
    async register(body: any){
        try {
            const { name, email, no_telp, password, congregation_id }= body

            const getDataEmail = await prisma.user.findFirst({
                where: {
                  OR: [
                    { email: email },
                    { no_telp: no_telp }
                  ]
                }
            });

            const getDataCongregation = await prisma.congregation.findFirst({
                where: {
                    id: congregation_id
                }
            })

            if(!getDataCongregation){
                throw new HTTPException(404, {message: "Jemaat Tidak ditemukan"})
            }
              
            if(getDataEmail){
                throw new HTTPException(409, {message: "Email Atau nomor Telepon sudah ada"});
            }

            const result = await prisma.$transaction(async prisma=>{
               const user =  await prisma.user.create({
                        data: {
                            name: name,
                            email: email,
                            no_telp: no_telp,
                            roleId: defaultRoleId,
                            password: await Bun.password.hash(password)
                        }
                })
                const userId: number = user.id

                await prisma.user_congregation.create({
                    data: {
                        user_id: userId,
                        congregation_id: congregation_id
                    }
                })

                return 'success'
            })
            return {
                status: 'success',
                result: result
            }
        } catch (error) {
            throw error;
        }
    }

    async checkEmailOrPhone(Body: IRegister){
        try {
            const {email, no_telp} = Body

            const getDataUser = await prisma.user.findFirst({
                where: {
                OR: [
                    { email: email },
                    { no_telp: no_telp }
                ]
                }
            });

            if(getDataUser){
                throw new HTTPException(409, {message: "Email Atau nomor Telepon sudah Terdaftar"});
            }

            if(no_telp.length > 15 || no_telp.length < 10){
                throw new HTTPException(400, {message: "Nomor Telepon tidak valid"})
            }

            return {
                message: 'success'
            }   
        } catch (error) {
            throw error
        }
    }

    async login(body: ILogin, c: Context){
        try {
            
            const {username, password} = body

            let label: string = getUserNameType(username)

            const data = await prisma.user.findFirst({
                where: {
                    [label]: username
                }
            })

            if(!data){
                throw new HTTPException(404, {message: "Username dan Password salah"})
            }

            const comparePassword = await Bun.password.verify(password, data.password)

            if(!comparePassword){
                throw new HTTPException(404, {message: "password salah"})
            }

            const payload = {
                sub: data.id,
                role: data.roleId,
                email: data.email,
                exp: Math.floor(Date.now() / 1000) + 60 * 180
            }

            
            const refreshPayload = {
                sub: data.id,
                role: data.roleId,
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
            };

            
            if (!secretAccessToken) {
                throw new Error("JWT secretAccessToken is not defined");
            }
            
            const token = await sign(payload, secretAccessToken)
            
            const refreshToken = await sign(refreshPayload, secretRefreshToken ?? '')

            setCookie(c, 'accessToken', token, {
                maxAge: 60 * 60 * 3,
                httpOnly: true,
                sameSite: 'Lax'
            })
            
            setCookie(c, 'refreshToken', refreshToken, {
                maxAge: 60 * 60 * 24 * 7,
                httpOnly: true,
                sameSite: 'Lax'    
            })
           
            return{
                status: "success",
                message: "Berhasil Login",
                role: data.roleId,
                name: data.name
            }

        } catch (error) {
            throw error;
        }
    }
}

export default AuthServices