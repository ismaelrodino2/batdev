import dateFormat from 'dateformat'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { AiFillGithub, AiFillLinkedin } from 'react-icons/ai'
import sanitizeHtml from 'sanitize-html'
import Comments from '../../components/Comments'
import DateCircle from '../../components/DateCircle'
import Footer from '../../components/Footer'
import Tag from '../../components/Tag'
import { Category, Post } from '../../types'

type Props = {
    children?: ReactNode
}

type Comment = {
    _id: string
    text: string
    user: string
    post: string
    createdAt: string
    updatedAt: string
    __v: number
    userName: string
    profilePic: string
}

const Post: React.FC<Props> = ({
    post,
    comments
}: InferGetStaticPropsType<typeof getStaticProps>) => {
    const { query } = useRouter() // pego da url o id do usuário
    console.log(post)
    console.log('comments', comments)
    const cleanDesc = sanitizeHtml(post.desc)

    const cleanTitle = (title: string) => {
        return sanitizeHtml(title)
    }

    const router = useRouter()

    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <div className="bg-neutral-low-high mx-5 px-2 ">
                <div className="container mx-auto max-w-md md:max-w-7xl">
                    <div className="flex flex-col items-center">
                        <div className="pt-[70px] pb-[35px]">
                            <DateCircle>
                                {dateFormat(post.createdAt, 'paddedShortDate')}
                            </DateCircle>
                        </div>
                        <hr className=" border-solid mb-5 border-r-primary w-10 self-center" />
                        <h2
                            className="pb-5"
                            dangerouslySetInnerHTML={{
                                __html: cleanTitle(post.title)
                            }}
                        />
                        <div className="flex text-center gap-5 flex-wrap justify-center">
                            <p className="text-[14px]">
                                By
                                <span className="text-primary-medium">
                                    {post.username}
                                </span>
                            </p>
                            <p className="text-[14px] pb-[70px]">
                                Tags:{' '}
                                <span className="text-primary-medium">
                                    {post.categories.map(
                                        (
                                            cat: Category | null,
                                            index: number
                                        ) => {
                                            return (
                                                <span key={cat._id}>
                                                    {(index && ', ') + cat.name}{' '}
                                                </span>
                                            )
                                        }
                                    )}
                                </span>
                            </p>
                        </div>
                        {/* {post.categories.map((cat: string, index: number) => {
              return <span key={index}>{cat}</span>;
            })} */}
                    </div>
                    <div className=" flex px-6 flex-col md:flex-row gap-20">
                        <div className="md:w-[73%]">
                            <div className="flex  ">
                                <div className="flex flex-col w-full">
                                    <a
                                        href=""
                                        className="w-full h-[480px] relative "
                                    >
                                        <Image
                                            src={post.postPic}
                                            alt=""
                                            layout="fill"
                                        />
                                    </a>
                                    <div className="flex">
                                        <div className="flex ">
                                            <div className="flex flex-col py-[50px]">
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: cleanDesc
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Comments comments={comments} postId={post._id} />
                        </div>
                        <div className="md:w-[27%] bg-neutral-low-high flex flex-col ml-auto items-end">
                            <div className="w-full h-full gap-5">
                                <Tag>about me</Tag>
                                <div className="relative h-[250px] w-[100%] mx-auto mt-6">
                                    <Image
                                        src="/image/me.png"
                                        alt=""
                                        layout="fill"
                                    />
                                </div>
                                <p className="text-[13px] py-[15px]">
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Quae modi at tempore
                                    perferendis delectus, ducimus provident
                                    quasi doloremque error tenetur esse ea quia
                                    voluptas aspernatur vel doloribus!
                                    Molestiae, quaerat ducimus.{' '}
                                    <Link href="/contact">
                                        <span className="text-primary-medium">
                                            Read more
                                        </span>
                                    </Link>
                                </p>
                                <div className="w-full py-12">
                                    <Tag>Subscribe</Tag>
                                    <ul className="flex justify-center py-[18px] gap-[5px]">
                                        <li>
                                            <a
                                                className="w-10 h-10 flex rounded-full bg-white text-gray justify-center items-center transition-colors duration-300 ease-in-out hover:text-white hover:bg-primary-medium"
                                                href="https://github.com/ismaelrodino2"
                                                target={'_blank'}
                                                rel="noreferrer"
                                            >
                                                <AiFillGithub />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="w-10 h-10 flex rounded-full bg-white text-gray justify-center items-center transition-colors duration-300 ease-in-out hover:text-white hover:bg-primary-medium"
                                                href="https://www.linkedin.com/in/ismael-tavares/?locale=en_US"
                                                target={'_blank'}
                                                rel="noreferrer"
                                            >
                                                <AiFillLinkedin />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <Tag>Tags</Tag>
                                <div className="pt-4 pb-4 md:mb-0 flex w-full gap-3">
                                    {post.categories.map((cat: Category) => {
                                        return (
                                            <div
                                                className="p-2 bg-white"
                                                key={cat._id}
                                            >
                                                <p>{cat.name}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Post

export const getStaticPaths: GetStaticPaths = async context => {
    const response = await fetch(`${process.env.API_URL}/api/getposts/`)
    const data = await response.json()

    const paths = data.map((id: any) => {
        return { params: { id: id._id } }
    })

    return {
        paths,
        fallback: false // if true, generate static pages only when accessed., so user wont always regenerate all pages
    }
}

export const getStaticProps: GetStaticProps = async context => {
    const { id } = context.params

    const response1 = await fetch(`${process.env.API_URL}/api/getposts/${id}`)
    const post: Post = await response1.json()

    const response2 = await fetch(
        `${process.env.API_URL}/api/getcomments/${id}`
    )
    console.log(response2)
    const comments: Array<Comment> = await response2.json()

    return {
        props: {
            post,
            comments
        },
        revalidate: 60 // 1min
    }
}
