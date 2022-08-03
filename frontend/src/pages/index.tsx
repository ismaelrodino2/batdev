import dateFormat from 'dateformat'
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { AiFillGithub, AiFillLinkedin } from 'react-icons/ai/index'
import HTMLEllipsis from 'react-lines-ellipsis/lib/html'
import DateCircle from '../components/DateCircle'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Tag from '../components/Tag'
import { SearchContext } from '../contexts/SearchContext'
import { Categories, Category, Post, Posts } from '../types'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import sanitizeHtml from 'sanitize-html'

const Home: NextPage = ({
    posts,
    categories
}: InferGetStaticPropsType<typeof getStaticProps>) => {
    console.log(typeof posts)
    console.log('posts', posts)

    const { searchValue } = useContext(SearchContext)
    const [selectValue, setSelectValue] = useState<any>('')

    console.log(searchValue) // valor do search para filtrar

    const sortedPosts = posts.sort((a: Post, b: Post) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })

    const cleanTitle = (desc: string) => {
        return sanitizeHtml(desc)
    }

    if (typeof window !== 'undefined') {
        return (
            <div
                style={{
                    width: 'auto',
                    textOverflow: 'ellipsis',
                    height: '100px'
                }}
                className=" bg-white container mx-auto px-4"
            >
                <ToastContainer />
                <Header
                    firstTxt="A place for your Development stories"
                    title="blog of ..."
                />

                <div className="bg-neutral-low-high px-4 md:px-0">
                    <div className=" flex  flex-col md:flex-row  mx-auto max-w-7xl">
                        <div className="md:w-[80%] w-full order-2 md:order-1">
                            {/* posts */}
                            {sortedPosts
                                // eslint-disable-next-line array-callback-return
                                ?.filter((el: Post) => {
                                    if (!searchValue && !selectValue) {
                                        console.log(searchValue)
                                        console.log('categorias', el.categories)

                                        return el.title
                                    } else if (
                                        searchValue &&
                                        !selectValue &&
                                        el.title
                                            .toLowerCase()
                                            .includes(searchValue.toLowerCase())
                                    ) {
                                        // ir search
                                        console.log('com search', selectValue)

                                        return el.title
                                    } else if (
                                        searchValue &&
                                        selectValue &&
                                        el.title
                                            .toLowerCase()
                                            .includes(
                                                searchValue.toLowerCase()
                                            ) &&
                                        el.categories.some(
                                            item => item._id === selectValue
                                        )
                                        // if search and also filter
                                    ) {
                                        console.log(
                                            'com search e cat',
                                            selectValue
                                        )

                                        return el.title
                                    } else if (
                                        !searchValue &&
                                        selectValue &&
                                        el.categories.some(
                                            item => item._id === selectValue
                                        )
                                    ) {
                                        // if filter
                                        console.log('com cat', selectValue)
                                        return el.title
                                    }
                                })
                                .map((post: Post) => {
                                    return (
                                        <div
                                            className="flex flex-col md:flex-row items-center"
                                            key={post._id}
                                        >
                                            <div className="hidden lg:block ml-[40px] self-start">
                                                <DateCircle>
                                                    {dateFormat(
                                                        new Date(
                                                            post.createdAt
                                                        ),
                                                        'paddedShortDate'
                                                    )}
                                                    {/* m/d/a */}
                                                </DateCircle>
                                            </div>
                                            <div className="flex flex-col w-full md:ml-[40px]">
                                                <a
                                                    href=""
                                                    className="w-full h-[480px] relative "
                                                >
                                                    <Link
                                                        href={`/posts/${post._id}`}
                                                    >
                                                        <Image
                                                            src={post.postPic}
                                                            alt=""
                                                            layout="fill"
                                                        />
                                                    </Link>
                                                </a>
                                                <div className="flex ">
                                                    <div className="flex flex-col">
                                                        <div className="flex  text-center pt-8 pb-4 gap-5 flex-wrap  items-center">
                                                            <p className="text-primary-medium text-[14px] md:hidden">
                                                                {dateFormat(
                                                                    new Date(
                                                                        post.createdAt
                                                                    ),
                                                                    'paddedShortDate'
                                                                )}
                                                            </p>
                                                            <p className="text-[14px]">
                                                                By
                                                                <span className="text-primary-medium pl-1">
                                                                    {
                                                                        post.username
                                                                    }
                                                                </span>
                                                            </p>
                                                            <p className="text-[14px] ">
                                                                Tags:
                                                                <span className="text-primary-medium pl-1">
                                                                    {post.categories.map(
                                                                        (
                                                                            cat: Category,
                                                                            index: number
                                                                        ) => {
                                                                            return (
                                                                                <span
                                                                                    key={
                                                                                        cat._id
                                                                                    }
                                                                                >
                                                                                    {(index &&
                                                                                        ', ') +
                                                                                        cat.name}{' '}
                                                                                </span>
                                                                            )
                                                                        }
                                                                    )}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col gap-4">
                                                            <h2
                                                                dangerouslySetInnerHTML={{
                                                                    __html: cleanTitle(
                                                                        post.title
                                                                    )
                                                                }}
                                                            />
                                                            <div className=" flex flex-wrap pb-24">
                                                                <HTMLEllipsis
                                                                    unsafeHTML={
                                                                        post.desc
                                                                    }
                                                                    maxLine="4"
                                                                    ellipsis="..."
                                                                    ellipsisHTML="<i style='color:#74C2BD'> [...] </i>"
                                                                    basedOn="letters"
                                                                />
                                                                <Link
                                                                    href={`/posts/${post._id}`}
                                                                >
                                                                    <p className="text-primary-medium cursor-pointer pl-1">
                                                                        Read
                                                                        more
                                                                    </p>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                        </div>

                        <div className="md:w-[20%] w-full self-start md:ml-[80px] md:mr-[40px] bg-neutral-low-high flex justify-end flex-col items-center order-1 md:order-2">
                            <div className="w-full gap-5">
                                <Tag>about me</Tag>
                                <div className="relative h-64 w-[100%] mx-auto mt-6">
                                    <Image
                                        src="/image/me.png"
                                        alt="Developer of the blog"
                                        layout="fill"
                                    />
                                </div>
                                <p className="text-[13px] py-[15px]">
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Optio modi quasi
                                    dignissimos, fuga voluptate minima laborum
                                    facere quibusdam et a aspernatur ipsam iste
                                    illo culpa, eveniet quaerat, quis odio
                                    architecto?
                                    <Link href="/contact">
                                        <span className="text-primary-medium cursor-pointer">
                                            Read more
                                        </span>
                                    </Link>
                                </p>
                            </div>

                            <div className="w-full pt-12">
                                <Tag>Categories</Tag>
                                <select
                                    onChange={e =>
                                        setSelectValue(e.target.value)
                                    }
                                    className="hover:text-primary-medium uppercase tracking-[1px] mt-[18px] duration-300 ease-in-out text-[rgb(165,157,145)] p-2 cursor-pointer outline-none w-full bg-white"
                                >
                                    <option value="">all categories</option>
                                    {categories.map((el: Category) => (
                                        <option key={el._id} value={el._id}>
                                            <span className="">{el.name}</span>
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-full py-12">
                                <Tag>subscribe</Tag>
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
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        )
    }
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
    const response = await fetch(`${process.env.API_URL}/api/getposts`, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            'User-Agent': '*'
        }
    })
    const data: Posts = await response.json()

    const response2 = await fetch(`${process.env.API_URL}/api/categories`)
    const categories: Categories = await response2.json()

    return {
        props: {
            posts: data,
            categories
        }, // will be passed to the page component as props
        revalidate: 60 * 1 // 6min
    }
}
