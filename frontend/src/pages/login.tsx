import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Spinner from '../components/Spinner'
import { AuthContext } from '../contexts/AuthContext'

const Login: NextPage = () => {
    const { signIn, isLoading } = useContext(AuthContext)

    type dataTypes = {
        username: string
        password: string
    }

    const { register, handleSubmit, reset } = useForm<dataTypes>()

    async function handleSignIn(data: dataTypes) {
        await signIn(data)
        reset()
    }

    return (
        <section className="h-full gradient-form bg-gray-200 md:min-h-[calc(100vh-64px)] bg-neutral-low-high">
            <ToastContainer />

            {isLoading && <Spinner />}
            <div className="container py-6 px-6 h-full mx-auto">
                <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
                    <div className="xl:w-10/12">
                        <div className="block bg-white shadow-lg rounded-lg">
                            <div className="lg:flex lg:flex-wrap g-0">
                                <div className="lg:w-6/12 px-4 md:px-0">
                                    <div className="md:p-1 2xl:p-12 md:mx-6">
                                        <div className="text-center">
                                            <Image
                                                src="/image/favicon.ico"
                                                width={192}
                                                height="100%"
                                                alt="logo"
                                                className="mx-auto w-48"
                                            />
                                            <h4 className="text-xl font-semibold mt-1 mb-12 pb-1">
                                                We are The BatDev Blog
                                            </h4>
                                        </div>
                                        <form
                                            onSubmit={handleSubmit(
                                                handleSignIn
                                            )}
                                        >
                                            <p className="mb-4">
                                                Please login to your account
                                            </p>
                                            <div className="mb-4">
                                                <input
                                                    {...register('username')}
                                                    type="text"
                                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                    id="exampleFormControlInput1"
                                                    placeholder="Username"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <input
                                                    {...register('password')}
                                                    type="password"
                                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                    id="exampleFormControlInput1"
                                                    placeholder="Password"
                                                />
                                            </div>
                                            <div className="text-center pt-1 mb-12 pb-1">
                                                <button
                                                    className="inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"
                                                    type="submit"
                                                    data-mdb-ripple="true"
                                                    data-mdb-ripple-color="light"
                                                    style={{
                                                        background:
                                                            ' linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)'
                                                    }}
                                                >
                                                    Log in
                                                </button>
                                                <a
                                                    className="text-gray-500"
                                                    href="#!"
                                                >
                                                    Forgot password?
                                                </a>
                                            </div>
                                            <div className="flex items-center justify-between pb-6">
                                                <p className="mb-0 mr-2">
                                                    Don &apos; t have an
                                                    account?
                                                </p>
                                                <Link href="/signup">
                                                    <button
                                                        type="button"
                                                        className="inline-block px-6 py-2 border-2 border-red-600 text-red-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                                                        data-mdb-ripple="true"
                                                        data-mdb-ripple-color="light"
                                                    >
                                                        Sign Up
                                                    </button>
                                                </Link>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div
                                    className="lg:w-6/12 flex items-center lg:rounded-r-lg rounded-b-lg lg:rounded-bl-none"
                                    style={{
                                        background:
                                            ' linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)'
                                    }}
                                >
                                    <div className="text-white px-4 py-6 md:p-12 md:mx-6">
                                        <h4 className="text-xl font-semibold mb-6">
                                            Welcome!
                                        </h4>
                                        <p className="text-sm">
                                            Lorem ipsum dolor sit amet,
                                            consectetur adipisicing elit, sed do
                                            eiusmod tempor incididunt ut labore
                                            et dolore magna aliqua. Ut enim ad
                                            minim veniam, quis nostrud
                                            exercitation ullamco laboris nisi ut
                                            aliquip ex ea commodo consequat.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login
