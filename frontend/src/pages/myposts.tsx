import type {
    GetServerSideProps,
    InferGetServerSidePropsType,
    NextPage
} from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'
import { useContext, useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { AuthContext } from '../contexts/AuthContext'
import { Post, Posts } from '../types'
const EditMyPosts = dynamic(() => import('../components/EditMyPosts'), {
    ssr: false
})

const MyPosts: NextPage = ({
    posts
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter()
    const [edit, setEdit] = useState(false)
    const { isAuthenticated, userData } = useContext(AuthContext) // chamo mas ele só faz a requisição quando muda o token ou a página é atualizada (useEffect)
    const { 'nextauth.token': token } = parseCookies()

    useEffect(() => {
        !isAuthenticated() && router.push('/')
    }, [token])

    if (isAuthenticated()) {
        return (
            <div className="flex flex-col bg-neutral-low-high min-h-[calc(100vh-64px)] py-10">
                <div className="container mx-auto px-6 bg-white pb-5 rounded-2xl  shadow-md">
                    <div className="flex flex-col">
                        <h1>Your posts</h1>
                        {Array.isArray(posts) &&
                            posts.map((post: Post) => {
                                return (
                                    <div key={post._id}>
                                        <EditMyPosts post={post} />
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </div>
        )
    } else {
        return <h1>Not authenticated.</h1>
    }
}

export default MyPosts

export const getServerSideProps: GetServerSideProps = async context => {
    const token = context.req.cookies['nextauth.token']

    if (token) {
        try {
            const headers = {
                Accept: 'application/json, text/plain, */*',
                'User-Agent': '*',
                Authorization: `Bearer ${token}`
            }

            const response = await fetch(
                `${process.env.API_URL}/api/posts/byauth`,
                {
                    headers
                }
            )

            const posts: Posts = await response.json()

            return {
                props: {
                    posts
                } // will be passed to the page component as props
                // revalidate: 60 * 6   //6min
            }
        } catch (err) {
            console.log(err)

            return {
                props: {
                    posts: null
                } // will be passed to the page component as props
            }
        }
    } else {
        return {
            props: {
                posts: null
            } // will be passed to the page component as props
        }
    }
}
