import type { NextPage } from 'next'
import { AiFillGithub, AiFillLinkedin } from 'react-icons/ai/index'

const Footer: NextPage = () => {
    return (
        <div className="px-5 bg-white flex flex-col text-center mt-auto py-[50px]">
            <h2>BatDev</h2>
            <div className="flex flex-col pt-[25px]">
                <p className="text-gray">Name</p>
                <p className="text-gray">Email</p>
            </div>
            <div>
                <ul className="flex justify-center py-[38px] gap-[5px]">
                    <li>
                        <a
                            className="w-10 h-10 flex rounded-full bg-neutral-low-high text-gray justify-center items-center transition-colors duration-300 ease-in-out hover:text-white hover:bg-primary-medium"
                            href="#"
                            target={'_blank'}
                            rel="noreferrer"
                        >
                            <AiFillGithub />
                        </a>
                    </li>
                    <li>
                        <a
                            className="w-10 h-10 flex rounded-full bg-neutral-low-high text-gray justify-center items-center transition-colors duration-300 ease-in-out hover:text-white hover:bg-primary-medium"
                            href="#"
                            target={'_blank'}
                            rel="noreferrer"
                        >
                            <AiFillLinkedin />
                        </a>
                    </li>
                </ul>
            </div>
            <p>
                Made with &#10084; by{' '}
                <a
                    href="#"
                    target={'_blank'}
                    rel="noreferrer"
                    className="text-gray"
                >
                    Name
                </a>
            </p>
        </div>
    )
}

export default Footer
