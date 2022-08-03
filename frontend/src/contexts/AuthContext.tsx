import React, { createContext, useEffect, useState } from 'react'
import { setCookie, parseCookies } from 'nookies'
import { useRouter } from 'next/router'
import axios from 'axios'
import { IsAuthenticated } from '../types'
import { toast } from 'react-toastify'

type User = {
    name: string
    username: string
    profilePic: string
    email: string
    id: string
    createdAt: string
    updatedAt: string
    __v: number
}

type SignInData = {
    username: string
    password: string
}

type AuthContextType = {
    isAuthenticated: IsAuthenticated
    userData: User
    signIn: (data: SignInData) => Promise<void> // função assincrona retorna Promise sem nenhum return então <void>
    recoverUserData: () => void
    isLoading: boolean
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [userData, setUserData] = useState<User | null>(null)
    const { 'nextauth.token': tokenAuth } = parseCookies()
    const [isLoading, setIsloading] = useState<boolean>(false)

    const recoverUserData = async () => {
        console.log('recuperou x vezes')
        try {
            const config = {
                headers: { Authorization: `Bearer ${tokenAuth}` }
            } // agr sim
            if (tokenAuth) {
                const resp = await axios.get(
                    `${process.env.API_URL}/api/users/`,
                    config
                )
                console.log('respo aqui', resp)
                setUserData(resp.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const isAuthenticated: IsAuthenticated = () => {
        const { 'nextauth.token': token } = parseCookies()
        if (token === undefined) {
            return false
        } else {
            return true
        }
    }

    useEffect(() => {
        recoverUserData()
        isAuthenticated()
        console.log('renderizou ou mudou o token')
    }, [tokenAuth])

    const router = useRouter()

    async function signIn({ username, password }: SignInData) {
        setIsloading(true)

        const LoginData = {
            username,
            password
        }

        const callSetCookie = (token: string) => {
            setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 1 // qnd o cookie expira -> 1h
            })
        }

        try {
            console.log(LoginData)
            const resp = await axios.post(
                `${process.env.API_URL}/api/auth/login`,
                LoginData,
                {
                    headers: {
                        Accept: '*/*',
                        'Content-Type': 'application/json'
                    }
                }
            )
            console.log(resp)
            callSetCookie(resp.data.token)

            setUserData(resp.data.info)
            console.log('kkk', resp.data.info)
            router.push('/')
            toast.success('Success!', {
                position: 'bottom-right',
                autoClose: 2000
            })
        } catch (err) {
            toast.error('Error!', {
                position: 'bottom-right',
                autoClose: 2000
            })
            console.error(err)
        }

        setIsloading(false)
    } // lugar pra enviar dados de email e senha e retornar token->faço o fetch aqui

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                signIn,
                userData,
                recoverUserData,
                isLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
