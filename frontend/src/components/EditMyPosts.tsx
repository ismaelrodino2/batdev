import axios from 'axios'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'
import { useRef, useState } from 'react'
import HTMLEllipsis from 'react-lines-ellipsis/lib/html'
import Switch from 'react-switch'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import sanitizeHtml from 'sanitize-html'
import { Post } from '../types'
import DeleteModal from './DeleteModal'
import Spinner from './Spinner'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

type PostTypes = {
    post: Post
}

const EditMyPosts = ({ post }: PostTypes) => {
    const [valueTitle, setValueTitle] = useState<string>(post.title) // posts vão iniciar com esse valor pra serem editados, o cara vai editar em cima disso e enviar pra rota de editar posts
    const [valueDesc, setValueDesc] = useState<string>(post.desc) // posts vão iniciar com esse valor pra serem editados, o cara vai editar em cima disso e enviar pra rota de editar posts
    const inputFileRef = useRef(null)
    const [imageUpload, setImageUpload] = useState<any>(post.postPic)
    const [imgData, setImgData] = useState<string>(post.postPic)
    const [isLoading, setIsloading] = useState<boolean>(false)
    const [edit, setEdit] = useState(false)

    const cleanTitle = (title: string) => {
        return sanitizeHtml(title)
    }

    const { 'nextauth.token': token } = parseCookies()
    const router = useRouter()

    const deletePost = async (id: string, e: any) => {
        e.preventDefault()

        try {
            const res = await axios.delete(
                `${process.env.API_URL}/api/posts/${id}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                }
            )
            console.log(res)
            router.replace(router.asPath) // after deleting, refresh posts
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
    }

    const onChangePicture = (e?: any) => {
        if (e.target?.files[0]) {
            setImageUpload(e.target?.files[0])
            const reader: any = new FileReader()
            reader.addEventListener('load', () => {
                setImgData(reader.result)
            })
            reader.readAsDataURL(e.target?.files[0])
        }
    }

    const handleSubmit = async () => {
        setIsloading(true)
        console.log(imageUpload, valueTitle, valueDesc)
        console.log(post._id)
        console.log(post)

        if (imageUpload === post.postPic) {
            console.log(imageUpload, valueTitle, valueDesc)

            const formData = {
                title: valueTitle,
                desc: valueDesc
            }

            const res = await axios.put(
                `${process.env.API_URL}/api/posts/${post._id}`,
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
        } else {
            const formData = new FormData()
            console.log(imageUpload, valueTitle, valueDesc)

            formData.append('file', imageUpload)
            formData.append('title', valueTitle)
            formData.append('desc', valueDesc)
            console.log(post._id)
            console.log(formData)
            console.log(valueTitle)

            const res = await axios.put(
                `${process.env.API_URL}/api/posts/${post._id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        authorization: `Bearer ${token}`
                    }
                }
            )
            console.log(res)
            toast.error('Error!', {
                position: 'bottom-right',
                autoClose: 2000
            })
        }
        setIsloading(false)
        window.location.reload()
    }

    const [checked, setChecked] = useState<boolean>(false)
    const handleChange = (nextChecked: boolean) => {
        setChecked(nextChecked)
        setEdit(!edit)
    }

    return (
        <div>
            {isLoading && <Spinner />}
            <ToastContainer />
            <div>
                {edit ? (
                    <div>
                        <ReactQuill
                            value={valueTitle}
                            onChange={setValueTitle}
                        />
                        <ReactQuill value={valueDesc} onChange={setValueDesc} />

                        <label className="w-fit flex flex-col h-fit items-center px-4 py-6 bg-white text-primary-medium rounded-lg shadow-lg tracking-wide uppercase border my-4 border-primary-medium cursor-pointer hover:bg-primary-medium hover:text-white">
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
                                    ? imageUpload?.name?.length > 10
                                        ? imageUpload.name.substring(0, 10) +
                                          '...'
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
                                onChange={onChangePicture}
                            />
                        </label>

                        <img src={imgData} alt="post" className="h-80" />
                        <button
                            className="bg-primary-medium mt-8 hover:bg-[#457471] ransition-all duration-300 ease-in-out text-white font-bold py-2 px-4 rounded"
                            onClick={handleSubmit}
                        >
                            Save
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2
                            dangerouslySetInnerHTML={{
                                __html: cleanTitle(post.title)
                            }}
                        />

                        <div className="py-6">
                            <HTMLEllipsis
                                unsafeHTML={post.desc}
                                maxLine="3"
                                ellipsis="..."
                                ellipsisHTML="<i style='color:#74C2BD'> [...] </i>"
                                basedOn="letters"
                            />
                        </div>
                        <img src={post.postPic} alt="" className="h-80" />
                        <h1>by: {post.username}</h1>

                        <DeleteModal
                            functionToCall={() => deletePost(post._id, e)}
                            isLoading={isLoading}
                            text="post"
                        />
                    </div>
                )}

                <div className="flex gap-4 justify-start py-4">
                    <h4>Edit post: </h4>
                    <Switch
                        onChange={handleChange}
                        checked={checked}
                        onHandleColor={'#74C2BD'}
                    />
                </div>
            </div>
        </div>
    )
}

export default EditMyPosts
function e(_id: string, e: any): Promise<void> {
    throw new Error('Function not implemented.')
}
