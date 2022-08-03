import axios from 'axios'
import { parseCookies } from 'nookies'
import { FunctionComponent, useEffect, useRef, useState } from 'react'
import 'react-responsive-modal/styles.css'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Spinner from './Spinner'

const ModalComponent: FunctionComponent = () => {
    const [showModal, setShowModal] = useState(false)
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const { 'nextauth.token': token } = parseCookies()
    const [isLoading, setIsloading] = useState<boolean>(false)

    const ref = useRef<HTMLHeadingElement>(null)

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true)
    }, [ref])

    const handleClickOutside = (e: any) => {
        if (ref.current && !ref?.current?.contains(e.target)) {
            setShowModal(false)
        }
    }

    const changePassword = async () => {
        setIsloading(true)

        if (password1 === password2) {
            console.log('Passwords match')

            const formData = {
                password: password1
            }

            try {
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
                console.log(res)
                toast.success('Success!', {
                    position: 'top-right',
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                })
            } catch (err) {
                toast.error('Error!', {
                    position: 'top-right',
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                })
                console.log(err)
            }
        } else {
            console.log("Passwords doesn't match")
        }
        setIsloading(false)
    }

    return (
        <>
            <ToastContainer />
            {isLoading && <Spinner />}

            <>
                <button
                    className="bg-primary-medium mt-8 hover:bg-[#457471] ransition-all duration-300 ease-in-out text-white font-bold py-2 px-4 rounded"
                    type="button"
                    onClick={() => setShowModal(true)}
                >
                    Edit password
                </button>
                {showModal ? (
                    <div
                        className={`transition-all ease-in duration-200   ${
                            showModal ? 'opacity-100' : 'opacity-0 '
                        }`}
                    >
                        <div
                            className={`justify-center  items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-[rgba(0,0,0,0.5)]`}
                        >
                            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                {/* content */}
                                <div
                                    ref={ref}
                                    className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-4 gap-4"
                                >
                                    <h2>New password</h2>
                                    <input
                                        type="text"
                                        className="outline-primary-medium border border-solid border-[rgba(0,0,0,0.1)] rounded-md mt-2 py-[5px] px-4"
                                        placeholder="New password"
                                        value={password1}
                                        onChange={e =>
                                            setPassword1(e.target.value)
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Confirm new password"
                                        className="outline-primary-medium border border-solid border-[rgba(0,0,0,0.1)] rounded-md mt-2 py-[5px] px-4"
                                        value={password2}
                                        onChange={e =>
                                            setPassword2(e.target.value)
                                        }
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            className="bg-primary-medium mt-2 hover:bg-[#457471] ransition-all duration-300 ease-in-out text-white font-bold py-2 px-4 rounded"
                                            onClick={changePassword}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </div>
                ) : (
                    <div className="opacity-0 " />
                )}
            </>
        </>
    )
}
export default ModalComponent
