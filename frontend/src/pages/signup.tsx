import axios from 'axios'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const SignUp: NextPage = () => {
    const [password1, setPassword1] = useState()
    const [password2, setPassword2] = useState()
    const [userName, setUserName] = useState()
    const [email, setEmail] = useState()

    const inputFileRef = useRef(null)

    const [imageUpload, setImageUpload] = useState<any>()
    const [imgData, setImgData] = useState<string | ArrayBuffer>()

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

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        console.log(imageUpload)
        if (password1 === password2) {
            const formData: any = new FormData()

            if (imageUpload) {
                console.log('tem imagem')
                formData.append('file', imageUpload)
            }

            console.log('file', imgData)
            console.log('formdata', formData)

            formData.append('username', userName)
            formData.append('email', email)
            formData.append('password', password1)

            try {
                const res = await axios.post(
                    `${process.env.API_URL}/api/register`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                )
                setUserName(null)
                setEmail(null)
                setPassword1(null)
                setPassword2(null)
                setImgData(null)
                setImageUpload(null)

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
            toast.error("Passwords doesn't match!", {
                position: 'bottom-right',
                autoClose: 2000
            })
        }
    }

    const removeEmptySpaces = (stringVal: any) => {
        const word = stringVal.replace(/\s/g, '')
        setUserName(word)
    }

    return (
        <div className="bg-grey-lighter min-h-screen flex flex-col bg-neutral-low-high">
            <ToastContainer />
            <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white px-6 py-8 rounded shadow-md text-black w-full"
                >
                    <h1 className="mb-8 text-3xl text-center">Sign up</h1>
                    <div className="flex justify-center pb-4">
                        <label className="w-auto flex flex-col h-fit items-center px-4 py-6 bg-white text-primary-medium rounded-lg shadow-lg tracking-wide uppercase border mt-4 border-primary-medium cursor-pointer hover:bg-primary-medium hover:text-white">
                            <svg
                                className="w-8 h-8"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                            </svg>
                            <div className="mt-2 text-base leading-normal">
                                {imageUpload
                                    ? imageUpload?.name.length > 10
                                        ? imageUpload.name.substring(0, 10) +
                                          '...'
                                        : imageUpload.name
                                    : 'Select a file'}
                            </div>
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
                    </div>

                    <input
                        type="text"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="username"
                        placeholder="Username"
                        onChange={(e: any) => removeEmptySpaces(e.target.value)}
                        value={userName}
                    />

                    <input
                        type="text"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="email"
                        placeholder="Email"
                        onChange={(e: any) => setEmail(e.target.value)}
                        value={email}
                    />

                    <input
                        type="password"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="password"
                        placeholder="Password"
                        onChange={(e: any) => setPassword1(e.target.value)}
                        value={password1}
                    />
                    <input
                        type="password"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="confirm_password"
                        placeholder="Confirm Password"
                        onChange={(e: any) => setPassword2(e.target.value)}
                        value={password2}
                    />

                    <button
                        type="submit"
                        className="w-full text-center py-3 rounded bg-primary-medium text-white hover:brightness-110 transition-all duration-150 ease-in-out focus:outline-none my-1"
                    >
                        Create Account
                    </button>

                    <div className="text-gray mt-6 flex justify-center">
                        Already have an account?
                        <span className="no-underline border-b border-primary-medium text-priborder-primary-medium">
                            <Link href="/login">Log in</Link>
                        </span>
                        .
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp
