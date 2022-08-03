import axios from 'axios'
import { parseCookies } from 'nookies'
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Spinner from './Spinner'

type PropTypes = {
    postId: string
}

const LeaveComment: React.FC<PropTypes> = ({ postId }) => {
    const [text, setText] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { 'nextauth.token': token } = parseCookies()
    console.log('token2', token)

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setIsLoading(true)
        console.log('test', text)
        try {
            console.log('token', token)

            const res = await axios.post(
                `${process.env.API_URL}/api/comment`,
                { text, post: postId },
                {
                    headers: {
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
            console.error(err)
            toast.error('Error!', {
                position: 'bottom-right',
                autoClose: 2000
            })
        }
        setText('')
        setIsLoading(false)
    }

    const handleChange = (e: any) => {
        setText(e.currentTarget.value)
    }

    return (
        <div className=" bg-neutral-low-high flex flex-col pb-8">
            <ToastContainer />
            {isLoading && <Spinner />}
            <div className="flex flex-col items-center pb-[30px] ">
                <h5 className="uppercase text-base">Leave a Comment</h5>

                <form className="w-full" onSubmit={handleSubmit} action="">
                    <div className="flex pt-4 h-[250px]">
                        <textarea
                            onChange={handleChange}
                            placeholder="Comment *"
                            cols={45}
                            rows={8}
                            className="flex-1 h-full p-4 rounded-sm outline-none focus:border-b-2 focus:border-b-primary-medium focus:placeholder-[#c0c9cc] resize-none"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="font-extrabold uppercase tracking-[2px] text-[13px] bg-white w-full py-3 mt-3 hover:bg-primary-medium hover:text-white transition-all duration-[340ms] ease-in-out"
                    >
                        post comment
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LeaveComment
