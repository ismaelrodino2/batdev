import axios from 'axios'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { destroyCookie, parseCookies } from 'nookies'
import { useContext, useEffect, useRef, useState } from 'react'
import 'react-responsive-modal/styles.css'
import Switch from 'react-switch'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DeleteModal from '../components/DeleteModal'
import ModalComponent from '../components/Modal'
import Spinner from '../components/Spinner'
import { AuthContext } from '../contexts/AuthContext'

const AboutMe: NextPage = () => {
    const { isAuthenticated, userData }: any = useContext(AuthContext) // chamo mas ele só faz a requisição quando muda o token ou a página é atualizada (useEffect)
    const { 'nextauth.token': token } = parseCookies()
    const [isLoading, setIsloading] = useState<boolean>(false)

    const router = useRouter()

    useEffect(() => {
        !isAuthenticated() && router.push('/')
    }, [token])

    const [editName, setEditName] = useState(userData && userData.username)
    const [editEmail, setEditEmail] = useState(userData && userData.email)
    const [imageUpload, setImageUpload] = useState(
        userData && userData.profilePic
    )
    const [imgData, setImgData] = useState(userData && userData.profilePic)
    const inputFileRef = useRef(null)

    const onChangePicture = (e: any) => {
        if (e.target.files[0]) {
            console.log('picture: ', e.target.files)
            setImageUpload(e.target.files[0])
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setImgData(reader.result)
            })
            reader.readAsDataURL(e.target.files[0])
        }
    }

    const handleDelete = async (e: any) => {
        e.preventDefault()
        setIsloading(true)
        try {
            const res = await axios.delete(`${process.env.API_URL}/api/users`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${token}`
                }
            })
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

        setIsloading(false)
        destroyCookie({}, 'nextauth.token')
        window.location.reload()
    }

    const { recoverUserData } = useContext(AuthContext)

    const handleSubmit = async () => {
        setIsloading(true)
        if (imageUpload === userData.profilePic) {
            // didn't change pic
            console.log('mesmo')
            console.log('passou aqui1')
            console.log(imageUpload, editName, editEmail)

            try {
                const formData = {
                    username: editName,
                    email: editEmail
                }
                const res = await axios.put(
                    `${process.env.API_URL}/api/users`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            authorization: `Bearer ${token}`
                        }
                    }
                )

                toast.success('Success!', {
                    position: 'bottom-right',
                    autoClose: 2000
                })

                console.log(res)
            } catch (err) {
                toast.error('Error!', {
                    position: 'bottom-right',
                    autoClose: 2000
                })
                console.error(err)
            }
        } else {
            try {
                const formData = new FormData()

                imageUpload && formData.append('file', imageUpload)
                formData.append('username', editName)
                formData.append('email', editEmail)

                const res = await axios.put(
                    `${process.env.API_URL}/api/users`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            authorization: `Bearer ${token}`
                        }
                    }
                )

                toast.success('Success!', {
                    position: 'bottom-right',
                    autoClose: 2000
                })

                console.log(res)
            } catch (err) {
                toast.error('Error!', {
                    position: 'bottom-right',
                    autoClose: 2000
                })
                console.error(err)
            }
        }
        recoverUserData()
        setIsloading(false)
    }

    const [checked, setChecked] = useState<boolean>(false)
    const handleChange = (nextChecked: boolean) => {
        setChecked(nextChecked)
    }

    if (isAuthenticated()) {
        return (
            <div className="flex flex-col bg-neutral-low-high min-h-[calc(100vh-64px)] py-10">
                {isLoading && <Spinner />}
                <ToastContainer />
                <div className="container max-w-4xl mx-auto px-6 bg-white py-5 rounded-2xl  shadow-md">
                    <div className="">
                        <div className="flex gap-4 justify-start pb-4">
                            <h4>Edit user: </h4>
                            <Switch
                                onChange={handleChange}
                                checked={checked}
                                onHandleColor={'#74C2BD'}
                            />
                        </div>

                        {checked ? (
                            <div>
                                <img src={imgData} alt="" className="h-80" />

                                <label className="w-fit flex flex-col h-fit items-center px-4 py-6 bg-white text-primary-medium rounded-lg shadow-lg tracking-wide uppercase border mt-4 border-primary-medium cursor-pointer hover:bg-primary-medium hover:text-white">
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
                                        onChange={onChangePicture}
                                    />
                                </label>

                                <h4 className="pt-4">
                                    Name:
                                    {userData && (
                                        <input
                                            type="text"
                                            value={editName}
                                            className="outline-primary-medium border border-solid border-[rgba(0,0,0,0.1)] rounded-md mt-2 py-[5px] px-4 ml-4"
                                            onChange={e =>
                                                setEditName(e.target.value)
                                            }
                                        />
                                    )}
                                </h4>

                                <h4>
                                    E-mail:
                                    {userData && (
                                        <input
                                            type="text"
                                            value={editEmail}
                                            className="outline-primary-medium border border-solid border-[rgba(0,0,0,0.1)] rounded-md mt-2 py-[5px] px-4 ml-[10px]"
                                            onChange={e =>
                                                setEditEmail(e.target.value)
                                            }
                                        />
                                    )}
                                </h4>
                                <div className="">
                                    <button
                                        className="bg-primary-medium mt-8 hover:bg-[#457471] ransition-all duration-300 ease-in-out text-white font-bold py-2 px-4 rounded"
                                        onClick={handleSubmit}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <img
                                    src={userData && userData.profilePic}
                                    className="h-80 w-1/3"
                                    alt=""
                                />
                                <h4 className="pt-4">
                                    Name: {userData && userData.username}
                                </h4>
                                <h4>Email: {userData && userData.email}</h4>
                            </div>
                        )}
                        <div className="flex justify-end flex-row gap-4">
                            <ModalComponent />
                            <DeleteModal
                                functionToCall={handleDelete}
                                isLoading={isLoading}
                                text="user"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return <h1>Not authenticated.</h1>
    }
}

export default AboutMe
