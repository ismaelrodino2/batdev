import axios from 'axios'
import { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'
import { useContext, useEffect, useRef, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Spinner from '../components/Spinner'
import { AuthContext } from '../contexts/AuthContext'
import { Categories, Category } from '../types'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

type CategoriesTypes = {
    categories: Categories
}

function Write({ categories }: CategoriesTypes) {
    const [value, setValue] = useState('')
    const [check, setCheck] = useState<any>([])
    const [isLoading, setIsloading] = useState<boolean>(false)

    console.log(categories)

    const [imageUpload, setImageUpload] = useState(null)
    const [title, setTitle] = useState<string>('')
    const inputFileRef = useRef(null)

    const router = useRouter()

    const { isAuthenticated } = useContext(AuthContext)
    const { 'nextauth.token': token } = parseCookies()

    useEffect(() => {
        !isAuthenticated() && router.push('/')
        console.log('renderizou')
    }, [token])

    const uploadPost = async (e: any) => {
        setIsloading(true)
        e.preventDefault()

        const formData = new FormData()

        imageUpload && formData.append('file', imageUpload)

        formData.append('title', title)
        formData.append('desc', value)

        formData.append('categories', JSON.stringify(check))

        try {
            const res = await axios.post(
                `${process.env.API_URL}/api/createposts`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        authorization: `Bearer ${token}`
                    }
                }
            )

            console.log(res)

            toast.success('Success!', {
                position: 'bottom-right',
                autoClose: 2000
            })
        } catch (err) {
            console.log(err)
            toast.error('Error!', {
                position: 'bottom-right',
                autoClose: 2000
            })
        }

        setTitle('')
        setCheck('')
        setValue('')
        setImageUpload(null)
        inputFileRef.current.value = ''
        setCheck([])
        setIsloading(false)
    }

    const CheckHandler = (id: string) => {
        setCheck((prev: string[]) =>
            check.includes(id)
                ? prev.filter((cur: string) => cur !== id)
                : [...prev, id]
        )
    }

    if (isAuthenticated()) {
        return (
            <div className="flex flex-col bg-neutral-low-high min-h-[calc(100vh-64px)] py-10">
                <ToastContainer />

                {isLoading && <Spinner />}
                <div className="container mx-auto px-6 bg-white pb-5 rounded-2xl  shadow-md">
                    <div className="flex flex-col pt-8 ">
                        <label className="font-semibold text-sm text-primary">
                            <h1 className="font-semibold text-sm">Title</h1>
                        </label>
                        <input
                            className="outline-primary-medium border border-solid border-[rgba(0,0,0,0.1)] rounded-md mt-2 py-[5px] px-4"
                            value={title}
                            type="text"
                            placeholder="title"
                            onChange={e => {
                                setTitle(e.target.value)
                            }}
                        />
                    </div>

                    <div className="flex flex-col py-10">
                        <div className="flex">
                            <div className="">
                                <h1 className="font-semibold text-sm">
                                    Categories
                                </h1>
                                <div className="flex flex-wrap w-1/2">
                                    {categories &&
                                        categories.map((el: Category) => {
                                            return (
                                                <div
                                                    className="flex items-start py-4 px-4 min-w-[170px]"
                                                    key={el._id}
                                                >
                                                    <input
                                                        key={el._id}
                                                        type="checkbox"
                                                        name={el.name}
                                                        className="border-gray-300 rounded h-5 w-5 mx-4"
                                                        value={el.name}
                                                        onClick={() =>
                                                            CheckHandler(el._id)
                                                        }
                                                    />
                                                    <label className="text-gray-700 font-medium leading-none">
                                                        {el.name}
                                                    </label>
                                                </div>
                                            )
                                        })}
                                </div>
                            </div>
                            <div className="">
                                <h1 className="font-semibold text-sm">
                                    Header image
                                </h1>
                                <label className="w-64 flex flex-col h-fit items-center px-4 py-6 bg-white text-primary-medium rounded-lg shadow-lg tracking-wide uppercase border mt-4 border-primary-medium cursor-pointer hover:bg-primary-medium hover:text-white">
                                    <svg
                                        className="w-8 h-8"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                    </svg>
                                    <span className="mt-2 text-base leading-normal">
                                        {imageUpload
                                            ? imageUpload?.name.length > 10
                                                ? imageUpload.name.substring(
                                                      0,
                                                      10
                                                  ) + '...'
                                                : imageUpload.name
                                            : 'Select a file'}
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="
                                        image/jpeg,
                                        image/jpg,
                                        image/pjpeg,
                                        image/png,
                                        image/gif"
                                        ref={inputFileRef}
                                        onChange={e => {
                                            setImageUpload(e.target.files[0])
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold text-sm text-primary">
                            <h1 className=" text-sm pb-2">Description</h1>
                        </label>
                        <ReactQuill
                            value={value}
                            onChange={setValue}
                            preserveWhitespace
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            className="bg-primary-medium mt-8 hover:bg-[#457471] ransition-all duration-300 ease-in-out text-white font-bold py-2 px-4 rounded"
                            onClick={uploadPost}
                        >
                            Create post
                        </button>
                    </div>
                </div>
            </div>
        )
    } else {
        return <h1>Not authenticated.</h1>
    }
}

export const getStaticProps: GetStaticProps = async () => {
    const response = await fetch(`${process.env.API_URL}/api/categories`)
    const data = await response.json()

    return {
        props: {
            categories: data
        }, // will be passed to the page component as props
        revalidate: 60 * 1 // 6min
    }
}

export default Write
