import Image from 'next/image'
import { useContext } from 'react'

import moment from 'moment'
import { AuthContext } from '../contexts/AuthContext'
import { Post, User } from '../types'
import LeaveComment from './LeaveComment'

type Comment = {
    _id: string
    text: string
    user: User
    post: Post
    createdAt: string
    updatedAt: string
    __v: number
}

type Props = {
    comments: Comment[]
    postId: string
}

const Comments: React.FC<Props> = ({ comments, postId }: Props) => {
    console.log('commmmeeent', comments)
    console.log('postId', postId)

    const { isAuthenticated } = useContext(AuthContext)

    return (
        <div
            className={`bg-neutral-low-high flex flex-col md:max-w-full mx-auto ${
                !isAuthenticated() && 'pb-[57px]'
            }`}
        >
            <div className="flex flex-col items-center pb-[30px] ">
                <h5 className="uppercase text-base">
                    {comments.length} comment(s)
                </h5>
                <hr className="border border-solid border-r-primary w-10 mt-[5px]" />
            </div>

            {comments?.map((comment: Comment) => {
                return (
                    <div key={comment._id}>
                        <div className="flex flex-row pb-4">
                            <div>
                                <div className="md:h-[80px] mr-7 h-16 w-16 md:w-[80px] relative ">
                                    <Image
                                        src={
                                            comment.user.profilePic ||
                                            '/image/user.png'
                                        }
                                        alt=""
                                        layout="fill"
                                        className="rounded-full"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col self-center w-full  md:ml-[70px]">
                                <div className="flex items-center md:justify-between w-full justify-between">
                                    <h6>{comment.post.username}</h6>
                                    {/* <span>{format(new Date(comment.createdAt), "MM/dd/yyyy 'at' hh:mm aaaaa'm'")}</span> */}
                                    <span className="h-1 w-1 rounded-full bg-primary mx-2 md:hidden " />
                                    <span className="text-gray font-medium tracking-[px] text-xs">
                                        {moment(comment.createdAt).fromNow()}
                                    </span>
                                </div>
                                <div className="py-2">
                                    <p className="font-normal">
                                        {comment.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <hr className="h-1  md:ml-[140px] py-4 text-[#E9EAEB] w-auto" />
                    </div>
                )
            })}
            {isAuthenticated() && <LeaveComment postId={postId} />}
        </div>
    )
}

export default Comments
