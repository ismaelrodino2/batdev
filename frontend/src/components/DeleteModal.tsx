import { useEffect, useRef, useState } from 'react'
import 'react-responsive-modal/styles.css'
import Spinner from './Spinner'

type PropTypes = {
    text: string
    functionToCall: (e: any | string) => Promise<void>
    isLoading: boolean
}

const DeleteModal = ({ text, functionToCall, isLoading }: PropTypes) => {
    const [showModal, setShowModal] = useState(false)

    const ref = useRef<HTMLHeadingElement>(null)

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true)
    }, [ref])

    const handleClickOutside = (e: any) => {
        if (ref.current && !ref?.current?.contains(e.target)) {
            setShowModal(false)
        }
    }

    return (
        <>
            {isLoading && <Spinner />}

            <>
                <button
                    className="bg-[#ff0000] mt-8 hover:bg-[#b20000] ransition-all duration-300 ease-in-out text-white font-bold py-2 px-4 rounded"
                    onClick={() => setShowModal(true)}
                >
                    Delete {text}
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
                                <div
                                    ref={ref}
                                    className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-4 gap-4"
                                >
                                    <h4>Are you sure?</h4>

                                    <div className="flex justify-end gap-4">
                                        <button
                                            className="bg-primary-medium ml-4 hover:bg-[#457471] ransition-all duration-300 ease-in-out text-white font-bold py-2 px-4 rounded"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="bg-[#ff0000] hover:bg-[#b20000] ransition-all duration-300 ease-in-out text-white font-bold py-2 px-4 rounded"
                                            onClick={functionToCall}
                                        >
                                            Delete
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
export default DeleteModal
