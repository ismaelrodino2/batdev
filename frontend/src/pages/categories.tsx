import axios from 'axios'
import type { GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'
import { useContext, useEffect, useState } from 'react'
import 'react-responsive-modal/styles.css'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Spinner from '../components/Spinner'
import { AuthContext } from '../contexts/AuthContext'
import { Categories } from '../types'

type CategoriesTypes = {
    categories: Categories
}

const Categories: NextPage<CategoriesTypes> = ({ categories }) => {
    const [isLoading, setIsloading] = useState<boolean>(false)

    const [category, setCategory] = useState('')
    const { 'nextauth.token': token } = parseCookies()

    const createCat = async (e: any) => {
        setIsloading(true)
        e.preventDefault()
        const formData = {
            name: category
        }
        console.log(token, formData)
        try {
            console.log(category)
            const res = await axios.post(
                `${process.env.API_URL}/api/createcategories`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${token}`
                    }
                }
            )
            console.log(res)
            setCategory('')
            toast.success('Success!', {
                position: 'bottom-right',
                autoClose: 2000
            })
        } catch (err) {
            console.error(err)
            toast.error('Error!', {
                position: 'bottom-right',
                autoClose: 2000
            })
        }
        setIsloading(false)
    }

    const { isAuthenticated, userData } = useContext(AuthContext) // chamo mas ele só faz a requisição quando muda o token ou a página é atualizada (useEffect)
    const router = useRouter()

    useEffect(() => {
        !isAuthenticated() && router.push('/')
    }, [token])

    return (
        <div className="flex flex-col bg-neutral-low-high min-h-[calc(100vh-64px)] py-10">
            {isLoading && <Spinner />}
            <ToastContainer />
            <div className="container mx-auto px-6 bg-white pb-5 rounded-2xl  shadow-md">
                {' '}
                <div className="flex flex-col">
                    <h1>All categories</h1>
                    <div className="flex flex-wrap gap-5 pb-8">
                        {categories.map((el: any) => {
                            return <h5 key={el._id}>{el.name}</h5>
                        })}
                    </div>
                </div>
                <div>
                    <h2 className="pb-4">Create category</h2>
                    <form onSubmit={createCat}>
                        <input
                            type="text"
                            placeholder="Category name"
                            value={category}
                            onChange={(e: any) => setCategory(e.target.value)}
                            className="outline-primary-medium border border-solid border-[rgba(0,0,0,0.1)] rounded-md mt-2 py-[5px] px-4"
                        />

                        <button
                            className="bg-primary-medium mt-2 hover:bg-[#457471] ransition-all duration-300 ease-in-out text-white font-bold py-2 px-4 rounded ml-4"
                            type="submit"
                        >
                            Create category
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const response = await fetch(`${process.env.API_URL}/api/categories`)
    const data: Categories = await response.json()

    return {
        props: {
            categories: data
        }, // will be passed to the page component as props
        revalidate: 60 * 1 // 6min
    }
}

export default Categories
